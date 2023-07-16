import { Test, TestingModule } from '@nestjs/testing';
import { MeetingroomBorrowService } from './meetingroom-borrow.service';

describe('MeetingroomBorrowService', () => {
  let service: MeetingroomBorrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingroomBorrowService],
    }).compile();

    service = module.get<MeetingroomBorrowService>(MeetingroomBorrowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
