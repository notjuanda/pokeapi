import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { BattleLogService } from './battle-log.service';
import { BattleLog } from './battle-log.entity';

@Controller('battle-log')
export class BattleLogController {
    constructor(private readonly battleLogService: BattleLogService) { }

    @Get()
    findAll(): Promise<BattleLog[]> {
        return this.battleLogService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<BattleLog | null> {
        return this.battleLogService.findOne(id);
    }

    @Post()
    create(@Body() battleLog: Partial<BattleLog>): Promise<BattleLog> {
        return this.battleLogService.create(battleLog);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.battleLogService.remove(id);
    }
}