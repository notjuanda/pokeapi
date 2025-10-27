import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Player } from './players/player.entity';
import { Pokemon } from './pokemon/pokemon.entity';
import { PlayerPokemon } from './player-pokemon/player-pokemon.entity';
import { Battle } from './battles/battle.entity';
import { BattleLog } from './battle-log/battle-log.entity';
import { TypeEffectiveness } from './type-effectiveness/type-effectiveness.entity';
import { PlayersModule } from './players/players.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { PlayerPokemonModule } from './player-pokemon/player-pokemon.module';
import { BattlesModule } from './battles/battles.module';
import { BattleLogModule } from './battle-log/battle-log.module';
import { TypeEffectivenessModule } from './type-effectiveness/type-effectiveness.module';
import { CommonModule } from './common/common.module';
import { WildPokemonModule } from './wild-pokemon/wild-pokemon.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'pokeapi',
      entities: [Player, Pokemon, PlayerPokemon, Battle, BattleLog, TypeEffectiveness],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Player, Pokemon, PlayerPokemon, Battle, BattleLog, TypeEffectiveness]),
    CommonModule,
    PlayersModule,
    PokemonModule,
    PlayerPokemonModule,
    BattlesModule,
    BattleLogModule,
    TypeEffectivenessModule,
    WildPokemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
