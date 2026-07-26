import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ClienteEntity } from '../clientes/entities/cliente.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.dataSource.transaction(async (manager) => {
      const clienteRepository = manager.getRepository(ClienteEntity);

      const existingClienteByCorreo = await clienteRepository.findOne({
        where: { correo: registerDto.email },
      });

      if (existingClienteByCorreo) {
        throw new ConflictException('El correo ya está registrado como cliente');
      }

      const existingClienteByDocumento = await clienteRepository.findOne({
        where: { documento: registerDto.documento },
      });

      if (existingClienteByDocumento) {
        throw new ConflictException('El documento ya está registrado');
      }

      const user = await this.usersService.createClientUserForRegister(
        {
          name: registerDto.name,
          email: registerDto.email,
          password: registerDto.password,
          profile: registerDto.profile,
        },
        manager,
      );

      const cliente = clienteRepository.create({
        nombre: registerDto.nombre,
        apellido: registerDto.apellido,
        documento: registerDto.documento,
        telefono: registerDto.telefono,
        correo: registerDto.email,
        // Campo temporal para compatibilidad durante migracion.
        password: user.password,
        userId: user.id,
      });

      const savedCliente = await clienteRepository.save(cliente);

      const { password: userPassword, ...userWithoutPassword } = user;
      const { password: clientePassword, ...clienteWithoutPassword } = savedCliente;

      return {
        user: userWithoutPassword,
        cliente: clienteWithoutPassword,
      };
    });
  }

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
    if (!user) {
      return null;
    }

    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Este usuario no tiene permisos de administrador');
    }

    return user;
  }
}
