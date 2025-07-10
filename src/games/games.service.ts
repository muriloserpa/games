import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class GamesService {
  constructor(
    private prismaService: PrismaService,
    private caslService: CaslAbilityService,
  ) {}
  create(createGameDto: CreateGameDto, userId: number) {
    return this.prismaService.game.create({
      data: { ...createGameDto, user_id: userId },
    });
  }

  findAll() {
    const ability = this.caslService.ability;
    return this.prismaService.game.findMany({
      where: { AND: [accessibleBy(ability, 'read').Game] },
    });
  }

  async findOne(id: number) {
    const ability = this.caslService.ability;
    const game = await this.prismaService.game.findUnique({
      where: { id: id, AND: [accessibleBy(ability, 'read').Game] },
    });

    if (!game) {
      throw new NotFoundException('game not found');
    }
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const ability = this.caslService.ability;
    const game = await this.prismaService.game.findUnique({
      where: { id: id, AND: [accessibleBy(ability, 'update').Game] },
    });

    if (!game) {
      throw new NotFoundException('game not found');
    }

    return this.prismaService.game.update({
      where: { id: id },
      data: updateGameDto,
    });
  }

  async remove(id: number) {
    const ability = this.caslService.ability;
    const game = await this.prismaService.game.findUnique({
      where: { id: id, AND: [accessibleBy(ability, 'delete').Game] },
    });

    if (!game) {
      throw new NotFoundException('game not found');
    }

    return this.prismaService.game.delete({ where: { id: id } });
  }
}
