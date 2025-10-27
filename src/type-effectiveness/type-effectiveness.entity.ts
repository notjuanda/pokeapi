import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('type_effectiveness')
export class TypeEffectiveness {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    attackerType: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    defenderType: string;

    @Column({ type: 'float', nullable: false })
    multiplier: number;
}