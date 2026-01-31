import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TreeNodeProps } from '../types';
import './TreeNode.css';

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onToggleExpand,
  onAddChild,
  onDelete,
  onEdit,
  onMoveNode,
  onLoadChildren,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [addInputValue, setAddInputValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const hasChildren = node.children && node.children.length > 0;
  const canExpand = node.hasChildren !== false;
  const isExpanded = node.isExpanded || false;
  const isLoading = node.isLoading || false;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (showAddInput && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [showAddInput]);

  const handleToggleExpand = async () => {
    if (!isExpanded && canExpand && !node.children && !isLoading) {
      await onLoadChildren(node.id);
    }
    onToggleExpand(node.id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(node.name);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== node.name) {
      onEdit(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditValue(node.name);
    setIsEditing(false);
  };

  const handleAddSubmit = () => {
    if (addInputValue.trim()) {
      onAddChild(node.id, addInputValue.trim());
      setAddInputValue('');
      setShowAddInput(false);
    }
  };

  const handleAddCancel = () => {
    setAddInputValue('');
    setShowAddInput(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(node.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'TREE_NODE',
    item: { id: node.id, level },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TREE_NODE',
    drop: (item: { id: string; level: number }, monitor) => {
      if (item.id === node.id) return;
      
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const element = document.elementFromPoint(clientOffset.x, clientOffset.y);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const y = clientOffset.y - rect.top;
      const height = rect.height;

      let position: 'before' | 'after' | 'inside';
      if (y < height / 3) {
        position = 'before';
      } else if (y > (height * 2) / 3) {
        position = 'after';
      } else {
        position = 'inside';
      }

      onMoveNode(item.id, node.id, position);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const nodeRef = (instance: HTMLDivElement | null) => {
    drag(drop(instance));
  };

  const getNodeIcon = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return letters[Math.min(level, letters.length - 1)];
  };

  const getNodeColor = () => {
    return level === 0 ? '#4A90E2' : '#7ED321';
  };

  return (
    <div className="tree-node-wrapper">
      <div
        ref={nodeRef}
        className={`tree-node ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'drop-target' : ''}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="tree-node-content" style={{ paddingLeft: `${level * 24}px` }}>
          <div className="tree-node-indent-lines">
            {Array.from({ length: level }).map((_, idx) => (
              <div key={idx} className="indent-line" />
            ))}
          </div>

          <div className="tree-node-main">
            <button
              className="expand-button"
              onClick={handleToggleExpand}
              disabled={!canExpand && !hasChildren}
            >
              {isLoading ? (
                <span className="loading-spinner">⟳</span>
              ) : canExpand || hasChildren ? (
                <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
              ) : (
                <span className="expand-icon-placeholder">•</span>
              )}
            </button>

            <div
              className="node-icon"
              style={{ backgroundColor: getNodeColor() }}
            >
              {getNodeIcon()}
            </div>

            <div className="node-content">
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleEditSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSubmit();
                    } else if (e.key === 'Escape') {
                      handleEditCancel();
                    }
                  }}
                  className="edit-input"
                />
              ) : (
                <div
                  className="node-label"
                  onDoubleClick={handleDoubleClick}
                >
                  {node.name}
                </div>
              )}

              <div className="node-actions">
                <button
                  className="action-button edit-button"
                  onClick={handleDoubleClick}
                  title="Edit node name"
                >
                  ✎
                </button>
                <button
                  className="action-button add-button"
                  onClick={() => setShowAddInput(true)}
                  title="Add child"
                >
                  +
                </button>
                <button
                  className="action-button delete-button"
                  onClick={handleDelete}
                  title="Delete node"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        {showAddInput && (
          <div className="add-input-container" style={{ paddingLeft: `${(level + 1) * 24 + 40}px` }}>
            <input
              ref={addInputRef}
              type="text"
              value={addInputValue}
              onChange={(e) => setAddInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSubmit();
                } else if (e.key === 'Escape') {
                  handleAddCancel();
                }
              }}
              onBlur={handleAddCancel}
              placeholder="Enter node name..."
              className="add-input"
            />
          </div>
        )}

        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-dialog">
              <p>Are you sure you want to delete "{node.name}" and all its children?</p>
              <div className="delete-confirm-buttons">
                <button onClick={confirmDelete} className="confirm-button">
                  Yes, Delete
                </button>
                <button onClick={cancelDelete} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isExpanded && node.children && (
        <div className="tree-node-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onEdit={onEdit}
              onMoveNode={onMoveNode}
              onLoadChildren={onLoadChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;

