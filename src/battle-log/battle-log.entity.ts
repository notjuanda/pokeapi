import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Battle } from '../battles/battle.entity';

@Entity('battle_log')
export class BattleLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Battle, (battle) => battle.id, { onDelete: 'CASCADE' })
    battle: Battle;

    @Column({ type: 'int', nullable: false })
    turn: number;

    @Column({ type: 'int', nullable: true })
    playerAttack: number;

    @Column({ type: 'int', nullable: true })
    wildAttack: number;

    @Column({ type: 'int', nullable: true })
    playerHpAfter: number;

    @Column({ type: 'int', nullable: true })
    wildHpAfter: number;

    @Column({ type: 'boolean', default: false })
    usedPotion: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}