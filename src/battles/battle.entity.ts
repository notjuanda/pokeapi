import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Player } from '../players/player.entity';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Entity('battles')
export class Battle {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: 'CASCADE' })
    player: Player;

    @ManyToOne(() => PlayerPokemon, (playerPokemon) => playerPokemon.id)
    playerPokemon: PlayerPokemon;

    @ManyToOne(() => Pokemon, (pokemon) => pokemon.id)
    wildPokemon: Pokemon;

    @Column({ type: 'varchar', length: 50, nullable: true })
    winner: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    startedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    endedAt: Date;

    // Battle state snapshots and runtime values
    @Column({ type: 'int', nullable: true })
    playerBaseHp: number | null;

    @Column({ type: 'int', nullable: true })
    playerCurrentHp: number | null;

    @Column({ type: 'int', nullable: true })
    playerAttack: number | null;

    @Column({ type: 'int', nullable: true })
    playerDefense: number | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    playerType1: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    playerType2: string | null;

    @Column({ type: 'int', default: 2 })
    potionsRemaining: number;

    @Column({ type: 'int', nullable: true })
    wildBaseHp: number | null;

    @Column({ type: 'int', nullable: true })
    wildCurrentHp: number | null;

    @Column({ type: 'int', nullable: true })
    wildAttack: number | null;

    @Column({ type: 'int', nullable: true })
    wildDefense: number | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    wildType1: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    wildType2: string | null;
}
