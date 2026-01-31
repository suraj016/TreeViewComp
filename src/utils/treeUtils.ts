import { TreeNode } from '../types';

export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findNodeParent(nodes: TreeNode[], id: string, parent: TreeNode | null = null): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return parent;
    }
    if (node.children) {
      const found = findNodeParent(node.children, id, node);
      if (found !== null) return found;
    }
  }
  return null;
}

export function removeNodeById(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children ? removeNodeById(node.children, id) : undefined,
    }));
}

export function addChildNode(nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addChildNode(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

export function updateNodeName(nodes: TreeNode[], nodeId: string, newName: string): TreeNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, name: newName };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeName(node.children, nodeId, newName),
      };
    }
    return node;
  });
}

export function toggleNodeExpanded(nodes: TreeNode[], nodeId: string): TreeNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return {
        ...node,
        children: toggleNodeExpanded(node.children, nodeId),
      };
    }
    return node;
  });
}

export function setNodeLoading(nodes: TreeNode[], nodeId: string, isLoading: boolean): TreeNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return { ...node, isLoading };
    }
    if (node.children) {
      return {
        ...node,
        children: setNodeLoading(node.children, nodeId, isLoading),
      };
    }
    return node;
  });
}

export function setNodeChildren(nodes: TreeNode[], nodeId: string, children: TreeNode[]): TreeNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        children,
        hasChildren: children.length > 0,
        isLoading: false,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: setNodeChildren(node.children, nodeId, children),
      };
    }
    return node;
  });
}

export function moveNode(
  nodes: TreeNode[],
  draggedId: string,
  targetId: string,
  position: 'before' | 'after' | 'inside'
): TreeNode[] {
  let draggedNode: TreeNode | null = null;
  
  function extractNode(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    for (const node of nodes) {
      if (node.id === draggedId) {
        draggedNode = { ...node };
        continue;
      }
      if (node.children) {
        result.push({
          ...node,
          children: extractNode(node.children),
        });
      } else {
        result.push(node);
      }
    }
    return result;
  }

  const nodesWithoutDragged = extractNode(nodes);
  if (!draggedNode) return nodes;

  function insertNode(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      if (node.id === targetId) {
        if (position === 'before') {
          result.push(draggedNode!);
          result.push(node);
        } else if (position === 'after') {
          result.push(node);
          result.push(draggedNode!);
        } else if (position === 'inside') {
          result.push({
            ...node,
            children: [...(node.children || []), draggedNode!],
          });
        }
      } else {
        if (node.children) {
          result.push({
            ...node,
            children: insertNode(node.children),
          });
        } else {
          result.push(node);
        }
      }
    }
    
    return result;
  }

  return insertNode(nodesWithoutDragged);
}

