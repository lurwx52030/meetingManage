import { Test, TestingModule } from '@nestjs/testing';
import { MeetingroomBorrowController } from './meetingroom-borrow.controller';
import { MeetingroomBorrowService } from './meetingroom-borrow.service';

describe('MeetingroomBorrowController', () => {
  let controller: MeetingroomBorrowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingroomBorrowController],
      providers: [MeetingroomBorrowService],
    }).compile();

    controller = module.get<MeetingroomBorrowController>(
      MeetingroomBorrowController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
