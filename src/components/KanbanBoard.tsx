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
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, X } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task, TaskStatus, Priority } from "@/types";

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "Yapılacaklar", color: "border-slate-500/40" },
  { id: "in-progress", title: "Yapılıyor", color: "border-[#00d2ff]/40" },
  { id: "done", title: "Tamamlandı", color: "border-emerald-500/40" },
];

interface KanbanBoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
  onAddTask: (title: string, priority: Priority) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, status: TaskStatus, order?: number) => void;
  onReorder: (status: TaskStatus, orderedIds: string[]) => void;
}

export function KanbanBoard({
  tasksByStatus,
  onAddTask,
  onDeleteTask,
  onMoveTask,
  onReorder,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id: string): TaskStatus | null => {
    if (COLUMNS.some((c) => c.id === id)) return id as TaskStatus;
    for (const col of COLUMNS) {
      if (tasksByStatus[col.id].some((t) => t.id === id)) return col.id;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    onMoveTask(active.id as string, overContainer);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const items = tasksByStatus[activeContainer];
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const newIndex = items.findIndex((t) => t.id === over.id);
      if (oldIndex !== newIndex && newIndex !== -1) {
        const newOrder = arrayMove(
          items.map((t) => t.id),
          oldIndex,
          newIndex
        );
        onReorder(activeContainer, newOrder);
      }
    } else {
      const items = tasksByStatus[overContainer];
      const overIndex = items.findIndex((t) => t.id === over.id);
      onMoveTask(active.id as string, overContainer, overIndex >= 0 ? overIndex : items.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), newPriority);
    setNewTitle("");
    setNewPriority("medium");
    setShowForm(false);
  };

  const activeTask = activeId
    ? Object.values(tasksByStatus)
        .flat()
        .find((t) => t.id === activeId)
    : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Görevler</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-neon flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "İptal" : "Yeni Görev"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass p-4 mb-4 animate-fade-in space-y-3"
        >
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Görev başlığı..."
            className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#00d2ff]/60"
          />
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400">Öncelik:</label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="bg-slate-900/60 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-[#00d2ff]/60"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
            <button
              type="submit"
              className="ml-auto btn-neon text-sm px-4 py-1.5 rounded-lg font-medium"
            >
              Ekle
            </button>
          </div>
        </form>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className={`glass flex flex-col min-h-[220px] border-t-2 ${col.color}`}
            >
              <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">{col.title}</h3>
                <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                  {tasksByStatus[col.id].length}
                </span>
              </div>
              <div className="p-2 flex-1 overflow-y-auto max-h-[420px]">
                <SortableContext
                  id={col.id}
                  items={tasksByStatus[col.id].map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasksByStatus[col.id].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={onDeleteTask}
                      onToggleDone={(id) =>
                        onMoveTask(
                          id,
                          task.status === "done" ? "todo" : "done"
                        )
                      }
                    />
                  ))}
                </SortableContext>
                {tasksByStatus[col.id].length === 0 && (
                  <p className="text-center text-xs text-slate-600 py-8">
                    Boş
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="glass p-3 opacity-90 shadow-2xl scale-105">
              <p className="text-sm font-medium text-slate-100">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
