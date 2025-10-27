import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeEffectivenessService {
    private readonly typeChart = {
        normal: { super_effective_against: [], weak_to: ['fighting'], resists: [], immune_to: ['ghost'] },
        fire: { super_effective_against: ['grass', 'ice', 'bug', 'steel'], weak_to: ['water', 'ground', 'rock'], resists: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune_to: [] },
        water: { super_effective_against: ['fire', 'ground', 'rock'], weak_to: ['grass', 'electric'], resists: ['steel', 'fire', 'water', 'ice'], immune_to: [] },
        grass: { super_effective_against: ['water', 'ground', 'rock'], weak_to: ['fire', 'ice', 'poison', 'flying', 'bug'], resists: ['ground', 'water', 'grass', 'electric'], immune_to: [] },
        electric: { super_effective_against: ['water', 'flying'], weak_to: ['ground'], resists: ['flying', 'steel', 'electric'], immune_to: [] },
        ice: { super_effective_against: ['grass', 'ground', 'flying', 'dragon'], weak_to: ['fire', 'fighting', 'rock', 'steel'], resists: ['ice'], immune_to: [] },
        fighting: { super_effective_against: ['normal', 'ice', 'rock', 'dark', 'steel'], weak_to: ['flying', 'psychic', 'fairy'], resists: ['rock', 'bug', 'dark'], immune_to: [] },
        poison: { super_effective_against: ['grass', 'fairy'], weak_to: ['ground', 'psychic'], resists: ['fighting', 'poison', 'bug', 'grass'], immune_to: [] },
        ground: { super_effective_against: ['fire', 'electric', 'poison', 'rock', 'steel'], weak_to: ['water', 'grass', 'ice'], resists: ['poison', 'rock'], immune_to: ['electric'] },
        flying: { super_effective_against: ['fighting', 'bug', 'grass'], weak_to: ['electric', 'ice', 'rock'], resists: ['fighting', 'bug', 'grass'], immune_to: ['ground'] },
        psychic: { super_effective_against: ['fighting', 'poison'], weak_to: ['bug', 'ghost', 'dark'], resists: ['fighting', 'psychic'], immune_to: [] },
        bug: { super_effective_against: ['grass', 'psychic', 'dark'], weak_to: ['fire', 'flying', 'rock'], resists: ['fighting', 'ground', 'grass'], immune_to: [] },
        rock: { super_effective_against: ['fire', 'ice', 'flying', 'bug'], weak_to: ['water', 'grass', 'fighting', 'ground', 'steel'], resists: ['normal', 'flying', 'poison', 'fire'], immune_to: [] },
        ghost: { super_effective_against: ['ghost', 'psychic'], weak_to: ['ghost', 'dark'], resists: ['poison', 'bug'], immune_to: ['normal', 'fighting'] },
        dragon: { super_effective_against: ['dragon'], weak_to: ['ice', 'dragon', 'fairy'], resists: ['fire', 'water', 'grass', 'electric'], immune_to: [] },
        dark: { super_effective_against: ['ghost', 'psychic'], weak_to: ['fighting', 'bug', 'fairy'], resists: ['ghost', 'dark'], immune_to: ['psychic'] },
        steel: { super_effective_against: ['ice', 'rock', 'fairy'], weak_to: ['fire', 'water', 'ground'], resists: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'], immune_to: ['poison'] },
        fairy: { super_effective_against: ['fighting', 'bug', 'dark'], weak_to: ['poison', 'steel'], resists: ['fighting', 'bug'], immune_to: ['dragon'] },
    };

    getEffectivenessMultiplier(attackerType: string, defenderType: string): number {
        const attacker = this.typeChart[attackerType.toLowerCase()];
        const defender = this.typeChart[defenderType.toLowerCase()];
        if (!attacker) return 1;

        // Immunity (0x) based on defender
        if (defender && defender.immune_to.includes(attackerType.toLowerCase())) {
            return 0;
        }

        // Super effective (2x)
        if (attacker.super_effective_against.includes(defenderType.toLowerCase())) {
            return 2;
        }

        // Not very effective (0.5x)
        if (attacker.weak_to.includes(defenderType.toLowerCase())) {
            return 0.5;
        }

        return 1;
    }

    getCombinedEffectiveness(attackerType: string, defenderType1: string, defenderType2?: string | null): number {
        const type1 = defenderType1 || 'normal';
        const m1 = this.getEffectivenessMultiplier(attackerType, type1);
        if (m1 === 0) return 0;
        if (!defenderType2) return m1;
        const m2 = this.getEffectivenessMultiplier(attackerType, defenderType2);
        return m1 * m2;
    }

    calculateDamage(
        attackerAttack: number,
        defenderDefense: number,
        attackerType: string,
        defenderType: string,
    ): number {
        const baseMultiplier = (attackerAttack / defenderDefense) * 100;
        const typeMultiplier = this.getEffectivenessMultiplier(attackerType, defenderType);
        const randomFactor = Math.random() * 0.15 + 0.85; // 85-100% de variación

        return Math.round(baseMultiplier * typeMultiplier * randomFactor);
    }

    calculateDamageVsDual(
        attackerAttack: number,
        defenderDefense: number,
        attackerType: string,
        defenderType1: string,
        defenderType2?: string | null,
    ): number {
        const baseMultiplier = (attackerAttack / defenderDefense) * 100;
        const typeMultiplier = this.getCombinedEffectiveness(attackerType, defenderType1, defenderType2);
        const randomFactor = Math.random() * 0.15 + 0.85;
        return Math.round(baseMultiplier * typeMultiplier * randomFactor);
    }
}