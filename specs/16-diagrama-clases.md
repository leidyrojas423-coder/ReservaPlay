# Spec 16: Diagrama de Clases

Este documento define las entidades principales del backend (desarrollado en NestJS) y cómo mapean sus clases, relaciones e interacciones de servicios en el código TypeScript.

---

## 1. Estructura de Clases del Dominio (Entidades TypeORM)

```typescript
class User {
  id: string; // UUID
  email: string;
  passwordHash: string;
  role: 'cliente' | 'administrador';
  createdAt: Date;
  
  // Relaciones
  cliente?: Cliente;
  administrador?: Administrador;
}

class Cliente {
  id: string; // Fiel reflejo de User.id (relación 1:1)
  nombre: string;
  telefono: string;
  
  // Relaciones
  reservas: Reserva[];
}

class Administrador {
  id: string; // Fiel reflejo de User.id (relación 1:1)
  nombre: string;
  cargo: string;
}

class Cancha {
  id: string;
  nombre: string;
  tipo: string;
  precioHora: number;
  activa: boolean;
  
  // Relaciones
  horarios: Horario[];
  reservas: Reserva[];
}

class Horario {
  id: string;
  canchaId: string;
  diaSemana: number; // 0-6
  horaInicio: string; // HH:mm:ss
  horaFin: string; // HH:mm:ss
  
  // Relaciones
  cancha: Cancha;
}

class Reserva {
  id: string;
  clienteId: string;
  canchaId: string;
  horarioId: string;
  fechaReserva: Date;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  totalPago: number;
  createdAt: Date;
  
  // Relaciones
  cliente: Cliente;
  cancha: Cancha;
  horario: Horario;
}