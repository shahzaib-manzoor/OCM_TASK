import { IsEnum, IsNotEmpty } from 'class-validator';
import { CaseStatus } from '../../common/enums';

export class UpdateCaseStatusDto {
  @IsEnum(CaseStatus)
  @IsNotEmpty()
  status: CaseStatus;
}
