import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([Player, PlayerPokemon, Pokemon]), CommonModule],
    providers: [PlayersService],
    controllers: [PlayersController],
})
export class PlayersModule { }