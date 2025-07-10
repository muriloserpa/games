import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private caslService: CaslAbilityService,
  ) {}
  create(createUserDto: CreateUserDto) {
    const ability = this.caslService.ability;
    if (!ability.can('create', 'User'))
      throw new UnauthorizedException('you dont have permission');

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  findAll() {
    const ability = this.caslService.ability;

    return this.prismaService.user.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').User],
      },
    });
  }

  async findOne(id: number) {
    const ability = this.caslService.ability;
    const user = await this.prismaService.user.findUnique({
      where: { id: id, AND: [accessibleBy(ability, 'read').User] },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const ability = this.caslService.ability;

    const user = await this.prismaService.user.findUnique({
      where: { id: id, AND: [accessibleBy(ability, 'update').User] },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    const ability = this.caslService.ability;
    return this.prismaService.user.delete({ where: { id: id } });
  }
}
