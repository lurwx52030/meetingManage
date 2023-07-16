import { Test, TestingModule } from '@nestjs/testing';
import { MeetingMemberService } from './meeting-member.service';

describe('MeetingMemberService', () => {
  let service: MeetingMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingMemberService],
    }).compile();

    service = module.get<MeetingMemberService>(MeetingMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
