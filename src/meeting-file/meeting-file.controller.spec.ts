import { Test, TestingModule } from '@nestjs/testing';
import { MeetingFileController } from './meeting-file.controller';
import { MeetingFileService } from './meeting-file.service';

describe('MeetingFileController', () => {
  let controller: MeetingFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingFileController],
      providers: [MeetingFileService],
    }).compile();

    controller = module.get<MeetingFileController>(MeetingFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
