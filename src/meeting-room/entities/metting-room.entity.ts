import { Meeting } from 'src/meeting/entities/meeting.entity';
import { MeetingroomBorrow } from 'src/meetingroom-borrow/entities/meetingroom-borrow.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class MeetingRoom {
  @PrimaryColumn()
  id: string;

  @Column('varchar', {
    nullable: false,
    comment: '會議室名稱',
    length: 15,
  })
  name: string;

  @Column('varchar', {
    nullable: false,
    comment: '會議室位置',
    length: 15,
  })
  location: string;

  @OneToMany(() => Meeting, (borrow) => borrow.meetingRoom)
  borrows: Meeting[];
}
