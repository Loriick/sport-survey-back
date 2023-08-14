import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { Feedback as FeedbackType } from 'src/types/feedback';

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
      console.log(error);
      return {
        message: 'Il semble y avoir un problème. Retentez plus tard',
      };
    }
  }

  async findAllFeedback(): Promise<FeedbackType[]> {
    return await this.feedbackRepository.find();
  }
}
