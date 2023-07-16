import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class meetingSequence {
  @PrimaryGeneratedColumn()
  id: number;
}
