import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from 'src/typeorm/entities/feedback';
import { Feedback as FeedbackType } from 'src/types/feedback';

@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('feedback')
  async postFeedback(@Body() feedback: Feedback): Promise<{ message: string }> {
    return await this.feedbackService.postFeedback(feedback);
  }

  @Get('feedback')
  async findAllFeedback(): Promise<FeedbackType[]> {
    return await this.feedbackService.findAllFeedback();
  }
}
