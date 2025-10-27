import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { Battle } from './battle.entity';
import { StartBattleDto } from './dto/start-battle.dto';
import { BattleTurnDto } from './dto/battle-turn.dto';
import { CaptureWildDto } from './dto/capture-wild.dto';

@Controller('api/battles')
export class BattlesController {
    constructor(private readonly battlesService: BattlesService) { }

    @Post('start')
    startBattle(@Body() startBattleDto: StartBattleDto): Promise<any> {
        return this.battlesService.startBattle(startBattleDto);
    }

    @Post('turn')
    battleTurn(@Body() battleTurnDto: BattleTurnDto): Promise<any> {
        return this.battlesService.executeTurn(battleTurnDto);
    }

    @Post('capture')
    captureWild(@Body() captureWildDto: CaptureWildDto): Promise<any> {
        return this.battlesService.captureWild(captureWildDto);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Battle | null> {
        return this.battlesService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.battlesService.remove(id);
    }
}