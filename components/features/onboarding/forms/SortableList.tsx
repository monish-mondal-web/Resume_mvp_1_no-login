import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiChevronDown, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';

interface SortableListProps {
  fields: any[];
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  renderItem: (index: number) => React.ReactNode;
  getItemTitle: (field: any, index: number) => string;
  itemTypeLabel: string;
  baseName: string;
}

function SortableItem({ 
  id, index, field, getItemTitle, itemTypeLabel, baseName, renderItem, onRemove, expandedId, setExpandedId 
}: any) {
  const { watch, setValue } = useFormContext();
  const isHidden = watch(`${baseName}.${index}.isHidden`);
  const isExpanded = expandedId === id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-3 rounded-xl border bg-white transition-all duration-300 ${
        isExpanded ? 'border-indigo-300 shadow-sm ring-1 ring-indigo-50' : 'border-slate-200 hover:border-indigo-200'
      } ${isHidden ? 'opacity-60 bg-slate-50 grayscale-[0.2]' : 'opacity-100'} ${isDragging ? 'shadow-xl opacity-90 scale-[1.02]' : ''}`}
    >
      {/* Header */}
      <div 
        onClick={() => setExpandedId(isExpanded ? null : id)}
        className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
          isExpanded ? 'border-b border-slate-100 bg-slate-50/50 rounded-t-xl' : 'rounded-xl hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners} 
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab text-slate-300 transition-colors hover:text-indigo-500 active:cursor-grabbing p-1 -ml-1 rounded"
          >
            <MdDragIndicator className="text-xl" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {itemTypeLabel} {String(index + 1).padStart(2, '0')}
            </span>
            <span className={`text-sm font-semibold transition-all ${isHidden ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {getItemTitle(field, index) || '(Not specified)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Include/Exclude Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setValue(`${baseName}.${index}.isHidden`, !isHidden, { shouldDirty: true });
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isHidden ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {isHidden ? <><FiEyeOff /> <span className="hidden sm:inline">Excluded</span></> : <><FiEye /> <span className="hidden sm:inline">Included</span></>}
          </button>

          {/* Remove Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <FiTrash2 />
          </button>

          {/* Chevron */}
          <div className="rounded-lg p-1 text-slate-400 ml-1">
            <FiChevronDown className={`transition-transform duration-300 text-lg ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`} />
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-5 pt-4 space-y-4">
            {renderItem(index)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SortableList({ fields, onMove, onRemove, renderItem, getItemTitle, itemTypeLabel, baseName }: SortableListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(fields[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onMove(oldIndex, newIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0 relative z-10">
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              index={index}
              field={field}
              getItemTitle={getItemTitle}
              itemTypeLabel={itemTypeLabel}
              baseName={baseName}
              renderItem={renderItem}
              onRemove={onRemove}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
