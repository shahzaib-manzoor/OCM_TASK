import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { Assignment } from './entities/assignment.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';
import { AssignCaseDto } from './dto/assign-case.dto';
import {
  ActivityEventType,
  EntityType,
  UserRole,
  CaseStatus,
} from '../common/enums';
import { PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private readonly casesRepository: Repository<Case>,
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    createCaseDto: CreateCaseDto,
    createdBy: string,
  ): Promise<Case> {
    const caseEntity = this.casesRepository.create({
      ...createCaseDto,
      createdBy,
      status: CaseStatus.OPEN,
    });

    const savedCase = await this.casesRepository.save(caseEntity);

    // Log case creation
    await this.activityLogsService.createLog({
      eventType: ActivityEventType.CASE_CREATED,
      entityType: EntityType.CASE,
      entityId: savedCase.id,
      actorUserId: createdBy,
      metadata: {
        title: savedCase.title,
        status: savedCase.status,
      },
    });

    return savedCase;
  }

  async findAll(
    userId: string,
    userRole: UserRole,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Case>> {
    const skip = (page - 1) * limit;

    let query = this.casesRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.assignment', 'assignment')
      .leftJoinAndSelect('assignment.user', 'assignedUser')
      .leftJoinAndSelect('case.creator', 'creator');

    // Users can only see their assigned cases
    if (userRole === UserRole.USER) {
      query = query.where('assignment.userId = :userId', { userId });
    }

    const [cases, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('case.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: cases,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string, userRole: UserRole): Promise<Case> {
    const caseEntity = await this.casesRepository.findOne({
      where: { id },
      relations: ['assignment', 'assignment.user', 'creator'],
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    // Check access permissions
    if (userRole === UserRole.USER) {
      if (!caseEntity.assignment || caseEntity.assignment.userId !== userId) {
        throw new ForbiddenException('You do not have access to this case');
      }
    }

    return caseEntity;
  }

  async updateStatus(
    id: string,
    updateCaseStatusDto: UpdateCaseStatusDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Case> {
    const caseEntity = await this.findOne(id, userId, userRole);

    const oldStatus = caseEntity.status;
    caseEntity.status = updateCaseStatusDto.status;

    const updated = await this.casesRepository.save(caseEntity);

    // Log status update
    await this.activityLogsService.createLog({
      eventType: ActivityEventType.CASE_STATUS_UPDATED,
      entityType: EntityType.CASE,
      entityId: updated.id,
      actorUserId: userId,
      metadata: {
        oldStatus,
        newStatus: updated.status,
      },
    });

    return updated;
  }

  async assignCase(
    id: string,
    assignCaseDto: AssignCaseDto,
    adminId: string,
  ): Promise<Assignment> {
    const caseEntity = await this.casesRepository.findOne({
      where: { id },
      relations: ['assignment'],
    });

    if (!caseEntity) {
      throw new NotFoundException('Case not found');
    }

    // Check if case is already assigned
    if (caseEntity.assignment) {
      throw new BadRequestException('Case is already assigned');
    }

    // Create assignment
    const assignment = this.assignmentsRepository.create({
      caseId: id,
      userId: assignCaseDto.userId,
    });

    const savedAssignment = await this.assignmentsRepository.save(assignment);

    // Log assignment
    await this.activityLogsService.createLog({
      eventType: ActivityEventType.CASE_ASSIGNED,
      entityType: EntityType.ASSIGNMENT,
      entityId: savedAssignment.id,
      actorUserId: adminId,
      metadata: {
        caseId: id,
        assignedUserId: assignCaseDto.userId,
      },
    });

    return savedAssignment;
  }
}
