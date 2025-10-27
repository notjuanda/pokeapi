import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Battle } from './battle.entity';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { CommonModule } from '../common/common.module';
import { Player } from '../players/player.entity';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';
import { PlayerPokemonModule } from '../player-pokemon/player-pokemon.module';
import { BattleLog } from '../battle-log/battle-log.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Battle, Player, PlayerPokemon, Pokemon, BattleLog]),
        CommonModule,
        PlayerPokemonModule,
    ],
    providers: [BattlesService],
    controllers: [BattlesController],
})
export class BattlesModule { }