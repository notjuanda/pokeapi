import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEffectiveness } from './type-effectiveness.entity';

@Injectable()
export class TypeEffectivenessService {
    constructor(
        @InjectRepository(TypeEffectiveness)
        private readonly typeEffectivenessRepository: Repository<TypeEffectiveness>,
    ) { }

    findAll(): Promise<TypeEffectiveness[]> {
        return this.typeEffectivenessRepository.find();
    }

    async findOne(id: number): Promise<TypeEffectiveness | null> {
        return this.typeEffectivenessRepository.findOneBy({ id });
    }

    create(typeEffectiveness: Partial<TypeEffectiveness>): Promise<TypeEffectiveness> {
        const newTypeEffectiveness = this.typeEffectivenessRepository.create(typeEffectiveness);
        return this.typeEffectivenessRepository.save(newTypeEffectiveness);
    }

    async remove(id: number): Promise<void> {
        await this.typeEffectivenessRepository.delete(id);
    }
}