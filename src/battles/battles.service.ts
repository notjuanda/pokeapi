import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './battle.entity';
import { StartBattleDto } from './dto/start-battle.dto';
import { BattleTurnDto } from './dto/battle-turn.dto';
import { CaptureWildDto } from './dto/capture-wild.dto';
import { PokeapiService } from '../common/services/pokeapi.service';
import { TypeEffectivenessService as TypeEffectivenessCalcService } from '../common/services/type-effectiveness-calc.service';
import { Player } from '../players/player.entity';
import { PlayerPokemon } from '../player-pokemon/player-pokemon.entity';
import { Pokemon } from '../pokemon/pokemon.entity';
import { BattleLog } from '../battle-log/battle-log.entity';
import { PlayerPokemonService } from '../player-pokemon/player-pokemon.service';

@Injectable()
export class BattlesService {
    constructor(
        @InjectRepository(Battle)
        private readonly battlesRepository: Repository<Battle>,
        @InjectRepository(Player)
        private readonly playersRepository: Repository<Player>,
        @InjectRepository(PlayerPokemon)
        private readonly playerPokemonRepository: Repository<PlayerPokemon>,
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
        private readonly pokeapiService: PokeapiService,
        private readonly typeEffectivenessService: TypeEffectivenessCalcService,
        private readonly playerPokemonService: PlayerPokemonService,
        @InjectRepository(BattleLog)
        private readonly battleLogRepository: Repository<BattleLog>,
    ) { }

    async startBattle(startBattleDto: StartBattleDto): Promise<any> {
        const player = await this.playersRepository.findOne({ where: { id: startBattleDto.playerId } });
        if (!player) throw new NotFoundException('Player not found');

        const playerPokemon = await this.playerPokemonRepository.findOne({ where: { id: startBattleDto.playerPokemonId }, relations: ['pokemon'] });
        if (!playerPokemon || !playerPokemon.pokemon) throw new BadRequestException('Player Pokémon not found or invalid');

        // Fetch wild Pokémon from PokeAPI (use provided apiId if present)
        const wild = startBattleDto.wildApiId
            ? await this.pokeapiService.getPokemonById(startBattleDto.wildApiId)
            : await this.pokeapiService.getRandomPokemon();

        // Upsert wild pokemon into local Pokemon table by apiId
        let wildDb = await this.pokemonRepository.findOne({ where: { apiId: wild.id } });
        if (!wildDb) {
            wildDb = this.pokemonRepository.create({
                apiId: wild.id,
                name: wild.name,
                spriteUrl: wild.spriteUrl,
                type1: wild.type1,
                type2: wild.type2 ?? undefined,
                baseHp: wild.hp,
                baseAttack: wild.attack,
                baseDefense: wild.defense,
                baseSpeed: wild.speed,
            });
            await this.pokemonRepository.save(wildDb);
        }

        const pkm = playerPokemon.pokemon;
        const playerBaseHp = pkm.baseHp ?? 100;
        const wildBaseHp = wildDb.baseHp ?? wild.hp;

        const battle = this.battlesRepository.create({
            player: { id: player.id } as Player,
            playerPokemon: { id: playerPokemon.id } as PlayerPokemon,
            wildPokemon: { id: wildDb.id } as Pokemon,
            startedAt: new Date(),
            potionsRemaining: 2,
            playerBaseHp,
            playerCurrentHp: playerBaseHp,
            playerAttack: pkm.baseAttack ?? 50,
            playerDefense: pkm.baseDefense ?? 50,
            playerType1: pkm.type1 ?? 'normal',
            playerType2: pkm.type2 ?? null,
            wildBaseHp,
            wildCurrentHp: wildBaseHp,
            wildAttack: wildDb.baseAttack ?? wild.attack,
            wildDefense: wildDb.baseDefense ?? wild.defense,
            wildType2: wildDb.type2 ?? (wild.type2 ?? null),
        });

        await this.battlesRepository.save(battle);

        return {
            battleId: battle.id,
            player: { hp: battle.playerCurrentHp, baseHp: battle.playerBaseHp },
            wildPokemon: {
                id: wildDb.apiId,
                name: wildDb.name,
                spriteUrl: wildDb.spriteUrl,
                type1: battle.wildType1,
                type2: battle.wildType2,
                hp: battle.wildCurrentHp,
                attack: battle.wildAttack,
                defense: battle.wildDefense,
            },
        };
    }

    async executeTurn(battleTurnDto: BattleTurnDto): Promise<any> {
        const battle = await this.battlesRepository.findOne({ where: { id: battleTurnDto.battleId }, relations: ['player'] });
        if (!battle) {
            throw new NotFoundException('Battle not found');
        }

        if (battle.winner) {
            throw new BadRequestException('Battle already ended');
        }

        const playerAtk = battle.playerAttack ?? 50;
        const playerDef = battle.playerDefense ?? 50;
        const playerType1 = battle.playerType1 ?? 'normal';
        const playerType2 = battle.playerType2 ?? null;

        const wildAtk = battle.wildAttack ?? 50;
        const wildDef = battle.wildDefense ?? 50;
        const wildType1 = battle.wildType1 ?? 'normal';
        const wildType2 = battle.wildType2 ?? null;

        // Simultaneous damage
        const dmgToWild = this.typeEffectivenessService.calculateDamageVsDual(
            playerAtk,
            wildDef,
            playerType1,
            wildType1,
            wildType2,
        );
        const dmgToPlayer = this.typeEffectivenessService.calculateDamageVsDual(
            wildAtk,
            playerDef,
            wildType1,
            playerType1,
            playerType2,
        );

        battle.wildCurrentHp = Math.max(0, (battle.wildCurrentHp ?? 0) - dmgToWild);
        battle.playerCurrentHp = Math.max(0, (battle.playerCurrentHp ?? 0) - dmgToPlayer);

        // Apply potion after attacks: consume from Player.potions
        let usedPotion = false;
        if (battleTurnDto.usePotion && (battle.playerCurrentHp ?? 0) > 0) {
            const player = await this.playersRepository.findOne({ where: { id: battle.player.id } });
            if (player && player.potions > 0) {
                const healAmount = Math.round((battle.playerBaseHp ?? 100) * 0.5);
                battle.playerCurrentHp = Math.min(battle.playerBaseHp ?? 100, (battle.playerCurrentHp ?? 0) + healAmount);
                player.potions -= 1;
                usedPotion = true;
                await this.playersRepository.save(player);
            }
        }

        // Determine winner
        if ((battle.wildCurrentHp ?? 0) <= 0 && (battle.playerCurrentHp ?? 0) > 0) {
            battle.winner = 'player';
            battle.endedAt = new Date();
        } else if ((battle.playerCurrentHp ?? 0) <= 0 && (battle.wildCurrentHp ?? 0) > 0) {
            battle.winner = 'wild';
            battle.endedAt = new Date();
        } else if ((battle.playerCurrentHp ?? 0) <= 0 && (battle.wildCurrentHp ?? 0) <= 0) {
            battle.winner = 'draw';
            battle.endedAt = new Date();
        }

        await this.battlesRepository.save(battle);

        // Create battle log entry for this turn
        const turnCount = await this.battleLogRepository.count({ where: { battle: { id: battle.id } } });
        const log = this.battleLogRepository.create({
            battle: { id: battle.id } as Battle,
            turn: turnCount + 1,
            playerAttack: dmgToWild,
            wildAttack: dmgToPlayer,
            playerHpAfter: battle.playerCurrentHp ?? 0,
            wildHpAfter: battle.wildCurrentHp ?? 0,
            usedPotion,
        });
        await this.battleLogRepository.save(log);

        const currentPlayer = await this.playersRepository.findOne({ where: { id: battle.player.id } });
        return {
            playerHp: battle.playerCurrentHp,
            wildHp: battle.wildCurrentHp,
            winner: battle.winner ?? null,
            potions: currentPlayer?.potions ?? 0,
        };
    }

    async captureWild(captureWildDto: CaptureWildDto): Promise<any> {
        const battle = await this.battlesRepository.findOne({ where: { id: captureWildDto.battleId }, relations: ['player', 'wildPokemon'] });
        if (!battle) {
            throw new NotFoundException('Battle not found');
        }

        if (battle.winner !== 'player') {
            throw new BadRequestException('Cannot capture: player did not win the battle');
        }

        // Use PlayerPokemonService to create capture with validations
        const result = await this.playerPokemonService.capturePokemon({
            playerId: battle.player.id,
            wildPokemonId: battle.wildPokemon.id,
            nickname: captureWildDto.nickname,
        });

        return result;
    }

    findOne(id: number): Promise<Battle | null> {
        return this.battlesRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.battlesRepository.delete(id);
    }
}