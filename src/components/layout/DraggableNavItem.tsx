import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move, Edit3 } from 'lucide-react';
import RenameNavItemDialog from './RenameNavItemDialog';

interface DraggableNavItemProps {
  id: string;
  href: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  label: string;
  customLabel?: string;
  onRename: (newLabel: string) => void;
  onResetLabel: () => void;
}

const DraggableNavItem: React.FC<DraggableNavItemProps> = ({ 
  id, 
  href, 
  icon: Icon, 
  label,
  customLabel,
  onRename,
  onResetLabel
}) => {
  const location = useLocation();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  
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
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const displayLabel = customLabel || label;

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Right click on nav item:', id);
    setIsRenameDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit click on nav item:', id);
    setIsRenameDialogOpen(true);
  };

  const handleRename = async (newLabel: string) => {
    console.log('Handling rename:', id, newLabel);
    setIsRenaming(true);
    try {
      await onRename(newLabel);
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error('Failed to rename navigation item:', error);
      // Keep dialog open on error so user can try again
    } finally {
      setIsRenaming(false);
    }
  };

  const handleResetLabel = async () => {
    console.log('Handling reset label:', id);
    setIsRenaming(true);
    try {
      await onResetLabel();
      setIsRenameDialogOpen(false);
    } catch (error) {
      console.error('Failed to reset navigation item label:', error);
      // Keep dialog open on error so user can try again
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center w-full rounded-lg transition-all ${
          isDragging ? 'opacity-50 z-50' : ''
        }`}
        onContextMenu={handleRightClick}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-6 h-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <Move size={14} />
        </div>
        
        <Link
          to={href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all flex-1 min-w-0 text-left ${
            isActive(href) 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Icon size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{displayLabel}</span>
          {customLabel && (
            <span className="text-xs opacity-50 flex-shrink-0 ml-1">•</span>
          )}
        </Link>

        <button
          onClick={handleEditClick}
          disabled={isRenaming}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-muted flex-shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-50"
          title="Rename navigation item"
        >
          <Edit3 size={12} />
        </button>
      </div>

      <RenameNavItemDialog
        isOpen={isRenameDialogOpen}
        onClose={() => setIsRenameDialogOpen(false)}
        itemLabel={label}
        customLabel={customLabel}
        onRename={handleRename}
        onReset={handleResetLabel}
        isLoading={isRenaming}
      />
    </>
  );
};

export default DraggableNavItem;
