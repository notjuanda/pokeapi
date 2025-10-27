import { Controller, Post, Body } from '@nestjs/common';
import { PlayerPokemonService } from './player-pokemon.service';
import { CapturePokemonDto } from './dto/capture-pokemon.dto';

@Controller('api/player-pokemon')
export class PlayerPokemonController {
    constructor(private readonly playerPokemonService: PlayerPokemonService) { }

    @Post('capture')
    capturePokemon(@Body() capturePokemonDto: CapturePokemonDto): Promise<any> {
        return this.playerPokemonService.capturePokemon(capturePokemonDto);
    }
}