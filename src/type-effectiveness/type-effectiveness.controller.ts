import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { TypeEffectivenessService } from './type-effectiveness.service';
import { TypeEffectiveness } from './type-effectiveness.entity';

@Controller('type-effectiveness')
export class TypeEffectivenessController {
    constructor(private readonly typeEffectivenessService: TypeEffectivenessService) { }

    @Get()
    findAll(): Promise<TypeEffectiveness[]> {
        return this.typeEffectivenessService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<TypeEffectiveness | null> {
        return this.typeEffectivenessService.findOne(id);
    }

    @Post()
    create(@Body() typeEffectiveness: Partial<TypeEffectiveness>): Promise<TypeEffectiveness> {
        return this.typeEffectivenessService.create(typeEffectiveness);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.typeEffectivenessService.remove(id);
    }
}