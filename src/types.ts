export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
}

export type TreeViewProps = {
  data: TreeNode[];
  onDataChange?: (data: TreeNode[]) => void;
};

export type TreeNodeProps = {
  node: TreeNode;
  level: number;
  onToggleExpand: (nodeId: string) => void;
  onAddChild: (parentId: string, name: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string, newName: string) => void;
  onMoveNode: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onLoadChildren: (nodeId: string) => Promise<void>;
};

