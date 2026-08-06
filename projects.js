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

  function emptySheet(name = 'Sheet 1') {
    return {
      id: uid('s'),
      name,
      schema: 'plantmap.sheet.v1',
      note: '',
      baseDataUrl: '',
      zones: [],
      paths: [],
      boundary: null,
      theme: 'forest',
      boardChrome: { legend: true, scale: true, north: true },
      updatedAt: new Date().toISOString()
    };
  }

  function sheetToBoard(sheet, projectName) {
    const s = sheet || emptySheet(projectName || 'Sheet 1');
    return {
      schema: 'plantmap.project.v1',
      name: projectName || s.name,
      note: s.note || '',
      baseDataUrl: s.baseDataUrl || '',
      zones: Array.isArray(s.zones) ? s.zones : [],
      paths: Array.isArray(s.paths) ? s.paths : [],
      boundary: s.boundary || null,
      theme: s.theme || 'forest',
      boardChrome: s.boardChrome || { legend: true, scale: true, north: true },
      updatedAt: s.updatedAt || new Date().toISOString(),
      sheetId: s.id,
      sheetName: s.name
    };
  }

  function boardToSheet(board, fallbackName = 'Sheet 1') {
    const base = emptySheet(board?.sheetName || board?.name || fallbackName);
    return {
      ...base,
      id: board?.sheetId || base.id,
      name: board?.sheetName || board?.name || fallbackName,
      note: board?.note || '',
      baseDataUrl: board?.baseDataUrl || '',
      zones: Array.isArray(board?.zones) ? board.zones : [],
      paths: Array.isArray(board?.paths) ? board.paths : [],
      boundary: board?.boundary || null,
      theme: board?.theme || 'forest',
      boardChrome: board?.boardChrome || { legend: true, scale: true, north: true },
      updatedAt: board?.updatedAt || new Date().toISOString()
    };
  }

  function emptyBoard(name = 'Untitled Planting Board') {
    const sheet = emptySheet(name === 'Untitled Planting Board' ? 'Sheet 1' : name);
    return sheetToBoard(sheet, name);
  }

  function normalizeProject(project) {
    if (!project) return null;
    let sheets = Array.isArray(project.sheets)
      ? project.sheets.map((s, i) => {
          const fallback = emptySheet(`Sheet ${i + 1}`);
          return {
            ...fallback,
            ...s,
            id: s.id || fallback.id,
            name: (s.name || fallback.name).trim() || fallback.name,
            schema: 'plantmap.sheet.v1',
            zones: Array.isArray(s.zones) ? s.zones : [],
            paths: Array.isArray(s.paths) ? s.paths : [],
            boundary: s.boundary || null,
            theme: s.theme || 'forest',
            boardChrome: s.boardChrome || { legend: true, scale: true, north: true }
          };
        })
      : [];

    if (!sheets.length && project.board) {
      sheets = [boardToSheet(project.board, project.name || 'Sheet 1')];
    }
    if (!sheets.length) sheets = [emptySheet('Sheet 1')];

    let activeSheetId = project.activeSheetId;
    if (!sheets.some((s) => s.id === activeSheetId)) activeSheetId = sheets[0].id;
    const active = sheets.find((s) => s.id === activeSheetId) || sheets[0];

    return {
      ...project,
      sheets,
      activeSheetId,
      board: sheetToBoard(active, project.name)
    };
  }

  function readStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.projects)) {
          return {
            activeId: data.activeId || null,
            projects: data.projects.map((p) => normalizeProject(p)).filter(Boolean)
          };
        }
      }
    } catch (_) { /* ignore */ }

    // Migrate single legacy project if present.
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const board = JSON.parse(legacy);
        const id = uid();
        const sheet = boardToSheet(board, board.name || 'Untitled Planting Board');
        const store = {
          activeId: id,
          projects: [normalizeProject({
            id,
            name: board.name || 'Untitled Planting Board',
            type: 'planting',
            createdAt: board.updatedAt || new Date().toISOString(),
            updatedAt: board.updatedAt || new Date().toISOString(),
            activeSheetId: sheet.id,
            sheets: [sheet],
            board
          })]
        };
        writeStore(store);
        return store;
      }
    } catch (_) { /* ignore */ }

    return { activeId: null, projects: [] };
  }

  function writeStore(store) {
    const payload = {
      activeId: store.activeId || null,
      projects: (store.projects || []).map((p) => {
        const n = normalizeProject(p);
        return {
          id: n.id,
          name: n.name,
          type: n.type,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          activeSheetId: n.activeSheetId,
          sheets: n.sheets,
          board: n.board
        };
      })
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(payload));
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
    const sheet = emptySheet('Sheet 1');
    const project = normalizeProject({
      id: uid(),
      name: trimmed,
      type: TYPES.some((t) => t.id === type) ? type : 'planting',
      createdAt: now,
      updatedAt: now,
      activeSheetId: sheet.id,
      sheets: [sheet]
    });
    store.projects.unshift(project);
    store.activeId = project.id;
    writeStore(store);
    return project;
  }

  function updateProject(id, patch = {}) {
    const store = readStore();
    const idx = store.projects.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const prev = normalizeProject(store.projects[idx]);
    let next = { ...prev, ...patch, updatedAt: new Date().toISOString() };

    if (patch.sheets) next.sheets = patch.sheets;
    if (patch.activeSheetId) next.activeSheetId = patch.activeSheetId;

    if (patch.board) {
      const sheetId = patch.board.sheetId || next.activeSheetId;
      next.sheets = next.sheets.map((s) => {
        if (s.id !== sheetId) return s;
        return boardToSheet({ ...sheetToBoard(s, next.name), ...patch.board, sheetId: s.id, sheetName: patch.board.sheetName || s.name }, s.name);
      });
      next.activeSheetId = sheetId;
    }

    if (patch.name) {
      next.name = patch.name;
    }

    next = normalizeProject(next);
    store.projects[idx] = next;
    writeStore(store);
    return next;
  }

  function saveBoard(id, board) {
    const project = getProject(id);
    if (!project) return null;
    const sheetId = board.sheetId || project.activeSheetId;
    const sheetName = board.sheetName || getSheet(id, sheetId)?.name || 'Sheet 1';
    return updateProject(id, {
      name: board.name || project.name,
      activeSheetId: sheetId,
      board: {
        ...board,
        sheetId,
        sheetName,
        schema: 'plantmap.project.v1',
        updatedAt: new Date().toISOString()
      }
    });
  }

  function getSheet(projectId, sheetId) {
    const project = getProject(projectId);
    if (!project) return null;
    return project.sheets.find((s) => s.id === sheetId) || null;
  }

  function getActiveSheet(projectId) {
    const project = getProject(projectId);
    if (!project) return null;
    return project.sheets.find((s) => s.id === project.activeSheetId) || project.sheets[0] || null;
  }

  function setActiveSheet(projectId, sheetId) {
    const project = getProject(projectId);
    if (!project || !project.sheets.some((s) => s.id === sheetId)) return null;
    return updateProject(projectId, { activeSheetId: sheetId });
  }

  function addSheet(projectId, name) {
    const project = getProject(projectId);
    if (!project) return null;
    const sheet = emptySheet(name || `Sheet ${project.sheets.length + 1}`);
    const sheets = project.sheets.concat(sheet);
    return updateProject(projectId, { sheets, activeSheetId: sheet.id });
  }

  function renameSheet(projectId, sheetId, name) {
    const project = getProject(projectId);
    if (!project) return null;
    const trimmed = (name || '').trim();
    if (!trimmed) return project;
    const sheets = project.sheets.map((s) => (s.id === sheetId ? { ...s, name: trimmed } : s));
    return updateProject(projectId, { sheets });
  }

  function duplicateSheet(projectId, sheetId) {
    const project = getProject(projectId);
    if (!project) return null;
    const src = project.sheets.find((s) => s.id === sheetId);
    if (!src) return null;
    const copy = {
      ...JSON.parse(JSON.stringify(src)),
      id: uid('s'),
      name: `${src.name} copy`,
      updatedAt: new Date().toISOString()
    };
    const sheets = [];
    project.sheets.forEach((s) => {
      sheets.push(s);
      if (s.id === sheetId) sheets.push(copy);
    });
    return updateProject(projectId, { sheets, activeSheetId: copy.id });
  }

  function deleteSheet(projectId, sheetId) {
    const project = getProject(projectId);
    if (!project || project.sheets.length <= 1) return project;
    const sheets = project.sheets.filter((s) => s.id !== sheetId);
    const activeSheetId = project.activeSheetId === sheetId ? sheets[0].id : project.activeSheetId;
    return updateProject(projectId, { sheets, activeSheetId });
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
    const sheets = JSON.parse(JSON.stringify(src.sheets || [])).map((s) => ({
      ...s,
      id: uid('s'),
      updatedAt: now
    }));
    const copy = normalizeProject({
      id: uid(),
      name: `${src.name} copy`,
      type: src.type,
      createdAt: now,
      updatedAt: now,
      activeSheetId: sheets[0]?.id,
      sheets: sheets.length ? sheets : [emptySheet('Sheet 1')]
    });
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

  function sheetCount(project) {
    const p = normalizeProject(project);
    return p?.sheets?.length || 0;
  }

  window.PlantMapStore = {
    TYPES,
    STORE_KEY,
    uid,
    emptyBoard,
    emptySheet,
    sheetToBoard,
    boardToSheet,
    normalizeProject,
    readStore,
    listProjects,
    getProject,
    getActiveId,
    setActiveId,
    createProject,
    updateProject,
    saveBoard,
    getSheet,
    getActiveSheet,
    setActiveSheet,
    addSheet,
    renameSheet,
    duplicateSheet,
    deleteSheet,
    renameProject,
    duplicateProject,
    deleteProject,
    sheetCount
  };
})();
