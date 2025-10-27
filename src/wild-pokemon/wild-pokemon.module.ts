import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { WildPokemonController } from './wild-pokemon.controller';

@Module({
    imports: [CommonModule],
    controllers: [WildPokemonController],
})
export class WildPokemonModule { }