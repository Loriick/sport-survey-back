import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { Feedback } from 'src/typeorm/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
