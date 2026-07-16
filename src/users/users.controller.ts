import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Get('me')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  async getAdminUsers() {
    return { message: 'Acceso exclusivo para administradores' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }
}
