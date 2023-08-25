import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feedback } from '../typeorm/entities';

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
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: { create: jest.fn(), save: jest.fn(), find: jest.fn() },
        },
      ],
      controllers: [FeedbackController],
    }).compile();

    controller = module.get(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a feedback', async () => {
    jest.spyOn(service, 'postFeedback').mockResolvedValue({ message: 'ok' });

    expect(await controller.postFeedback(feedbacks[0])).toStrictEqual(
      expectResponse,
    );
  });

  it('should return all feedback', async () => {
    jest
      .spyOn(service, 'findAllFeedback')
      .mockImplementation(async () => feedbacks);

    expect(await controller.findAllFeedback()).toBe(feedbacks);
  });
});
