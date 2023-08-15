import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { Feedback as FeedbackType } from 'src/types/feedback';
import { ErrorReturnType } from 'src/types/error';
import { Client } from '@notionhq/client';

@Injectable()
export class FeedbackService {
  notion: Client;
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {
    this.notion = new Client({
      auth: process.env.NOTION_KEY,
    });
  }

  async postFeedback(feedback: FeedbackType): Promise<{ message: string }> {
    try {
      const createdFeedback = this.feedbackRepository.create(feedback);

      await this.feedbackRepository.save(createdFeedback);

      await this.addFeedback({
        ...feedback,
      });

      return {
        message: 'Votre avis nous à bien été envoyé. Merci',
      };
    } catch (error) {
      return {
        message: 'Il semble y avoir un problème. Retentez plus tard',
      };
    }
  }

  private async addFeedback({ author, feedback, email }: FeedbackType) {
    try {
      await this.notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          Author: {
            title: [
              {
                type: 'text',
                text: { content: author },
                annotations: { bold: true },
              },
            ],
          },
          Message: {
            type: 'rich_text',
            rich_text: [
              {
                text: {
                  content: feedback,
                },
                type: 'text',
              },
            ],
          },
          Email: {
            type: 'email',
            email,
          },
        },
      });
    } catch (error) {
      return {
        message: error.body,
      };
    }
  }

  async findAllFeedback(): Promise<FeedbackType[] | ErrorReturnType> {
    try {
      return await this.feedbackRepository.find();
    } catch (error) {
      return { message: error };
    }
  }
}
