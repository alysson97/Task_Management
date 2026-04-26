'use client';

import { Task, TaskStatus } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<any>;
  onDelete: (taskId: string) => Promise<any>;
  loading?: boolean;
}

export function TaskList({ tasks, onStatusChange, onDelete, loading = false }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
        <p className="text-gray-400 text-sm mt-1">Crie uma nova tarefa para começar</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          loading={loading}
          onStatusChange={(status: TaskStatus) => onStatusChange(task.id, status)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
