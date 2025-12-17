import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignCaseDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
