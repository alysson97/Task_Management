'use client';

import { TaskStatus } from '@/types/task';

interface TaskStatusProps {
  status: TaskStatus;
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    className: 'bg-gray-100 text-gray-800',
  },
  in_progress: {
    label: 'Em Progresso',
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800',
  },
};

export function TaskStatusBadge({ status }: TaskStatusProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
