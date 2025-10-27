import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WildPokemonResponse, PokemonStats } from '../interfaces/pokeapi.interface';

@Injectable()
export class PokeapiService {
    private readonly baseUrl = 'https://pokeapi.co/api/v2';
    private pokemonCache = new Map<number, WildPokemonResponse>();
    private nameCache = new Map<string, WildPokemonResponse>();
    private typeCache = new Map<string, any>();

    constructor(private readonly httpService: HttpService) { }

    async getRandomPokemon(): Promise<WildPokemonResponse> {
        const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs from 1 to 898
        return this.getPokemonById(randomId);
    }

    async getPokemonById(id: number): Promise<WildPokemonResponse> {
        try {
            if (this.pokemonCache.has(id)) return this.pokemonCache.get(id)!;
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/pokemon/${id}`),
            );
            const data = response.data;

            const stats = this.extractStats(data.stats);
            const types = data.types.map((t: any) => t.type.name);

            const result: WildPokemonResponse = {
                id: data.id,
                name: data.name,
                spriteUrl: data.sprites.front_default,
                type1: types[0] || 'normal',
                type2: types[1] || null,
                hp: stats.hp * 5,
                attack: stats.attack,
                defense: stats.defense,
                speed: stats.speed,
            };
            this.pokemonCache.set(id, result);
            this.nameCache.set(data.name.toLowerCase(), result);
            return result;
        } catch (error) {
            throw new Error(`Error fetching Pokémon from PokeAPI: ${error.message}`);
        }
    }

    async getPokemonByName(name: string): Promise<WildPokemonResponse> {
        try {
            const key = name.toLowerCase();
            if (this.nameCache.has(key)) return this.nameCache.get(key)!;
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/pokemon/${name.toLowerCase()}`),
            );
            const data = response.data;

            const stats = this.extractStats(data.stats);
            const types = data.types.map((t: any) => t.type.name);

            const result: WildPokemonResponse = {
                id: data.id,
                name: data.name,
                spriteUrl: data.sprites.front_default,
                type1: types[0] || 'normal',
                type2: types[1] || null,
                hp: stats.hp * 5,
                attack: stats.attack,
                defense: stats.defense,
                speed: stats.speed,
            };
            this.pokemonCache.set(data.id, result);
            this.nameCache.set(key, result);
            return result;
        } catch (error) {
            throw new Error(`Error fetching Pokémon from PokeAPI: ${error.message}`);
        }
    }

    async getTypeEffectiveness(typeName: string): Promise<any> {
        try {
            const key = typeName.toLowerCase();
            if (this.typeCache.has(key)) return this.typeCache.get(key);
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/type/${typeName.toLowerCase()}`),
            );
            this.typeCache.set(key, response.data);
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching type data from PokeAPI: ${error.message}`);
        }
    }

    private extractStats(stats: any[]): PokemonStats {
        const statsMap: PokemonStats = {
            hp: 0,
            attack: 0,
            defense: 0,
            speed: 0,
        };

        stats.forEach((stat) => {
            const statName = stat.stat.name;
            const baseStat = stat.base_stat;

            if (statName === 'hp') statsMap.hp = baseStat;
            if (statName === 'attack') statsMap.attack = baseStat;
            if (statName === 'defense') statsMap.defense = baseStat;
            if (statName === 'speed') statsMap.speed = baseStat;
        });

        return statsMap;
    }
}