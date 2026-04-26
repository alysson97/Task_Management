'use client';

import { Task, TaskStatus } from '@/types/task';
import { TaskStatusBadge } from './TaskStatus';

interface TaskItemProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  loading?: boolean;
}

const statusOptions: TaskStatus[] = ['pending', 'in_progress', 'completed'];

export function TaskItem({ task, onStatusChange, onDelete, loading = false }: TaskItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <span>
          Criada: {new Date(task.createdAt).toLocaleDateString('pt-BR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          disabled={loading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === 'pending'
                ? 'Pendente'
                : status === 'in_progress'
                  ? 'Em Progresso'
                  : 'Concluída'}
            </option>
          ))}
        </select>

        <button
          onClick={onDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
