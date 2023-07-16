import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MeetingroomBorrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MeetingRoom, (meetingroom) => meetingroom.borrows)
  meetingRoom: MeetingRoom;

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
}
