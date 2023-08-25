import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../typeorm/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

const user = {
  id: 1,
  email: 'email@email.com',
  displayName: 'name',
  username: '',
  picturePath: './photo.png',
  provider: 'google',
  providerId: '123',
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOneBy: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should update the user', async () => {
    jest
      .spyOn(service, 'updateUser')
      .mockResolvedValue({ ...user, username: 'username' });
    expect(
      await controller.updateUser({ username: 'username' }, 1),
    ).toStrictEqual({ ...user, username: 'username' });
  });
});
