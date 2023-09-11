import { Exclude } from 'class-transformer';
import { MeetingMember } from 'src/meeting-member/entities/meeting-member.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column('varchar', {
    nullable: false,
    comment: '姓名',
    length: 15,
  })
  name: string;

  @Column('varchar', {
    nullable: false,
    comment: '帳號',
    length: 20,
  })
  account: string;

  @Column('varchar', {
    nullable: false,
    comment: '加鹽並hash過後的密碼',
  })
  password: string;

  @Column('varchar', {
    nullable: false,
    comment: '密碼加鹽',
  })
  @Exclude({ toPlainOnly: true })
  salt: string | null;

  @Column({
    name: 'lineid',
    type: 'varchar',
    nullable: true,
  })
  lineid: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @OneToMany(() => Meeting, (borrow) => borrow.creator)
  meetingCreators: Meeting[];

  @OneToMany(() => MeetingMember, (meeting) => meeting.participant)
  meetingParticipants: MeetingMember[];
}
