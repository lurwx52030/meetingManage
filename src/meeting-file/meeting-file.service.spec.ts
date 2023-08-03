import { Test, TestingModule } from '@nestjs/testing';
import { MeetingFileService } from './meeting-file.service';

describe('MeetingFileService', () => {
  let service: MeetingFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingFileService],
    }).compile();

    service = module.get<MeetingFileService>(MeetingFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
