"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Task, TaskStatus, Priority } from "@/types";
import TaskCard from "./TaskCard";
import { Plus, X } from "lucide-react";

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "Yapılacaklar", color: "border-slate-500/40" },
  { id: "in-progress", title: "Yapılıyor", color: "border-cyan-500/40" },
  { id: "done", title: "Tamamlandı", color: "border-emerald-500/40" },
];

export default function KanbanBoard({ tasks, onTasksChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<Priority>("medium");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const activeTask = tasks.find((t) => t.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) return;

    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn && activeTask.status !== overColumn.id) {
      const updated = tasks.map((t) =>
        t.id === activeTaskId
          ? {
              ...t,
              status: overColumn.id,
              completedAt:
                overColumn.id === "done" ? Date.now() : t.completedAt,
            }
          : t
      );
      onTasksChange(updated);
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      const updated = tasks.map((t) =>
        t.id === activeTaskId
          ? {
              ...t,
              status: overTask.status,
              completedAt:
                overTask.status === "done" ? Date.now() : t.completedAt,
            }
          : t
      );
      onTasksChange(updated);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    if (activeTaskId === overId) return;

    const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const activeTask = tasks[activeIndex];
      const overTask = tasks[overIndex];
      if (activeTask.status === overTask.status) {
        onTasksChange(arrayMove(tasks, activeIndex, overIndex));
      }
    }
  };

  const openAddForm = () => {
    setEditingTask(null);
    setFormTitle("");
    setFormDesc("");
    setFormPriority("medium");
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description || "");
    setFormPriority(task.priority);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      onTasksChange(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formTitle.trim(),
                description: formDesc.trim() || undefined,
                priority: formPriority,
              }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: formTitle.trim(),
        description: formDesc.trim() || undefined,
        priority: formPriority,
        status: "todo",
        createdAt: Date.now(),
      };
      onTasksChange([...tasks, newTask]);
    }
    setShowForm(false);
  };

  const handleToggle = (id: string) => {
    onTasksChange(
      tasks.map((t) => {
        if (t.id !== id) return t;
        if (t.status === "done") {
          return { ...t, status: "todo", completedAt: undefined };
        }
        return { ...t, status: "done", completedAt: Date.now() };
      })
    );
  };

  const handleDelete = (id: string) => {
    onTasksChange(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Görev Paneli</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Görev Ekle
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-2xl glass border ${col.color} min-h-[280px]`}
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200">
                    {col.title}
                  </h3>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={col.id}
                >
                  <div
                    className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar"
                    data-column={col.id}
                  >
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={openEditForm}
                      />
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="h-20 flex items-center justify-center text-xs text-slate-600 border border-dashed border-white/10 rounded-xl">
                        Görev yok
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="glass rounded-xl p-3 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 opacity-90">
              <p className="text-sm font-medium text-white">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/10 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">
                {editingTask ? "Görevi Düzenle" : "Yeni Görev"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Başlık
                </label>
                <input
                  autoFocus
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Görev başlığı..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Açıklama (opsiyonel)
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detaylar..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Öncelik
                </label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPriority(p)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                        formPriority === p
                          ? p === "low"
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            : p === "medium"
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                            : "bg-rose-500/20 border-rose-500/50 text-rose-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      {p === "low" ? "Düşük" : p === "medium" ? "Orta" : "Yüksek"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/25 text-sm"
                >
                  {editingTask ? "Kaydet" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
