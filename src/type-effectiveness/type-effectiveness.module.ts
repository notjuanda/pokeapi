import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEffectiveness } from './type-effectiveness.entity';
import { TypeEffectivenessService } from './type-effectiveness.service';
import { TypeEffectivenessController } from './type-effectiveness.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TypeEffectiveness])],
    providers: [TypeEffectivenessService],
    controllers: [TypeEffectivenessController],
})
export class TypeEffectivenessModule { }