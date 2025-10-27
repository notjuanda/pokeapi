import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokeapiService } from './services/pokeapi.service';
import { TypeEffectivenessService as TypeEffectivenessCalcService } from './services/type-effectiveness-calc.service';

@Module({
    imports: [HttpModule],
    providers: [PokeapiService, TypeEffectivenessCalcService],
    exports: [PokeapiService, TypeEffectivenessCalcService],
})
export class CommonModule { }