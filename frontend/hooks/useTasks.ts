'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { taskService } from '@/services/taskService';

interface UseTasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useTasks() {
  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    loading: true,
    error: null,
  });

  const fetchTasks = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const tasks = await taskService.getTasks();
      setState((prev) => ({ ...prev, tasks, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar tarefas';
      setState((prev) => ({ ...prev, error: message, loading: false }));
    }
  }, []);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        const newTask = await taskService.createTask(input);
        setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
        return newTask;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao criar tarefa';
        setState((prev) => ({ ...prev, error: message }));
        throw error;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput) => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        const updatedTask = await taskService.updateTask(id, input);
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === id ? updatedTask : t)),
        }));
        return updatedTask;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao atualizar tarefa';
        setState((prev) => ({ ...prev, error: message }));
        throw error;
      }
    },
    []
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        await taskService.deleteTask(id);
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((t) => t.id !== id),
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao deletar tarefa';
        setState((prev) => ({ ...prev, error: message }));
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    ...state,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
