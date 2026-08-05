(() => {
  'use strict';

  const STORE_KEY = 'pm_store_v1';
  const LEGACY_KEY = 'pm_project_v1';

  const TYPES = [
    { id: 'planting', zh: '种植概念', en: 'Planting concept' },
    { id: 'site', zh: '场地种植分析', en: 'Site planting analysis' },
    { id: 'board', zh: '种植图板', en: 'Planting board' }
  ];

  function uid(prefix = 'p') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function emptyBoard(name = 'Untitled Planting Board') {
    return {
      schema: 'plantmap.project.v1',
      name,
      note: '',
      baseDataUrl: '',
      zones: [],
      updatedAt: new Date().toISOString()
    };
  }

  function readStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.projects)) return data;
      }
    } catch (_) { /* ignore */ }

    // Migrate single legacy project if present.
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const board = JSON.parse(legacy);
        const id = uid();
        const store = {
          activeId: id,
          projects: [{
            id,
            name: board.name || 'Untitled Planting Board',
            type: 'planting',
            createdAt: board.updatedAt || new Date().toISOString(),
            updatedAt: board.updatedAt || new Date().toISOString(),
            board
          }]
        };
        writeStore(store);
        return store;
      }
    } catch (_) { /* ignore */ }

    return { activeId: null, projects: [] };
  }

  function writeStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  function listProjects() {
    const store = readStore();
    return store.projects
      .slice()
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function getProject(id) {
    return readStore().projects.find((p) => p.id === id) || null;
  }

  function getActiveId() {
    return readStore().activeId;
  }

  function setActiveId(id) {
    const store = readStore();
    store.activeId = id;
    writeStore(store);
  }

  function createProject({ name, type = 'planting' } = {}) {
    const store = readStore();
    const now = new Date().toISOString();
    const trimmed = (name || '').trim() || 'Untitled Planting Board';
    const project = {
      id: uid(),
      name: trimmed,
      type: TYPES.some((t) => t.id === type) ? type : 'planting',
      createdAt: now,
      updatedAt: now,
      board: emptyBoard(trimmed)
    };
    store.projects.unshift(project);
    store.activeId = project.id;
    writeStore(store);
    return project;
  }

  function updateProject(id, patch = {}) {
    const store = readStore();
    const idx = store.projects.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const prev = store.projects[idx];
    const next = {
      ...prev,
      ...patch,
      board: patch.board ? { ...prev.board, ...patch.board } : prev.board,
      updatedAt: new Date().toISOString()
    };
    if (patch.board && patch.board.name) next.name = patch.board.name;
    if (patch.name) {
      next.name = patch.name;
      next.board = { ...next.board, name: patch.name };
    }
    store.projects[idx] = next;
    writeStore(store);
    return next;
  }

  function saveBoard(id, board) {
    return updateProject(id, {
      name: board.name,
      board: {
        ...board,
        schema: 'plantmap.project.v1',
        updatedAt: new Date().toISOString()
      }
    });
  }

  function renameProject(id, name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return getProject(id);
    return updateProject(id, { name: trimmed });
  }

  function duplicateProject(id) {
    const src = getProject(id);
    if (!src) return null;
    const store = readStore();
    const now = new Date().toISOString();
    const copy = {
      id: uid(),
      name: `${src.name} copy`,
      type: src.type,
      createdAt: now,
      updatedAt: now,
      board: {
        ...JSON.parse(JSON.stringify(src.board || emptyBoard(src.name))),
        name: `${src.name} copy`,
        updatedAt: now
      }
    };
    store.projects.unshift(copy);
    store.activeId = copy.id;
    writeStore(store);
    return copy;
  }

  function deleteProject(id) {
    const store = readStore();
    store.projects = store.projects.filter((p) => p.id !== id);
    if (store.activeId === id) store.activeId = store.projects[0]?.id || null;
    writeStore(store);
    return store.activeId;
  }

  window.PlantMapStore = {
    TYPES,
    STORE_KEY,
    uid,
    emptyBoard,
    readStore,
    listProjects,
    getProject,
    getActiveId,
    setActiveId,
    createProject,
    updateProject,
    saveBoard,
    renameProject,
    duplicateProject,
    deleteProject
  };
})();
