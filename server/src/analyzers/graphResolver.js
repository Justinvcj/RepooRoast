import path from 'path';

/**
 * Tries to resolve a relative import to an actual file in the repository.
 * Handles missing extensions (e.g., resolving './utils' to './utils.js' or './utils/index.js').
 */
export const resolveImportPath = (importerPath, rawImport, allFiles) => {
  if (!rawImport.startsWith('.')) {
    // It's an external module like 'express' or 'react'
    return { type: 'external', path: rawImport };
  }

  const dir = path.posix.dirname(importerPath);
  const resolvedBase = path.posix.join(dir, rawImport);
  
  // Possible extensions
  const extensions = ['', '.js', '.ts', '.jsx', '.tsx', '.py', '/index.js', '/index.ts'];
  
  for (const ext of extensions) {
    const attempt = resolvedBase + ext;
    if (allFiles.includes(attempt)) {
      return { type: 'internal', path: attempt };
    }
  }

  // Not found in our downloaded files (could be ignored or un-fetched)
  return { type: 'internal_unresolved', path: resolvedBase };
};

/**
 * Builds the full dependency graph and detects hubs, orphans, and circular dependencies.
 */
export const buildDependencyGraph = (fileAnalyses) => {
  const nodes = [];
  const edges = [];
  const inDegree = {};
  const outDegree = {};
  
  const allFiles = fileAnalyses.map(f => f.path);
  allFiles.forEach(file => {
    nodes.push(file);
    inDegree[file] = 0;
    outDegree[file] = 0;
  });

  // Build edges and degrees
  for (const analysis of fileAnalyses) {
    for (const rawImport of analysis.imports) {
      const resolved = resolveImportPath(analysis.path, rawImport, allFiles);
      if (resolved.type === 'internal') {
        edges.push({ from: analysis.path, to: resolved.path });
        outDegree[analysis.path]++;
        inDegree[resolved.path]++;
      } else if (resolved.type === 'external') {
        edges.push({ from: analysis.path, to: resolved.path, isExternal: true });
      }
    }
  }

  // Detect Hubs (files imported by many others)
  // Define hub as a file imported by >= 3 internal files
  const hubs = Object.keys(inDegree).filter(file => inDegree[file] >= 3);

  // Detect Orphans (files not imported by anything, and not importing much)
  // Exception: Entry points (index.js, App.tsx, main.py) are technically orphans by inDegree
  const entryPoints = ['index.js', 'index.ts', 'main.py', 'main.js', 'app.js', 'App.tsx'];
  const orphans = Object.keys(inDegree).filter(file => {
    const isEntryPoint = entryPoints.some(ep => file.toLowerCase().endsWith(ep.toLowerCase()));
    return inDegree[file] === 0 && !isEntryPoint;
  });

  // Detect Circular Dependencies (simple DFS)
  const circularPaths = [];
  const visited = new Set();
  const recursionStack = new Set();

  const detectCycle = (node, path) => {
    if (recursionStack.has(node)) {
      circularPaths.push([...path, node].join(' -> '));
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    recursionStack.add(node);

    const neighbors = edges.filter(e => e.from === node && !e.isExternal).map(e => e.to);
    for (const neighbor of neighbors) {
      detectCycle(neighbor, [...path, node]);
    }

    recursionStack.delete(node);
    return false;
  };

  allFiles.forEach(file => {
    if (!visited.has(file)) {
      detectCycle(file, []);
    }
  });

  return {
    nodes,
    edges,
    metrics: {
      inDegree,
      outDegree,
      hubs,
      orphans,
      circularPaths: Array.from(new Set(circularPaths)),
    }
  };
};
