"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, CheckCircle2, Circle } from "lucide-react";
import type { Task, Priority } from "@/types";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const priorityLabel: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

export function TaskCard({ task, onDelete, onToggleDone }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass glass-hover p-3 mb-2 group cursor-default select-none ${
        task.status === "done" ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-slate-500 hover:text-[#00d2ff] cursor-grab active:cursor-grabbing touch-none"
          aria-label="Sürükle"
        >
          <GripVertical size={16} />
        </button>

        <button
          onClick={() => onToggleDone(task.id)}
          className="mt-0.5 shrink-0 text-slate-400 hover:text-[#00d2ff] transition-colors"
          aria-label={task.status === "done" ? "Tamamlanmadı işaretle" : "Tamamlandı işaretle"}
        >
          {task.status === "done" ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : (
            <Circle size={18} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium leading-snug ${
              task.status === "done" ? "line-through text-slate-500" : "text-slate-100"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium priority-${task.priority}`}
            >
              {priorityLabel[task.priority]}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
          aria-label="Sil"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
