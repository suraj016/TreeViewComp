# Tree View Component

A fully functional Tree View component built with React and TypeScript, featuring expand/collapse, add/remove nodes, drag & drop, lazy loading, and inline editing.

## Features

✅ **Expand/Collapse Nodes** - Toggle parent nodes to show/hide children  
✅ **Add New Node** - Add child nodes to any parent with inline input  
✅ **Remove Node** - Delete nodes with confirmation dialog  
✅ **Drag & Drop** - Reorder nodes within the same level or move across parents  
✅ **Lazy Loading** - Load child nodes only when parent is expanded (simulated API)  
✅ **Edit Node Name** - Double-click to edit node names inline  
✅ **Clean Architecture** - Well-structured TypeScript with proper component decomposition  

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

```tsx
import TreeView from './components/TreeView';
import { TreeNode } from './types';

const data: TreeNode[] = [
  {
    id: 'root-1',
    name: 'Root Node',
    isExpanded: true,
    hasChildren: true,
    children: [...]
  }
];

<TreeView data={data} onDataChange={(newData) => console.log(newData)} />
```

## Component Structure

- `TreeView.tsx` - Main component with DnD provider
- `TreeNode.tsx` - Individual node component with all interactions
- `treeUtils.ts` - Utility functions for tree operations
- `types.ts` - TypeScript type definitions

## Technologies

- React 18
- TypeScript
- Vite
- react-dnd (for drag & drop)

## Features in Detail

### Expand/Collapse
Click the expand/collapse button to toggle node visibility. Icons change based on state.

### Add Node
Click the "+" button next to any node to add a child. Enter the name in the inline input field.

### Remove Node
Click the "×" button to delete a node. A confirmation dialog will appear before deletion.

### Drag & Drop
Drag any node to reorder it or move it to a different parent. Drop zones are highlighted during drag.

### Lazy Loading
Child nodes are loaded asynchronously when a parent is first expanded, simulating an API call with an 800ms delay.

### Edit Node
Double-click any node name to edit it inline. Press Enter to save or Escape to cancel.

