import { Controller, Get } from '@nestjs/common';
import { PokeapiService } from '../common/services/pokeapi.service';
import { WildPokemonResponse } from '../common/interfaces/pokeapi.interface';

@Controller('api/wild-pokemon')
export class WildPokemonController {
    constructor(private readonly pokeapiService: PokeapiService) { }

    @Get('random')
    async getRandomWildPokemon(): Promise<WildPokemonResponse> {
        return this.pokeapiService.getRandomPokemon();
    }
}