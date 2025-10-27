import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Player } from '../players/player.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Entity('player_pokemon')
@Unique(['player', 'pokemon'])
export class PlayerPokemon {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player, (player) => player.id, { onDelete: 'CASCADE' })
    player: Player;

    @ManyToOne(() => Pokemon, (pokemon) => pokemon.id)
    pokemon: Pokemon;

    @Column({ type: 'varchar', length: 100, nullable: true })
    nickname: string;

    @Column({ type: 'int', nullable: true })
    currentHp: number;

    @CreateDateColumn({ type: 'timestamp' })
    capturedAt: Date;
}
