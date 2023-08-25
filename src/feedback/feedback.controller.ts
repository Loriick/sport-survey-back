import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback as FeedbackType } from '../types/feedback';
import { ErrorReturnType } from '../types/error';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('feedback')
  async postFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<{ message: string } | ErrorReturnType> {
    return await this.feedbackService.postFeedback(createFeedbackDto);
  }

  @Get('feedback')
  async findAllFeedback(): Promise<FeedbackType[] | ErrorReturnType> {
    return await this.feedbackService.findAllFeedback();
  }
}
