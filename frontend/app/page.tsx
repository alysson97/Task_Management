"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { authService } from "@/services/taskService";

export default function Home() {
  const router = useRouter();
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Gerenciador de Tarefas
            </h1>
            <p className="text-gray-500 mt-1">
              Organize suas atividades de forma simples
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-700 transition"
          >
            Sair
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <TaskForm onSubmit={createTask} loading={loading} />
        </div>

        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-semibold mt-1">{tasks.length}</p>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-2xl font-semibold mt-1">
                {tasks.filter((t) => t.status === "pending").length}
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Concluídas</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4">Tarefas</h2>

          <div className="bg-white border rounded-2xl p-4 shadow-sm">
            {loading ? (
              <p className="text-center text-gray-400 py-8">
                Carregando tarefas...
              </p>
            ) : (
              <TaskList
                tasks={tasks}
                onStatusChange={(taskId, status) =>
                  updateTask(taskId, { status })
                }
                onDelete={deleteTask}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
