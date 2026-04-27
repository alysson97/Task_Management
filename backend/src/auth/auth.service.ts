import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      user,
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
      select: {
        id: true,
        password: true,
        name: true,
        username: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
      access_token: token,
    };
  }
}
