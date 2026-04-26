// Task Entity - Definido no Prisma Schema
// Usar o tipo gerado do Prisma: import { Task } from '@prisma/client';

export class Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

