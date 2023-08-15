import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from 'src/typeorm/entities/feedback';
import { Feedback as FeedbackType } from 'src/types/feedback';
import { ErrorReturnType } from 'src/types/error';

@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('feedback')
  async postFeedback(
    @Body() feedback: Feedback,
  ): Promise<{ message: string } | ErrorReturnType> {
    return await this.feedbackService.postFeedback(feedback);
  }

  @Get('feedback')
  async findAllFeedback(): Promise<FeedbackType[] | ErrorReturnType> {
    return await this.feedbackService.findAllFeedback();
  }
}
