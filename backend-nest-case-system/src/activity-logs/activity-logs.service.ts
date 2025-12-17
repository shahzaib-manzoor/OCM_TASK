import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog } from './schemas/activity-log.schema';
import { ActivityEventType, EntityType } from '../common/enums';

export interface CreateActivityLogDto {
  eventType: ActivityEventType;
  entityType: EntityType;
  entityId: string;
  actorUserId: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLog>,
  ) {}

  async createLog(data: CreateActivityLogDto): Promise<ActivityLog> {
    const log = new this.activityLogModel({
      ...data,
      timestamp: new Date(),
    });
    return log.save();
  }

  async findAll(
    filters?: Partial<CreateActivityLogDto>,
  ): Promise<ActivityLog[]> {
    const query = this.activityLogModel.find(filters || {});
    return query.sort({ timestamp: -1 }).limit(100).exec();
  }

  async findByEntity(
    entityType: EntityType,
    entityId: string,
  ): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ entityType, entityId })
      .sort({ timestamp: -1 })
      .exec();
  }

  async findByActor(actorUserId: string): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ actorUserId })
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
  }
}
