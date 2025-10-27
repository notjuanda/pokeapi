import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Player, PlayerPokemon, Pokemon])],
    providers: [PlayersService],
    controllers: [PlayersController],
})
export class PlayersModule { }