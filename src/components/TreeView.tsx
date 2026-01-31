import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TreeViewProps, TreeNode as TreeNodeType } from '../types';
import TreeNode from './TreeNode';
import {
  findNodeById,
  removeNodeById,
  addChildNode,
  updateNodeName,
  toggleNodeExpanded,
  setNodeLoading,
  setNodeChildren,
  moveNode,
} from '../utils/treeUtils';
import './TreeView.css';

const TreeView: React.FC<TreeViewProps> = ({ data, onDataChange }) => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>(data);

  const updateTree = useCallback(
    (newData: TreeNodeType[]) => {
      setTreeData(newData);
      onDataChange?.(newData);
    },
    [onDataChange]
  );

  const handleToggleExpand = useCallback(
    (nodeId: string) => {
      const newData = toggleNodeExpanded(treeData, nodeId);
      updateTree(newData);
    },
    [treeData, updateTree]
  );

  const handleAddChild = useCallback(
    (parentId: string, name: string) => {
      const newNode: TreeNodeType = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        children: [],
        isExpanded: false,
        hasChildren: false,
      };

      const newData = addChildNode(treeData, parentId, newNode);
      updateTree(newData);
    },
    [treeData, updateTree]
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      const newData = removeNodeById(treeData, nodeId);
      updateTree(newData);
    },
    [treeData, updateTree]
  );

  const handleEdit = useCallback(
    (nodeId: string, newName: string) => {
      const newData = updateNodeName(treeData, nodeId, newName);
      updateTree(newData);
    },
    [treeData, updateTree]
  );

  const handleMoveNode = useCallback(
    (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
      const draggedNode = findNodeById(treeData, draggedId);
      if (draggedNode) {
        // Check if trying to move into own subtree
        const isDescendant = (node: TreeNodeType, ancestorId: string): boolean => {
          if (node.id === ancestorId) return true;
          if (node.children) {
            return node.children.some((child) => isDescendant(child, ancestorId));
          }
          return false;
        };

        if (position === 'inside' && isDescendant(draggedNode, targetId)) {
          return;
        }
      }

      const newData = moveNode(treeData, draggedId, targetId, position);
      updateTree(newData);
    },
    [treeData, updateTree]
  );

  const handleLoadChildren = useCallback(
    async (nodeId: string) => {
      const node = findNodeById(treeData, nodeId);
      if (!node || node.children || node.isLoading) return;

      let newData = setNodeLoading(treeData, nodeId, true);
      updateTree(newData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockChildren = generateMockChildren(nodeId, 2);
      newData = setNodeChildren(treeData, nodeId, mockChildren);
      updateTree(newData);
    },
    [treeData, updateTree]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="tree-view">
        {treeData.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            onToggleExpand={handleToggleExpand}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onMoveNode={handleMoveNode}
            onLoadChildren={handleLoadChildren}
          />
        ))}
      </div>
    </DndProvider>
  );
};

// Generate mock children for lazy loading
function generateMockChildren(parentId: string, count: number): TreeNodeType[] {
  const children: TreeNodeType[] = [];
  const letters = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const level = parentId.split('-').length - 1;
  const letter = letters[Math.min(level, letters.length - 1)] || 'X';

  for (let i = 0; i < count; i++) {
    children.push({
      id: `${parentId}-child-${i}`,
      name: `${letter}${i + 1}`,
      hasChildren: level < 3,
      isExpanded: false,
    });
  }

  return children;
}

export default TreeView;

