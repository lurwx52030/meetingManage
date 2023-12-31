import { MeetingMember } from 'src/meeting-member/entities/meeting-member.entity';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryColumn()
  id: string | null;

  @Column()
  name: string;

  @ManyToOne(() => MeetingRoom, (meetingroom) => meetingroom.borrows, {
    onDelete: 'NO ACTION',
  })
  meetingRoom: MeetingRoom;

  @ManyToOne(() => User, (meetingroom) => meetingroom.meetingCreators, {
    onDelete: 'NO ACTION',
  })
  creator: User;

  @Column({
    name: 'createTime',
    type: 'datetime',
  })
  createTime: Date;

  @OneToMany(() => MeetingMember, (meeting) => meeting, {
    onDelete: 'CASCADE',
  })
  meetingParticipants: MeetingMember[];

  @Column({
    name: 'start',
    type: 'datetime',
  })
  start: Date;

  @Column({
    name: 'end',
    type: 'datetime',
  })
  end: Date;

  @Column({ name: 'isCheckin', type: 'bool', default: false })
  isCheckin: boolean;

  @Column({ name: 'checkLimit', type: 'int', default: 5 })
  checkLimit: number;

  @Column({ name: 'isCheckout', type: 'bool', default: false })
  isCheckout: boolean;

  @Column({ name: 'notificationTime', type: 'int', nullable: true })
  notificationTime: number;
}
