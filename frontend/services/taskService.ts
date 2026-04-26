import axios from 'axios';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const response = await api.post<Task>('/tasks', input);
    return response.data;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}`, input);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
