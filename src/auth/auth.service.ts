import { Injectable } from '@nestjs/common';
<<<<<<< HEAD
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt';
=======
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
>>>>>>> ebb14c911465b6c37dec5e51fb5ac784a43c7a00
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateAdmin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user || user.role !== UserRole.ADMIN) {
      return null;
    }
    return user;
  }
}
