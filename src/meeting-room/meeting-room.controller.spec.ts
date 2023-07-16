import { Test, TestingModule } from '@nestjs/testing';
import { MettingRoomController } from './meeting-room.controller';
import { MeetingRoomService } from './meeting-room.service';

describe('MettingRoomController', () => {
  let controller: MettingRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MettingRoomController],
      providers: [MeetingRoomService],
    }).compile();

    controller = module.get<MettingRoomController>(MettingRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
