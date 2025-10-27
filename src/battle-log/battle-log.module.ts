import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleLog } from './battle-log.entity';
import { BattleLogService } from './battle-log.service';
import { BattleLogController } from './battle-log.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BattleLog])],
    providers: [BattleLogService],
    controllers: [BattleLogController],
})
export class BattleLogModule { }