import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';
import { AssignCaseDto } from './dto/assign-case.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body() createCaseDto: CreateCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.casesService.create(createCaseDto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.casesService.findAll(
      user.id,
      user.role,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.casesService.findOne(id, user.id, user.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateCaseStatusDto: UpdateCaseStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.casesService.updateStatus(
      id,
      updateCaseStatusDto,
      user.id,
      user.role,
    );
  }

  @Post(':id/assign')
  @Roles(UserRole.ADMIN)
  assignCase(
    @Param('id') id: string,
    @Body() assignCaseDto: AssignCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.casesService.assignCase(id, assignCaseDto, user.id);
  }
}
