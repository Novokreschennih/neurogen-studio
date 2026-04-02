import React from 'react';
import type { SiteFile } from '../types';

interface FileTreeProps {
  files: SiteFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  onDeleteFile,
}) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({ '/': true });

  const tree = React.useMemo(() => {
    const root: any = { name: 'root', path: '/', type: 'folder', children: {} };

    files.forEach(file => {
      const parts = file.path.split('/').filter(Boolean);
      let current = root;
      let currentPath = '';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath += '/' + part;

        if (i === parts.length - 1) {
          if (!current.children) current.children = {};
          current.children[part] = {
            name: part,
            path: currentPath,
            type: 'file',
            file
          };
        } else {
          if (!current.children) current.children = {};
          if (!current.children[part]) {
            current.children[part] = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: {}
            };
          }
          current = current.children[part];
        }
      }
    });

    return root;
  }, [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderNode = (node: any, depth = 0) => {
    if (node.type === 'file' && node.file) {
      return (
        <div
          key={node.path}
          onClick={() => onSelectFile(node.file!.id)}
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
            selectedFileId === node.file!.id
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {node.name.endsWith('.html') ? '📄' : node.name.endsWith('.css') ? '🎨' : node.name.endsWith('.js') ? '⚡' : '📁'}
            </span>
            <span className="text-sm font-medium truncate max-w-[150px]">{node.name}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteFile(node.file!.id); }}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
      );
    }

    if (node.type === 'folder' && node.children) {
      const isExpanded = expandedFolders[node.path] !== false;
      return (
        <div key={node.path}>
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            <span className="text-lg">{isExpanded ? '📂' : '📁'}</span>
            <span>{node.name}</span>
          </div>
          {isExpanded && Object.values(node.children).map(child => renderNode(child, depth + 1))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-1">
      {Object.values(tree.children || {}).map(node => renderNode(node))}
    </div>
  );
};
