import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'ReservaPlay API funcionando',
      endpoints: {
        auth: '/auth/login',
        users: '/users/register',
        canchas: '/canchas',
        horarios: '/horarios',
        reservas: '/reservas',
      },
    };
  }
}
