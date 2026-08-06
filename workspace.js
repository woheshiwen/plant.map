(() => {
  'use strict';

  const Store = window.PlantMapStore;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const I18N = {
    zh: {
      localPill: '仅本机',
      import: 'IMPORT',
      export: 'EXPORT',
      newProject: '新建项目',
      current: '当前项目',
      recent: '最近项目',
      mine: '我的种植项目',
      sideNote: '项目只保存在本机浏览器，无需账号。',
      eyebrow: 'TRANSFORM · PLANT · PRESENT',
      headline: '你现在要做什么种植图？',
      lead: 'PlantMap 种植概念工作台：先建项目，再选模块。从底图分区到图板导出，AI 能力会按卡片逐步接入。',
      allTools: '全部工具',
      modalTitle: '新建项目',
      nameLabel: '项目名称',
      typeLabel: '项目类型',
      cancel: '取消',
      create: '创建',
      emptyCurrent: '还没有项目。先创建一个种植项目。',
      rename: '重命名',
      copy: '复制',
      del: '删除',
      openStudio: '打开工作室',
      created: '项目已创建',
      needName: '请填写项目名称',
      needProject: '请先创建项目',
      imported: '项目已导入',
      exported: '项目已导出',
      deleted: '项目已删除',
      soon: '即将推出',
      type_planting: '种植概念',
      type_site: '场地种植分析',
      type_board: '种植图板',
      m1t: '场地解读', m1d: '日照、视线、风向与现状植被保留——先读场地再下种植。',
      m2t: '种植概念工作室', m2d: '底图、分区、边界、廊道、箭头、预设、圆角、撤销与 PNG/SVG 导出。',
      m3t: '分层种植', m3d: '按冠层结构叠层推敲：上木、中木、地被与开敞留白。',
      m4t: 'AI 种植建议', m4d: '基于场地条件与图例意图，生成种植策略与分区草案（规划中）。',
      m5t: '概念演变', m5d: '记录从疏到密、从保留到更新的种植推演步骤。',
      m6t: '种植图板', m6d: '统一图例、标题与导出尺寸，整理汇报用种植概念板。',
      t1: '种植概念工作室', t1d: '分区 · 廊道 · 预设',
      t2: '一键圆角', t2d: '柔化分区折角',
      t3: 'PNG / SVG 导出', t3d: '图例 · 比例尺 · 指北针',
      t4: '撤销 / 重做', t4d: '本地编辑历史'
    },
    en: {
      localPill: 'LOCAL ONLY',
      import: 'IMPORT',
      export: 'EXPORT',
      newProject: 'NEW PROJECT',
      current: 'Current project',
      recent: 'Recent projects',
      mine: 'My planting projects',
      sideNote: 'Projects stay in this browser. No account.',
      eyebrow: 'TRANSFORM · PLANT · PRESENT',
      headline: 'What planting board are you making?',
      lead: 'PlantMap planting workspace: create a project first, then pick a module. From base plans to board export — AI tools will land card by card.',
      allTools: 'All tools',
      modalTitle: 'New project',
      nameLabel: 'Project name',
      typeLabel: 'Project type',
      cancel: 'Cancel',
      create: 'Create',
      emptyCurrent: 'No project yet. Create a planting project first.',
      rename: 'Rename',
      copy: 'Copy',
      del: 'Delete',
      openStudio: 'Open studio',
      created: 'Project created',
      needName: 'Enter a project name',
      needProject: 'Create a project first',
      imported: 'Project imported',
      exported: 'Project exported',
      deleted: 'Project deleted',
      soon: 'Coming soon',
      type_planting: 'Planting concept',
      type_site: 'Site planting analysis',
      type_board: 'Planting board',
      m1t: 'Site reading', m1d: 'Sun, views, wind and existing keep — read the site before planting.',
      m2t: 'Planting concept studio', m2d: 'Base plan, zones, edge, corridor, arrows, presets, round corners, undo, PNG/SVG.',
      m3t: 'Layered planting', m3d: 'Compose by canopy structure: overstory, understory, groundcover and open lawn.',
      m4t: 'AI planting suggest', m4d: 'Draft planting strategy and zones from site cues and legend intent (planned).',
      m5t: 'Concept evolution', m5d: 'Record planting moves from sparse to dense, keep to renew.',
      m6t: 'Planting board', m6d: 'Align legend, titles and export sizes for review boards.',
      t1: 'Concept studio', t1d: 'Zones · corridors · presets',
      t2: 'Round corners', t2d: 'Soften zone corners',
      t3: 'PNG / SVG export', t3d: 'Legend · scale · north',
      t4: 'Undo / redo', t4d: 'Local edit history'
    }
  };

  let lang = localStorage.getItem('pm_lang') || 'zh';
  let modalRequired = false;

  const MODULES = [
    { id: 'site', num: '01 ANALYZE', titleKey: 'm1t', descKey: 'm1d', tags: ['SITE', 'KEEP', 'FORCE'], ready: false },
    { id: 'studio', num: '02 CONCEPT', titleKey: 'm2t', descKey: 'm2d', tags: ['ZONES', 'SPINE', 'PRESET', 'SVG'], ready: true },
    { id: 'layers', num: '03 LAYERS', titleKey: 'm3t', descKey: 'm3d', tags: ['CANOPY', 'SHRUB', 'LAWN'], ready: false },
    { id: 'ai', num: '04 AI', titleKey: 'm4t', descKey: 'm4d', tags: ['SUGGEST', 'STRATEGY'], ready: false },
    { id: 'evolve', num: '05 EVOLVE', titleKey: 'm5t', descKey: 'm5d', tags: ['SEQUENCE', 'PARTI'], ready: false },
    { id: 'board', num: '06 PRESENT', titleKey: 'm6t', descKey: 'm6d', tags: ['A3', 'EXPORT'], ready: false }
  ];

  function t(key) {
    return (I18N[lang] || I18N.zh)[key] || key;
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove('on'), 1800);
  }

  function applyLang() {
    $$('[data-i]').forEach((node) => {
      const key = node.getAttribute('data-i');
      if (I18N[lang][key] != null) node.textContent = I18N[lang][key];
    });
    $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('pm_lang', lang);

    const select = $('#projectTypeSelect');
    select.innerHTML = Store.TYPES.map((type) => (
      `<option value="${type.id}">${t(`type_${type.id}`)}</option>`
    )).join('');
    renderModules();
    renderProjects();
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        month: 'short', day: 'numeric'
      });
    } catch (_) {
      return '';
    }
  }

  function openStudio(id) {
    if (!id) {
      toast(t('needProject'));
      openModal(true);
      return;
    }
    Store.setActiveId(id);
    window.location.href = `studio.html?id=${encodeURIComponent(id)}`;
  }

  function requireProjectThen(fn) {
    const id = Store.getActiveId() || Store.listProjects()[0]?.id;
    if (!id) {
      openModal(true);
      toast(t('needProject'));
      return;
    }
    fn(id);
  }

  function renderModules() {
    $('#moduleGrid').innerHTML = MODULES.map((mod) => `
      <button type="button" class="module-card ${mod.ready ? '' : 'soon'}" data-module="${mod.id}">
        <div class="num">${mod.num}</div>
        <h2>${t(mod.titleKey)}</h2>
        <p>${t(mod.descKey)}</p>
        <div class="tags">${mod.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
        <span class="go">${mod.ready ? '→' : '·'}</span>
      </button>
    `).join('');

    $$('#moduleGrid [data-module]').forEach((btn) => {
      btn.onclick = () => {
        const mod = MODULES.find((m) => m.id === btn.dataset.module);
        if (!mod?.ready) {
          toast(t('soon'));
          return;
        }
        requireProjectThen((id) => openStudio(id));
      };
    });

    $('#toolGrid').innerHTML = [
      { title: t('t1'), desc: t('t1d'), ready: true, action: 'studio' },
      { title: t('t2'), desc: t('t2d'), ready: true, action: 'studio' },
      { title: t('t3'), desc: t('t3d'), ready: true, action: 'studio' },
      { title: t('t4'), desc: t('t4d'), ready: true, action: 'studio' }
    ].map((item) => `
      <button type="button" class="tool-card ${item.ready ? '' : 'soon'}" data-action="${item.action}">
        <b>${item.title}</b>
        <span>${item.desc}</span>
      </button>
    `).join('');

    $$('#toolGrid [data-action]').forEach((btn) => {
      btn.onclick = () => {
        if (btn.dataset.action === 'export') {
          requireProjectThen((id) => exportProject(id));
          return;
        }
        requireProjectThen((id) => openStudio(id));
      };
    });
  }

  function projectMeta(project) {
    return `${t(`type_${project.type}`) || project.type} · ${formatDate(project.updatedAt)}`;
  }

  function renderProjects() {
    const projects = Store.listProjects();
    const activeId = Store.getActiveId();
    const current = projects.find((p) => p.id === activeId) || projects[0] || null;

    const currentCard = $('#currentCard');
    if (!current) {
      currentCard.className = 'project-card empty';
      currentCard.innerHTML = t('emptyCurrent');
    } else {
      if (!activeId) Store.setActiveId(current.id);
      currentCard.className = 'project-card';
      currentCard.innerHTML = `
        <strong>${escapeHtml(current.name)}</strong>
        <small>${escapeHtml(projectMeta(current))}</small>
        <div class="project-actions">
          <button type="button" class="mini" data-act="open">${t('openStudio')}</button>
          <button type="button" class="mini" data-act="rename">${t('rename')}</button>
          <button type="button" class="mini" data-act="copy">${t('copy')}</button>
          <button type="button" class="mini danger" data-act="delete">${t('del')}</button>
        </div>
      `;
      currentCard.querySelector('[data-act="open"]').onclick = () => openStudio(current.id);
      currentCard.querySelector('[data-act="rename"]').onclick = () => {
        const name = window.prompt(t('nameLabel'), current.name);
        if (name == null) return;
        Store.renameProject(current.id, name);
        renderProjects();
      };
      currentCard.querySelector('[data-act="copy"]').onclick = () => {
        Store.duplicateProject(current.id);
        renderProjects();
      };
      currentCard.querySelector('[data-act="delete"]').onclick = () => {
        Store.deleteProject(current.id);
        renderProjects();
        if (!Store.listProjects().length) openModal(true);
      };
    }

    const recent = projects.slice(0, 4);
    $('#recentList').innerHTML = recent.length
      ? recent.map((p) => rowHtml(p, p.id === (Store.getActiveId()))).join('')
      : `<div class="project-card empty">${t('emptyCurrent')}</div>`;

    $('#allList').innerHTML = projects.length
      ? projects.map((p) => rowHtml(p, p.id === (Store.getActiveId()))).join('')
      : `<div class="project-card empty">${t('emptyCurrent')}</div>`;

    $$('#recentList .project-row, #allList .project-row').forEach((row) => {
      row.onclick = () => {
        Store.setActiveId(row.dataset.id);
        renderProjects();
      };
      row.ondblclick = () => openStudio(row.dataset.id);
    });
  }

  function rowHtml(project, on) {
    return `
      <div class="project-row ${on ? 'on' : ''}" data-id="${project.id}">
        <strong>${escapeHtml(project.name)}</strong>
        <small>${escapeHtml(projectMeta(project))}</small>
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function openModal(required = false) {
    modalRequired = required;
    $('#modalRoot').classList.add('on');
    $('#modalRoot').setAttribute('aria-hidden', 'false');
    $('#cancelModalBtn').style.visibility = required && !Store.listProjects().length ? 'hidden' : 'visible';
    const input = $('#projectNameInput');
    input.value = lang === 'zh' ? '未命名种植项目' : 'Untitled Project';
    setTimeout(() => {
      input.focus();
      input.select();
    }, 30);
  }

  function closeModal() {
    if (modalRequired && !Store.listProjects().length) return;
    $('#modalRoot').classList.remove('on');
    $('#modalRoot').setAttribute('aria-hidden', 'true');
    modalRequired = false;
  }

  function createFromModal() {
    const name = $('#projectNameInput').value.trim();
    if (!name) {
      toast(t('needName'));
      return;
    }
    const type = $('#projectTypeSelect').value;
    const project = Store.createProject({ name, type });
    modalRequired = false;
    closeModal();
    renderProjects();
    toast(t('created'));
    openStudio(project.id);
  }

  function exportProject(id) {
    const project = Store.getProject(id);
    if (!project) return;
    const payload = {
      schema: 'plantmap.bundle.v1',
      exportedAt: new Date().toISOString(),
      project
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${project.name.replace(/[^\w\-]+/g, '_') || 'plantmap'}.json`;
    a.click();
    toast(t('exported'));
  }

  $('#langBtn').onclick = () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    applyLang();
  };
  $('#newProjectBtn').onclick = () => openModal(false);
  $('#cancelModalBtn').onclick = () => closeModal();
  $('#createModalBtn').onclick = createFromModal;
  $('#modalBackdrop').onclick = () => closeModal();
  $('#projectNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') createFromModal();
  });

  $('#exportBtn').onclick = () => {
    requireProjectThen((id) => exportProject(id));
  };

  $('#importBtn').onclick = () => $('#importFile').click();
  $('#importFile').onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const bundle = data.project || data;
      const board = bundle.board || bundle;
      const project = Store.createProject({
        name: bundle.name || board.name || file.name.replace(/\.json$/i, ''),
        type: bundle.type || 'planting'
      });
      Store.saveBoard(project.id, {
        ...Store.emptyBoard(project.name),
        ...board,
        name: project.name
      });
      renderProjects();
      toast(t('imported'));
    } catch (_) {
      toast(lang === 'zh' ? '文件无效' : 'Invalid file');
    }
    e.target.value = '';
  };

  applyLang();

  // Require a project when none exist.
  if (!Store.listProjects().length) openModal(true);
  else closeModal();
})();
