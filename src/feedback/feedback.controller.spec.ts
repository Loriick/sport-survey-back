import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

const feedbacks = [
  {
    id: 1,
    author: 'John Doe',
    feedback: "Génial l'appli merci",
  },
];

const expectResponse = { message: 'ok' };

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService],
      controllers: [FeedbackController],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a feedback', async () => {
    jest.spyOn(service, 'postFeedback').mockResolvedValue({ message: 'ok' });

    expect(await controller.postFeedback(feedbacks[0])).toBe(expectResponse);
  });

  it('should return all feedback', async () => {
    jest
      .spyOn(service, 'findAllFeedback')
      .mockImplementation(async () => feedbacks);

    expect(await controller.findAllFeedback()).toBe(feedbacks);
  });
});
