import { Test, TestingModule } from '@nestjs/testing';
import { MeetingRoomService } from './meeting-room.service';

describe('MeetingRoomService', () => {
  let service: MeetingRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingRoomService],
    }).compile();

    service = module.get<MeetingRoomService>(MeetingRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
