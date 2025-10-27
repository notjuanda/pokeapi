import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerPokemon } from './player-pokemon.entity';
import { PlayerPokemonService } from './player-pokemon.service';
import { PlayerPokemonController } from './player-pokemon.controller';
import { Player } from '../players/player.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PlayerPokemon, Player, Pokemon])],
    providers: [PlayerPokemonService],
    controllers: [PlayerPokemonController],
    exports: [PlayerPokemonService],
})
export class PlayerPokemonModule { }