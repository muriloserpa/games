import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto, @Req() req: Request) {
    return this.gamesService.create(createGameDto, +req.user!.id);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('gpt')
  gpt(@Query('msg') msg: string, @Req() req: Request) {
    let message = msg || 'retrive all games';

    const user = req.user! as User;

    message += ` with user_id = ${user.id}`;

    return this.gamesService.gpt(message);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
