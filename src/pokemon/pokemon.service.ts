import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Injectable()
export class PokemonService {
    constructor(
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
    ) { }

    findAll(): Promise<Pokemon[]> {
        return this.pokemonRepository.find();
    }

    async findOne(id: number): Promise<Pokemon | null> {
        return this.pokemonRepository.findOneBy({ id });
    }

    create(pokemon: Partial<Pokemon>): Promise<Pokemon> {
        const newPokemon = this.pokemonRepository.create(pokemon);
        return this.pokemonRepository.save(newPokemon);
    }

    async remove(id: number): Promise<void> {
        await this.pokemonRepository.delete(id);
    }
}