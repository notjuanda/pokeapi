import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.entity';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get()
    findAll(): Promise<Pokemon[]> {
        return this.pokemonService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Pokemon | null> {
        return this.pokemonService.findOne(id);
    }

    @Post()
    create(@Body() pokemon: Partial<Pokemon>): Promise<Pokemon> {
        return this.pokemonService.create(pokemon);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.pokemonService.remove(id);
    }
}