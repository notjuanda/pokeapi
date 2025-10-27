export interface PokemonStats {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
}

export interface WildPokemonResponse {
    id: number;
    name: string;
    spriteUrl: string;
    type1: string;
    type2: string | null;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
}