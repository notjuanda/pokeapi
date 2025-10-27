import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { PlayersService } from './players.service';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { LoginPlayerDto } from './dto/login-player.dto';

@Controller('api/players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) { }

    @Post('register')
    register(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
        return this.playersService.register(createPlayerDto);
    }

    @Post('login')
    login(@Body() loginPlayerDto: LoginPlayerDto): Promise<{ playerId: number; token: string }> {
        return this.playersService.login(loginPlayerDto);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Player | null> {
        return this.playersService.findOne(id);
    }

    @Get(':id/pokemon')
    getPlayerPokemon(@Param('id') id: number): Promise<any[]> {
        return this.playersService.getPlayerPokemon(id);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.playersService.remove(id);
    }
}