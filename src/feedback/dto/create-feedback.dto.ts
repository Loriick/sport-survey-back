import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  author: string;
  email?: string;
  @IsNotEmpty()
  feedback: string;
}
