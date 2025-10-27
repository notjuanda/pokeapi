import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { LoginPlayerDto } from './dto/login-player.dto';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';
import { PokeapiService } from '../common/services/pokeapi.service';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>,
        @InjectRepository(PlayerPokemon)
        private readonly playerPokemonRepository: Repository<PlayerPokemon>,
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
        private readonly pokeapiService: PokeapiService,
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
        const saved = await this.playersRepository.save(newPlayer);

        // Grant random starter on register (upsert into Pokemon, then create PlayerPokemon)
        const starter = await this.pokeapiService.getRandomPokemon();
        let starterDb = await this.pokemonRepository.findOne({ where: { apiId: starter.id } });
        if (!starterDb) {
            starterDb = this.pokemonRepository.create({
                apiId: starter.id,
                name: starter.name,
                spriteUrl: starter.spriteUrl,
                type1: starter.type1,
                type2: starter.type2 ?? undefined,
                baseHp: starter.hp,
                baseAttack: starter.attack,
                baseDefense: starter.defense,
                baseSpeed: starter.speed,
            });
            await this.pokemonRepository.save(starterDb);
        }

        const starterCapture = this.playerPokemonRepository.create({
            player: { id: saved.id } as Player,
            pokemon: { id: starterDb.id } as Pokemon,
            nickname: starter.name,
            currentHp: starterDb.baseHp ?? starter.hp,
            capturedAt: new Date(),
        });
        await this.playerPokemonRepository.save(starterCapture);

        return saved;
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