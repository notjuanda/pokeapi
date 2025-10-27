import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('players')
@Unique(['username'])
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    username: string;

    @Column({ type: 'int', default: 2 })
    potions: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
