import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
