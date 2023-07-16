import { Test, TestingModule } from '@nestjs/testing';
import { MeetingMemberController } from './meeting-member.controller';
import { MeetingMemberService } from './meeting-member.service';

describe('MeetingMemberController', () => {
  let controller: MeetingMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingMemberController],
      providers: [MeetingMemberService],
    }).compile();

    controller = module.get<MeetingMemberController>(MeetingMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
