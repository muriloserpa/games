import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prismaService: PrismaService) {}
  create(createGameDto: CreateGameDto, userId: number) {
    return this.prismaService.game.create({
      data: { ...createGameDto, user_id: userId },
    });
  }

  findAll() {
    return this.prismaService.game.findMany();
  }

  findOne(id: number) {
    return this.prismaService.game.findUnique({ where: { id: id } });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.prismaService.game.update({
      where: { id: id },
      data: updateGameDto,
    });
  }

  remove(id: number) {
    return this.prismaService.game.delete({ where: { id: id } });
  }
}
