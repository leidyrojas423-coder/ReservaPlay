import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { Roles } from './decorators/roles.decorator';

import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';



@Controller('auth')
export class AuthController {


  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}



  // ==========================
  // REGISTRO DE CLIENTES
  // ==========================

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ) {

    return this.usersService.create(registerDto);

  }



  // ==========================
  // LOGIN GENERAL
  // CLIENTE / ADMIN
  // ==========================

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ) {

    const email = loginDto.email ?? loginDto.correo;

    if (!email) {
      throw new BadRequestException(
        'Debe enviar email o correo',
      );
    }


    const user =
      await this.authService.validateUser(
        email,
        loginDto.password,
      );



    if (!user) {

      throw new UnauthorizedException(
        'Credenciales inválidas',
      );

    }



    return this.authService.login(user);

  }





  // ==========================
  // LOGIN ADMINISTRADOR
  // ==========================

  @Post('admin/login')
  async adminLogin(
    @Body() loginDto: LoginDto,
  ) {

    const email = loginDto.email ?? loginDto.correo;

    if (!email) {
      throw new BadRequestException(
        'Debe enviar email o correo',
      );
    }


    const admin =
      await this.authService.validateAdmin(
        email,
        loginDto.password,
      );



    if (!admin) {

      throw new UnauthorizedException(
        'Credenciales de administrador inválidas',
      );

    }



    return this.authService.login(admin);

  }





  // ==========================
  // PERFIL USUARIO LOGUEADO
  // CLIENTE O ADMIN
  // ==========================

  @UseGuards(JwtAuthGuard)
  @Roles(
    UserRole.CLIENT,
    UserRole.ADMIN,
  )
  @Get('me')
  getProfile(
    @Request() req: any,
  ) {

    return {

      message:
        'Perfil accesible para usuarios autenticados',

      user:
        req.user,

    };

  }





  // ==========================
  // PANEL ADMINISTRADOR
  // SOLO ADMIN
  // ==========================

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/dashboard')
  getAdminDashboard() {


    return {

      message:
        'Panel administrativo accesible',

    };


  }


}