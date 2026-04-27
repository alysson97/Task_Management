'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { authService } from '@/services/taskService';

export default function Home() {
  const router = useRouter();
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Gerenciador de Tarefas</h1>
            <p className="text-gray-600 mt-2">Organize suas atividades de forma simples e eficiente</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Task Form */}
        <TaskForm onSubmit={createTask} loading={loading} />

        {/* Stats */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              <p className="text-sm ">Total</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter((t) => t.status === 'pending').length}
              </p>
              <p className="text-sm ">Pendentes</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === 'completed').length}
              </p>
              <p className="text-sm ">Concluídas</p>
            </div>
          </div>
        )}

        {/* Task List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Tarefas</h2>
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">Carregando tarefas...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onStatusChange={(taskId, status) => updateTask(taskId, { status })}
              onDelete={deleteTask}
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  );
}
