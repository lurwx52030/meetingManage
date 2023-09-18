import { Meeting } from 'src/meeting/entities/meeting.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MeetingMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.meetingParticipants, {
    onDelete: 'NO ACTION',
  })
  participant: User;

  @ManyToOne(() => Meeting, (meeting) => meeting.meetingParticipants, {
    onDelete: 'CASCADE',
  })
  meeting: Meeting;

  @Column({
    name: 'singin',
    type: 'datetime',
    nullable: true,
  })
  singin: Date;

  @Column({
    name: 'singout',
    type: 'datetime',
    nullable: true,
  })
  singout: Date;
}
