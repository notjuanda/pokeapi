import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { LoginPlayerDto } from './dto/login-player.dto';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>,
        @InjectRepository(PlayerPokemon)
        private readonly playerPokemonRepository: Repository<PlayerPokemon>,
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
    ) { }

    async register(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const existing = await this.playersRepository.findOneBy({ username: createPlayerDto.username });
        if (existing) {
            throw new BadRequestException('Username already exists');
        }

        const newPlayer = this.playersRepository.create({
            username: createPlayerDto.username,
            potions: 2,
        });
        return this.playersRepository.save(newPlayer);
    }

    async login(loginPlayerDto: LoginPlayerDto): Promise<{ playerId: number; token: string }> {
        const player = await this.playersRepository.findOneBy({ username: loginPlayerDto.username });
        if (!player) {
            throw new NotFoundException('Player not found');
        }

        // Simple token (in real app, use JWT)
        const token = Buffer.from(player.id.toString()).toString('base64');
        return {
            playerId: player.id,
            token,
        };
    }

    async findOne(id: number): Promise<Player | null> {
        return this.playersRepository.findOneBy({ id });
    }

    async getPlayerPokemon(playerId: number): Promise<any[]> {
        const player = await this.playersRepository.findOneBy({ id: playerId });
        if (!player) {
            throw new NotFoundException('Player not found');
        }

        const captured = await this.playerPokemonRepository.find({
            where: { player: { id: playerId } },
            relations: ['pokemon'],
            order: { capturedAt: 'DESC' },
        });

        return captured.map((pp) => ({
            id: pp.id,
            nickname: pp.nickname,
            currentHp: pp.currentHp,
            capturedAt: pp.capturedAt,
            pokemon: {
                id: pp.pokemon.id,
                apiId: pp.pokemon.apiId,
                name: pp.pokemon.name,
                spriteUrl: pp.pokemon.spriteUrl,
                type1: pp.pokemon.type1,
                type2: pp.pokemon.type2,
                baseHp: pp.pokemon.baseHp,
                baseAttack: pp.pokemon.baseAttack,
                baseDefense: pp.pokemon.baseDefense,
                baseSpeed: pp.pokemon.baseSpeed,
            },
        }));
    }

    async remove(id: number): Promise<void> {
        await this.playersRepository.delete(id);
    }
}