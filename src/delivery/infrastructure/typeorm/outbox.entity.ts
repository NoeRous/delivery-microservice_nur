import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('outbox')
export class OutboxEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventName: string;

  @Column('json')
  payload: any;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;
}