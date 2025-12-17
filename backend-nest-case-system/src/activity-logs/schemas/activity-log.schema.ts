import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ActivityEventType, EntityType } from '../../common/enums';

@Schema({ collection: 'activity_logs', timestamps: true })
export class ActivityLog extends Document {
  @Prop({ required: true, type: String, enum: ActivityEventType })
  eventType: ActivityEventType;

  @Prop({ required: true, type: String, enum: EntityType })
  entityType: EntityType;

  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  actorUserId: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
