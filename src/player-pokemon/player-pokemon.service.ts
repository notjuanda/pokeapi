import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerPokemon } from './player-pokemon.entity';
import { CapturePokemonDto } from './dto/capture-pokemon.dto';
import { Player } from '../players/player.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Injectable()
export class PlayerPokemonService {
    constructor(
        @InjectRepository(PlayerPokemon)
        private readonly playerPokemonRepository: Repository<PlayerPokemon>,
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>,
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
    ) { }

    async capturePokemon(capturePokemonDto: CapturePokemonDto): Promise<any> {
        // Verify player exists
        const player = await this.playersRepository.findOne({ where: { id: capturePokemonDto.playerId } });
        if (!player) throw new NotFoundException('Player not found');

        // Verify pokemon exists (by local Pokemon id)
        const pokemon = await this.pokemonRepository.findOne({ where: { id: capturePokemonDto.wildPokemonId } });
        if (!pokemon) throw new NotFoundException('Pokemon not found');

        // Count existing Pokémon for the player
        const count = await this.playerPokemonRepository.count({
            where: { player: { id: capturePokemonDto.playerId } },
        });

        if (count >= 10) {
            throw new BadRequestException('Ya cuentas con 10 pokemones');
        }

        // Check for duplicate capture
        const existing = await this.playerPokemonRepository.findOne({
            where: {
                player: { id: capturePokemonDto.playerId },
                pokemon: { id: capturePokemonDto.wildPokemonId },
            },
        });

        if (existing) {
            throw new BadRequestException('El jugador ya capturo este pokemon');
        }

        // Create capture record
        const capture = this.playerPokemonRepository.create({
            player: { id: player.id } as Player,
            pokemon: { id: pokemon.id } as Pokemon,
            nickname: capturePokemonDto.nickname || 'Unnamed',
            capturedAt: new Date(),
            currentHp: pokemon.baseHp ?? 100,
        });

        await this.playerPokemonRepository.save(capture);

        return {
            success: true,
            message: 'Pokémon captured successfully',
            playerPokemon: capture,
        };
    }

    findOne(id: number): Promise<PlayerPokemon | null> {
        return this.playerPokemonRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.playerPokemonRepository.delete(id);
    }
}