import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BattleLog } from './battle-log.entity';

@Injectable()
export class BattleLogService {
    constructor(
        @InjectRepository(BattleLog)
        private readonly battleLogRepository: Repository<BattleLog>,
    ) { }

    findAll(): Promise<BattleLog[]> {
        return this.battleLogRepository.find();
    }

    async findOne(id: number): Promise<BattleLog | null> {
        return this.battleLogRepository.findOneBy({ id });
    }

    create(battleLog: Partial<BattleLog>): Promise<BattleLog> {
        const newBattleLog = this.battleLogRepository.create(battleLog);
        return this.battleLogRepository.save(newBattleLog);
    }

    async remove(id: number): Promise<void> {
        await this.battleLogRepository.delete(id);
    }
}