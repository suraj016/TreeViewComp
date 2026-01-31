import React, { useState } from 'react';
import TreeView from './components/TreeView';
import { TreeNode } from './types';
import './App.css';

const initialData: TreeNode[] = [
  {
    id: 'root-1',
    name: 'Level A',
    isExpanded: true,
    hasChildren: true,
    children: [
      {
        id: 'root-1-child-1',
        name: 'Level B',
        isExpanded: true,
        hasChildren: true,
        children: [
          {
            id: 'root-1-child-1-child-1',
            name: 'Level C',
            isExpanded: true,
            hasChildren: true,
            children: [
              {
                id: 'root-1-child-1-child-1-child-1',
                name: 'Level D',
                hasChildren: false,
                isExpanded: false,
              },
            ],
          },
          {
            id: 'root-1-child-1-child-2',
            name: 'Level C',
            hasChildren: false,
            isExpanded: false,
          },
          {
            id: 'root-1-child-1-child-3',
            name: 'Level C',
            hasChildren: false,
            isExpanded: false,
          },
        ],
      },
      {
        id: 'root-1-child-2',
        name: 'Level B',
        hasChildren: false,
        isExpanded: false,
      },
    ],
  },
];

function App() {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);

  const handleDataChange = (newData: TreeNode[]) => {
    setTreeData(newData);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tree View Component</h1>
        {/* <p className="subtitle">Drag & Drop • Lazy Loading • Inline Editing</p> */}
      </header>
      <main className="app-main">
        <TreeView data={treeData} onDataChange={handleDataChange} />
      </main>
    </div>
  );
}

export default App;

