import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { Feedback as FeedbackType } from 'src/types/feedback';
import { ErrorReturnType } from 'src/types/error';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async postFeedback(feedback: FeedbackType): Promise<{ message: string }> {
    try {
      const createdFeedback = this.feedbackRepository.create(feedback);

      await this.feedbackRepository.save(createdFeedback);
      return {
        message: 'Votre avis nous à bien été envoyé. Merci',
      };
    } catch (error) {
      return {
        message: 'Il semble y avoir un problème. Retentez plus tard',
      };
    }
  }

  async findAllFeedback(): Promise<FeedbackType[] | ErrorReturnType> {
    try {
      return await this.feedbackRepository.find();
    } catch (error) {
      return error;
    }
  }
}
