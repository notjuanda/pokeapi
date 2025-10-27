import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pokemon')
export class Pokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    apiId: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    spriteUrl: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    type1: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    type2: string;

    @Column({ type: 'int', nullable: true })
    baseHp: number;

    @Column({ type: 'int', nullable: true })
    baseAttack: number;

    @Column({ type: 'int', nullable: true })
    baseDefense: number;

    @Column({ type: 'int', nullable: true })
    baseSpeed: number;
}
