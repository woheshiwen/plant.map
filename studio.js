(() => {
  'use strict';

  const THEMES = {
    forest: {
      zh: '森林', en: 'Forest',
      types: [
        { id: 'canopy', color: '#2F6B45', fill: 'rgba(47,107,69,.45)', zh: '乔木冠层', en: 'Canopy', zhHint: '遮阴 / 主景树群', enHint: 'Shade / feature mass' },
        { id: 'shrub', color: '#5B8F5A', fill: 'rgba(91,143,90,.45)', zh: '灌木下层', en: 'Shrub', zhHint: '屏障 / 围合', enHint: 'Buffer / enclosure' },
        { id: 'ground', color: '#8FBF7A', fill: 'rgba(143,191,122,.42)', zh: '地被', en: 'Groundcover', zhHint: '林下覆盖', enHint: 'Understory cover' },
        { id: 'lawn', color: '#C5D96A', fill: 'rgba(197,217,106,.42)', zh: '草坪开敞', en: 'Lawn / open', zhHint: '活动与留白', enHint: 'Program / void' },
        { id: 'edge', color: '#3D8B8B', fill: 'rgba(61,139,139,.42)', zh: '水边湿地', en: 'Edge / wetland', zhHint: '驳岸 / 雨水', enHint: 'Water / ecology' },
        { id: 'keep', color: '#8A7A4B', fill: 'rgba(138,122,75,.18)', zh: '保留现状', en: 'Existing keep', zhHint: '现有植被保留', enHint: 'Retain on site', dashed: true }
      ]
    },
    soft: {
      zh: '柔和', en: 'Soft',
      types: [
        { id: 'canopy', color: '#4F7F62', fill: 'rgba(79,127,98,.38)', zh: '乔木冠层', en: 'Canopy', zhHint: '遮阴 / 主景树群', enHint: 'Shade / feature mass' },
        { id: 'shrub', color: '#7FA87A', fill: 'rgba(127,168,122,.38)', zh: '灌木下层', en: 'Shrub', zhHint: '屏障 / 围合', enHint: 'Buffer / enclosure' },
        { id: 'ground', color: '#B5D39A', fill: 'rgba(181,211,154,.36)', zh: '地被', en: 'Groundcover', zhHint: '林下覆盖', enHint: 'Understory cover' },
        { id: 'lawn', color: '#D9E6A8', fill: 'rgba(217,230,168,.36)', zh: '草坪开敞', en: 'Lawn / open', zhHint: '活动与留白', enHint: 'Program / void' },
        { id: 'edge', color: '#6AA3A8', fill: 'rgba(106,163,168,.36)', zh: '水边湿地', en: 'Edge / wetland', zhHint: '驳岸 / 雨水', enHint: 'Water / ecology' },
        { id: 'keep', color: '#A89A78', fill: 'rgba(168,154,120,.16)', zh: '保留现状', en: 'Existing keep', zhHint: '现有植被保留', enHint: 'Retain on site', dashed: true }
      ]
    },
    contrast: {
      zh: '对比', en: 'Contrast',
      types: [
        { id: 'canopy', color: '#1F5A38', fill: 'rgba(31,90,56,.5)', zh: '乔木冠层', en: 'Canopy', zhHint: '遮阴 / 主景树群', enHint: 'Shade / feature mass' },
        { id: 'shrub', color: '#3D7A3A', fill: 'rgba(61,122,58,.48)', zh: '灌木下层', en: 'Shrub', zhHint: '屏障 / 围合', enHint: 'Buffer / enclosure' },
        { id: 'ground', color: '#7AB85A', fill: 'rgba(122,184,90,.45)', zh: '地被', en: 'Groundcover', zhHint: '林下覆盖', enHint: 'Understory cover' },
        { id: 'lawn', color: '#D4E04A', fill: 'rgba(212,224,74,.42)', zh: '草坪开敞', en: 'Lawn / open', zhHint: '活动与留白', enHint: 'Program / void' },
        { id: 'edge', color: '#1F7A8A', fill: 'rgba(31,122,138,.45)', zh: '水边湿地', en: 'Edge / wetland', zhHint: '驳岸 / 雨水', enHint: 'Water / ecology' },
        { id: 'keep', color: '#7A5A2A', fill: 'rgba(122,90,42,.2)', zh: '保留现状', en: 'Existing keep', zhHint: '现有植被保留', enHint: 'Retain on site', dashed: true }
      ]
    }
  };

  const PRESETS = [
    {
      id: 'sparse',
      zh: '疏林草坪', en: 'Sparse lawn',
      zhHint: '中部开敞，边缘乔灌', enHint: 'Open lawn with edge canopy',
      build(b) {
        const { x0, y0, w, h } = b;
        return {
          zones: [
            { type: 'lawn', pts: rect(x0 + w * .22, y0 + h * .24, w * .56, h * .52) },
            { type: 'canopy', pts: [[x0 + w * .08, y0 + h * .12], [x0 + w * .42, y0 + h * .08], [x0 + w * .38, y0 + h * .28], [x0 + w * .1, y0 + h * .34]] },
            { type: 'shrub', pts: [[x0 + w * .62, y0 + h * .58], [x0 + w * .9, y0 + h * .55], [x0 + w * .88, y0 + h * .82], [x0 + w * .58, y0 + h * .84]] },
            { type: 'keep', pts: rect(x0 + w * .72, y0 + h * .14, w * .16, h * .16) }
          ],
          paths: [
            { kind: 'spine', pts: [[x0 + w * .18, y0 + h * .78], [x0 + w * .5, y0 + h * .5], [x0 + w * .82, y0 + h * .22]] },
            { kind: 'arrow', pts: [[x0 + w * .12, y0 + h * .5], [x0 + w * .02, y0 + h * .48]] }
          ],
          boundary: rect(x0 + w * .05, y0 + h * .05, w * .9, h * .9)
        };
      }
    },
    {
      id: 'layered',
      zh: '复层密林', en: 'Layered grove',
      zhHint: '乔灌地被叠层', enHint: 'Stacked canopy layers',
      build(b) {
        const { x0, y0, w, h } = b;
        return {
          zones: [
            { type: 'canopy', pts: rect(x0 + w * .12, y0 + h * .14, w * .5, h * .46) },
            { type: 'shrub', pts: rect(x0 + w * .18, y0 + h * .28, w * .42, h * .42) },
            { type: 'ground', pts: rect(x0 + w * .22, y0 + h * .4, w * .38, h * .36) },
            { type: 'lawn', pts: rect(x0 + w * .58, y0 + h * .55, w * .28, h * .28) },
            { type: 'edge', pts: [[x0 + w * .08, y0 + h * .72], [x0 + w * .48, y0 + h * .7], [x0 + w * .45, y0 + h * .9], [x0 + w * .1, y0 + h * .88]] }
          ],
          paths: [
            { kind: 'spine', pts: [[x0 + w * .7, y0 + h * .18], [x0 + w * .68, y0 + h * .5], [x0 + w * .72, y0 + h * .82]] }
          ],
          boundary: rect(x0 + w * .05, y0 + h * .05, w * .9, h * .9)
        };
      }
    },
    {
      id: 'rain',
      zh: '雨水花园边', en: 'Rain garden edge',
      zhHint: '水边湿地 + 开敞草坪', enHint: 'Wet edge with open lawn',
      build(b) {
        const { x0, y0, w, h } = b;
        return {
          zones: [
            { type: 'edge', pts: [[x0 + w * .08, y0 + h * .55], [x0 + w * .55, y0 + h * .48], [x0 + w * .7, y0 + h * .72], [x0 + w * .2, y0 + h * .88]] },
            { type: 'lawn', pts: rect(x0 + w * .28, y0 + h * .16, w * .45, h * .34) },
            { type: 'shrub', pts: rect(x0 + w * .12, y0 + h * .18, w * .16, h * .3) },
            { type: 'canopy', pts: rect(x0 + w * .72, y0 + h * .2, w * .16, h * .28) },
            { type: 'ground', pts: rect(x0 + w * .58, y0 + h * .55, w * .22, h * .18) }
          ],
          paths: [
            { kind: 'arrow', pts: [[x0 + w * .4, y0 + h * .12], [x0 + w * .42, y0 + h * .02]] },
            { kind: 'spine', pts: [[x0 + w * .2, y0 + h * .4], [x0 + w * .5, y0 + h * .42], [x0 + w * .78, y0 + h * .5]] }
          ],
          boundary: rect(x0 + w * .05, y0 + h * .05, w * .9, h * .9)
        };
      }
    }
  ];

  function rect(x, y, w, h) {
    return [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  }

  const I18N = {
    zh: {
      base: '底图', upload: '上传场地底图', clearBase: '清除底图',
      tools: '工具', draw: '绘制分区', boundary: '场地边界', spine: '种植廊道', arrow: '方向箭头',
      select: '选择', pan: '平移',
      drawHint: '单击加点；分区/边界至少 3 点，廊道/箭头至少 2 点。双击或 Enter 完成，Esc 取消。',
      presets: '种植预设', theme: '配色主题', chrome: '图面元素',
      showLegend: '图例', showScale: '比例尺', showNorth: '指北针',
      legend: '种植图例', note: '概念备注',
      notePh: '例如：南侧密植乔木遮阴；中部草坪保持开敞。',
      zones: '分区与路径', roundCorners: '一键圆角',
      roundHint: '对选中分区圆角；未选中时对全部分区生效。',
      deleteZone: '删除选中',
      emptyTitle: '先放一张场地底图', emptyBody: '上传总平或截图，或直接套用种植预设。',
      ready: '就绪', drawing: '绘制中…', selected: '已选中',
      saved: '项目已保存', exported: 'PNG 已导出', svgExported: 'SVG 已导出', imported: '项目已导入',
      needPoly: '至少需要 3 个点', needPath: '至少需要 2 个点', deleted: '已删除',
      rounded: '已圆角', noZones: '没有可圆角的分区', presetApplied: '预设已套用',
      undid: '已撤销', redid: '已重做',
      pathSpine: '廊道', pathArrow: '箭头', itemBoundary: '场地边界'
    },
    en: {
      base: 'Base plan', upload: 'Upload site plan', clearBase: 'Clear base',
      tools: 'Tools', draw: 'Draw zone', boundary: 'Site edge', spine: 'Corridor', arrow: 'Arrow',
      select: 'Select', pan: 'Pan',
      drawHint: 'Click to add points. Zones/edge need 3+ points; corridor/arrow need 2+. Double-click or Enter to finish. Esc cancels.',
      presets: 'Planting presets', theme: 'Theme', chrome: 'Board chrome',
      showLegend: 'Legend', showScale: 'Scale bar', showNorth: 'North arrow',
      legend: 'Planting legend', note: 'Concept note',
      notePh: 'e.g. Dense canopy on the south edge; lawn kept open in the center.',
      zones: 'Zones & paths', roundCorners: 'Round corners',
      roundHint: 'Rounds selected zone; if none selected, rounds all zones.',
      deleteZone: 'Delete selected',
      emptyTitle: 'Drop a site plan to start', emptyBody: 'Upload a plan image, or apply a planting preset.',
      ready: 'Ready', drawing: 'Drawing…', selected: 'Selected',
      saved: 'Project saved', exported: 'PNG exported', svgExported: 'SVG exported', imported: 'Project imported',
      needPoly: 'Need at least 3 points', needPath: 'Need at least 2 points', deleted: 'Deleted',
      rounded: 'Corners rounded', noZones: 'No zones to round', presetApplied: 'Preset applied',
      undid: 'Undone', redid: 'Redone',
      pathSpine: 'Corridor', pathArrow: 'Arrow', itemBoundary: 'Site edge'
    }
  };

  const Store = window.PlantMapStore;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const params = new URLSearchParams(window.location.search);
  let projectId = params.get('id') || (Store && Store.getActiveId()) || null;
  if (!projectId || !Store || !Store.getProject(projectId)) {
    window.location.replace('workspace.html');
    return;
  }
  Store.setActiveId(projectId);

  let lang = localStorage.getItem('pm_lang') || 'zh';
  let themeKey = 'forest';
  let TYPES = THEMES[themeKey].types;
  let tool = 'draw';
  let activeType = 'canopy';
  let baseImage = null;
  let baseDataUrl = '';
  let zones = [];
  let paths = [];
  let boundary = null;
  let selected = null; // { kind:'zone'|'path'|'boundary', id }
  let draft = [];
  let view = { x: 0, y: 0, scale: 1 };
  let panning = false;
  let panStart = null;
  let spacePan = false;
  let chrome = { legend: true, scale: true, north: true };
  let undoStack = [];
  let redoStack = [];
  let historyReady = false;

  const canvas = $('#board');
  const ctx = canvas.getContext('2d');
  const wrap = $('#canvasWrap');

  function t(key) { return (I18N[lang] || I18N.zh)[key] || key; }
  function typeMeta(id) { return TYPES.find((x) => x.id === id) || TYPES[0]; }
  function uid(prefix = 'z') { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`; }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove('on'), 1800);
  }

  function snapState() {
    return JSON.stringify({
      zones, paths, boundary, selected, activeType, themeKey, chrome,
      name: $('#projectName').value, note: $('#note').value
    });
  }

  function pushHistory() {
    if (!historyReady) return;
    const s = snapState();
    if (undoStack[undoStack.length - 1] === s) return;
    undoStack.push(s);
    if (undoStack.length > 60) undoStack.shift();
    redoStack = [];
    syncHistoryButtons();
  }

  function restoreState(raw) {
    const d = JSON.parse(raw);
    zones = d.zones || [];
    paths = d.paths || [];
    boundary = d.boundary || null;
    selected = d.selected || null;
    activeType = d.activeType || 'canopy';
    themeKey = d.themeKey || 'forest';
    TYPES = THEMES[themeKey].types;
    chrome = { legend: true, scale: true, north: true, ...(d.chrome || {}) };
    $('#projectName').value = d.name || $('#projectName').value;
    $('#note').value = d.note || '';
    $('#showLegend').checked = chrome.legend;
    $('#showScale').checked = chrome.scale;
    $('#showNorth').checked = chrome.north;
    draft = [];
    renderAllUi();
    draw();
  }

  function undo() {
    if (undoStack.length < 2) return;
    const cur = undoStack.pop();
    redoStack.push(cur);
    restoreState(undoStack[undoStack.length - 1]);
    try { persist(); } catch (_) { /* ignore */ }
    toast(t('undid'));
    syncHistoryButtons();
  }

  function redo() {
    if (!redoStack.length) return;
    const next = redoStack.pop();
    undoStack.push(next);
    restoreState(next);
    try { persist(); } catch (_) { /* ignore */ }
    toast(t('redid'));
    syncHistoryButtons();
  }

  function syncHistoryButtons() {
    $('#undoBtn').disabled = undoStack.length < 2;
    $('#redoBtn').disabled = !redoStack.length;
  }

  function applyLang() {
    $$('[data-i]').forEach((node) => {
      const key = node.getAttribute('data-i');
      if (I18N[lang][key] != null) node.textContent = I18N[lang][key];
    });
    $('#note').placeholder = t('notePh');
    $('#langBtn').textContent = lang === 'zh' ? 'EN' : '中文';
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('pm_lang', lang);
    renderAllUi();
    setStatus(t('ready'));
  }

  function setStatus(text) {
    $('#statusText').textContent = text;
    $('#zoomText').textContent = `${Math.round(view.scale * 100)}%`;
  }

  function renderAllUi() {
    renderLegend();
    renderPresets();
    renderThemes();
    renderZoneList();
    syncTools();
    syncHistoryButtons();
  }

  function renderLegend() {
    $('#legend').innerHTML = TYPES.map((type) => {
      const label = lang === 'zh' ? type.zh : type.en;
      const hint = lang === 'zh' ? type.zhHint : type.enHint;
      return `<button type="button" class="legend-item ${type.id} ${activeType === type.id ? 'on' : ''}" data-type="${type.id}">
        <span class="legend-swatch" style="background:${type.color}"></span>
        <span><b>${label}</b><small>${hint}</small></span>
      </button>`;
    }).join('');
    $$('.legend-item').forEach((btn) => {
      btn.onclick = () => {
        activeType = btn.dataset.type;
        tool = 'draw';
        syncTools();
        renderLegend();
      };
    });
  }

  function renderPresets() {
    $('#presetRow').innerHTML = PRESETS.map((p) => `
      <button type="button" class="preset-btn" data-preset="${p.id}">
        <b>${lang === 'zh' ? p.zh : p.en}</b>
        <small>${lang === 'zh' ? p.zhHint : p.enHint}</small>
      </button>
    `).join('');
    $$('[data-preset]').forEach((btn) => {
      btn.onclick = () => applyPreset(btn.dataset.preset);
    });
  }

  function renderThemes() {
    $('#themeRow').innerHTML = Object.entries(THEMES).map(([key, theme]) => `
      <button type="button" class="theme-btn ${themeKey === key ? 'on' : ''}" data-theme="${key}">
        <b>${lang === 'zh' ? theme.zh : theme.en}</b>
        <span class="theme-swatches">${theme.types.slice(0, 5).map((tp) => `<i style="background:${tp.color}"></i>`).join('')}</span>
      </button>
    `).join('');
    $$('[data-theme]').forEach((btn) => {
      btn.onclick = () => {
        pushHistory();
        themeKey = btn.dataset.theme;
        TYPES = THEMES[themeKey].types;
        renderAllUi();
        draw();
        try { persist(); } catch (_) { /* ignore */ }
      };
    });
  }

  function renderZoneList() {
    const rows = [];
    if (boundary) {
      rows.push({ kind: 'boundary', id: boundary.id, label: t('itemBoundary'), meta: `${boundary.points.length} pts` });
    }
    zones.forEach((z, i) => {
      const meta = typeMeta(z.type);
      rows.push({
        kind: 'zone', id: z.id,
        label: `${i + 1}. ${lang === 'zh' ? meta.zh : meta.en}`,
        meta: `${z.points.length} pts`
      });
    });
    paths.forEach((p, i) => {
      rows.push({
        kind: 'path', id: p.id,
        label: `${p.kind === 'arrow' ? t('pathArrow') : t('pathSpine')} ${i + 1}`,
        meta: `${p.points.length} pts`
      });
    });
    const list = $('#zoneList');
    if (!rows.length) {
      list.innerHTML = `<div class="zone-row"><b>${lang === 'zh' ? '暂无对象' : 'Nothing yet'}</b></div>`;
      return;
    }
    list.innerHTML = rows.map((r) => `
      <div class="zone-row ${selected && selected.kind === r.kind && selected.id === r.id ? 'on' : ''}" data-kind="${r.kind}" data-id="${r.id}">
        <b>${r.label}</b><span>${r.meta}</span>
      </div>
    `).join('');
    $$('.zone-row[data-id]').forEach((row) => {
      row.onclick = () => {
        selected = { kind: row.dataset.kind, id: row.dataset.id };
        tool = 'select';
        syncTools();
        renderZoneList();
        draw();
        setStatus(t('selected'));
      };
    });
  }

  function syncTools() {
    $$('.tool').forEach((btn) => btn.classList.toggle('on', btn.dataset.tool === tool));
    canvas.classList.toggle('pan', tool === 'pan' || spacePan);
  }

  function designBounds() {
    if (baseImage) {
      return { x0: baseImage.width * 0.05, y0: baseImage.height * 0.05, w: baseImage.width * 0.9, h: baseImage.height * 0.9 };
    }
    const rect = wrap.getBoundingClientRect();
    const worldW = rect.width / view.scale;
    const worldH = rect.height / view.scale;
    return { x0: worldW * 0.08, y0: worldH * 0.08, w: worldW * 0.84, h: worldH * 0.84 };
  }

  function applyPreset(id) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    pushHistory();
    const built = preset.build(designBounds());
    boundary = { id: uid('b'), points: built.boundary };
    zones = built.zones.map((z) => ({ id: uid('z'), type: z.type, points: z.pts.map((p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : { ...p })) }));
    paths = built.paths.map((p) => ({
      id: uid('p'),
      kind: p.kind,
      points: p.pts.map((pt) => (Array.isArray(pt) ? { x: pt[0], y: pt[1] } : { ...pt }))
    }));
    selected = null;
    draft = [];
    renderZoneList();
    draw();
    try { persist(); } catch (_) { /* ignore */ }
    toast(t('presetApplied'));
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function screenToWorld(sx, sy) {
    return { x: (sx - view.x) / view.scale, y: (sy - view.y) / view.scale };
  }

  function fitBase() {
    if (!baseImage) return;
    const rect = wrap.getBoundingClientRect();
    const pad = 48;
    const scale = Math.min((rect.width - pad * 2) / baseImage.width, (rect.height - pad * 2) / baseImage.height);
    view.scale = Math.max(0.1, scale);
    view.x = (rect.width - baseImage.width * view.scale) / 2;
    view.y = (rect.height - baseImage.height * view.scale) / 2;
  }

  function drawPolygonPath(points, close = true) {
    if (!points.length) return;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    if (close && points.length > 2) ctx.closePath();
  }

  function drawArrowHead(c, from, to, size) {
    const ang = Math.atan2(to.y - from.y, to.x - from.x);
    c.beginPath();
    c.moveTo(to.x, to.y);
    c.lineTo(to.x - Math.cos(ang - 0.45) * size, to.y - Math.sin(ang - 0.45) * size);
    c.lineTo(to.x - Math.cos(ang + 0.45) * size, to.y - Math.sin(ang + 0.45) * size);
    c.closePath();
    c.fill();
  }

  function drawChromeOverlay(targetCtx, contentW, contentH, scale = 1) {
    if (chrome.north) {
      const nx = contentW - 48 / scale;
      const ny = 48 / scale;
      targetCtx.save();
      targetCtx.translate(nx, ny);
      targetCtx.fillStyle = '#1B1C1E';
      targetCtx.beginPath();
      targetCtx.moveTo(0, -18 / scale);
      targetCtx.lineTo(7 / scale, 10 / scale);
      targetCtx.lineTo(0, 4 / scale);
      targetCtx.lineTo(-7 / scale, 10 / scale);
      targetCtx.closePath();
      targetCtx.fill();
      targetCtx.font = `${11 / scale}px "Space Mono", monospace`;
      targetCtx.fillText('N', -4 / scale, -22 / scale);
      targetCtx.restore();
    }
    if (chrome.scale) {
      const sx = 32 / scale;
      const sy = contentH - 36 / scale;
      const bar = Math.min(contentW * 0.18, 160 / scale);
      targetCtx.strokeStyle = '#1B1C1E';
      targetCtx.fillStyle = '#1B1C1E';
      targetCtx.lineWidth = 2 / scale;
      targetCtx.beginPath();
      targetCtx.moveTo(sx, sy);
      targetCtx.lineTo(sx + bar, sy);
      targetCtx.moveTo(sx, sy - 6 / scale);
      targetCtx.lineTo(sx, sy + 6 / scale);
      targetCtx.moveTo(sx + bar, sy - 6 / scale);
      targetCtx.lineTo(sx + bar, sy + 6 / scale);
      targetCtx.stroke();
      targetCtx.font = `${11 / scale}px "Space Mono", monospace`;
      targetCtx.fillText(lang === 'zh' ? '示意比例' : 'INDICATIVE', sx, sy - 10 / scale);
    }
  }

  function drawScene(targetCtx, opts = {}) {
    const { skipChrome = false } = opts;
    if (baseImage) targetCtx.drawImage(baseImage, 0, 0);

    if (boundary) {
      targetCtx.beginPath();
      drawPolyOn(targetCtx, boundary.points, true);
      targetCtx.setLineDash([10 / view.scale, 8 / view.scale]);
      targetCtx.strokeStyle = selected?.kind === 'boundary' ? '#E0533F' : '#1B1C1E';
      targetCtx.lineWidth = 2 / view.scale;
      targetCtx.stroke();
      targetCtx.setLineDash([]);
    }

    zones.forEach((z) => {
      const meta = typeMeta(z.type);
      targetCtx.beginPath();
      drawPolyOn(targetCtx, z.points, true);
      targetCtx.fillStyle = meta.fill;
      targetCtx.fill();
      targetCtx.lineWidth = (selected?.kind === 'zone' && selected.id === z.id ? 2.6 : 1.5) / view.scale;
      targetCtx.strokeStyle = meta.color;
      if (meta.dashed) targetCtx.setLineDash([8 / view.scale, 6 / view.scale]);
      else targetCtx.setLineDash([]);
      targetCtx.stroke();
      targetCtx.setLineDash([]);
      const c = centroid(z.points);
      if (c) {
        targetCtx.fillStyle = 'rgba(15,15,14,.78)';
        targetCtx.font = `${12 / view.scale}px "Space Mono", monospace`;
        targetCtx.fillText(lang === 'zh' ? meta.zh : meta.en, c.x + 4 / view.scale, c.y);
      }
    });

    paths.forEach((p) => {
      if (p.points.length < 2) return;
      const selectedPath = selected?.kind === 'path' && selected.id === p.id;
      targetCtx.beginPath();
      drawPolyOn(targetCtx, p.points, false);
      targetCtx.strokeStyle = p.kind === 'arrow' ? '#E0533F' : '#2F6B45';
      targetCtx.lineWidth = (p.kind === 'spine' ? 10 : 3.5) / view.scale;
      targetCtx.lineCap = 'round';
      targetCtx.lineJoin = 'round';
      targetCtx.globalAlpha = p.kind === 'spine' ? 0.55 : 0.95;
      if (selectedPath) targetCtx.lineWidth = (p.kind === 'spine' ? 12 : 4.5) / view.scale;
      targetCtx.stroke();
      targetCtx.globalAlpha = 1;
      if (p.kind === 'arrow') {
        const a = p.points[p.points.length - 2];
        const b = p.points[p.points.length - 1];
        targetCtx.fillStyle = '#E0533F';
        drawArrowHead(targetCtx, a, b, 16 / view.scale);
      }
    });

    if (draft.length) {
      const isPath = tool === 'spine' || tool === 'arrow';
      targetCtx.beginPath();
      drawPolyOn(targetCtx, draft, false);
      targetCtx.strokeStyle = tool === 'boundary' ? '#1B1C1E' : tool === 'arrow' ? '#E0533F' : tool === 'spine' ? '#2F6B45' : typeMeta(activeType).color;
      targetCtx.lineWidth = (isPath && tool === 'spine' ? 8 : 1.8) / view.scale;
      targetCtx.setLineDash([6 / view.scale, 5 / view.scale]);
      targetCtx.stroke();
      targetCtx.setLineDash([]);
      draft.forEach((p) => {
        targetCtx.beginPath();
        targetCtx.arc(p.x, p.y, 3.5 / view.scale, 0, Math.PI * 2);
        targetCtx.fillStyle = targetCtx.strokeStyle;
        targetCtx.fill();
      });
    }

    if (!skipChrome) {
      const contentW = baseImage ? baseImage.width : wrap.getBoundingClientRect().width / view.scale;
      const contentH = baseImage ? baseImage.height : wrap.getBoundingClientRect().height / view.scale;
      if (chrome.legend) {
        let ly = 24 / view.scale;
        const lx = 20 / view.scale;
        TYPES.forEach((type) => {
          targetCtx.fillStyle = type.dashed ? 'transparent' : type.color;
          targetCtx.strokeStyle = type.color;
          targetCtx.lineWidth = 1.5 / view.scale;
          targetCtx.fillRect(lx, ly, 12 / view.scale, 12 / view.scale);
          targetCtx.strokeRect(lx, ly, 12 / view.scale, 12 / view.scale);
          targetCtx.fillStyle = '#1B1C1E';
          targetCtx.font = `${11 / view.scale}px "Space Mono", monospace`;
          targetCtx.fillText(lang === 'zh' ? type.zh : type.en, lx + 18 / view.scale, ly + 10 / view.scale);
          ly += 18 / view.scale;
        });
      }
      drawChromeOverlay(targetCtx, contentW, contentH, view.scale);
    }
  }

  function drawPolyOn(c, points, close) {
    if (!points.length) return;
    c.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i].x, points[i].y);
    if (close && points.length > 2) c.closePath();
  }

  function draw() {
    const rect = wrap.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    ctx.translate(view.x, view.y);
    ctx.scale(view.scale, view.scale);
    drawScene(ctx);
    ctx.restore();
    $('#emptyState').classList.toggle('hidden', Boolean(baseImage) || zones.length > 0 || paths.length > 0 || boundary);
  }

  function centroid(points) {
    if (!points.length) return null;
    let x = 0; let y = 0;
    points.forEach((p) => { x += p.x; y += p.y; });
    return { x: x / points.length, y: y / points.length };
  }

  function pointInPoly(point, vs) {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x; const yi = vs[i].y;
      const xj = vs[j].x; const yj = vs[j].y;
      const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function nearPath(point, pts, thresh) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]; const b = pts[i];
      const dx = b.x - a.x; const dy = b.y - a.y;
      const len2 = dx * dx + dy * dy || 1;
      let tval = ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2;
      tval = Math.max(0, Math.min(1, tval));
      const px = a.x + tval * dx; const py = a.y + tval * dy;
      if (Math.hypot(point.x - px, point.y - py) <= thresh) return true;
    }
    return false;
  }

  function closeDraft() {
    const isPath = tool === 'spine' || tool === 'arrow';
    if (isPath) {
      if (draft.length < 2) { toast(t('needPath')); return; }
      pushHistory();
      const item = { id: uid('p'), kind: tool === 'arrow' ? 'arrow' : 'spine', points: draft.slice() };
      paths.push(item);
      selected = { kind: 'path', id: item.id };
    } else if (tool === 'boundary') {
      if (draft.length < 3) { toast(t('needPoly')); return; }
      pushHistory();
      boundary = { id: uid('b'), points: draft.slice() };
      selected = { kind: 'boundary', id: boundary.id };
    } else {
      if (draft.length < 3) { toast(t('needPoly')); return; }
      pushHistory();
      const z = { id: uid('z'), type: activeType, points: draft.slice() };
      zones.push(z);
      selected = { kind: 'zone', id: z.id };
    }
    draft = [];
    tool = 'select';
    syncTools();
    renderZoneList();
    try { persist(); } catch (_) { /* ignore */ }
    draw();
    setStatus(t('ready'));
  }

  function roundPolygonCorners(points, iterations = 2) {
    if (!points || points.length < 3) return (points || []).map((p) => ({ x: p.x, y: p.y }));
    let pts = points.map((p) => ({ x: p.x, y: p.y }));
    for (let pass = 0; pass < iterations; pass++) {
      const next = [];
      const n = pts.length;
      for (let i = 0; i < n; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % n];
        next.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 });
        next.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 });
      }
      pts = next;
    }
    return pts;
  }

  function roundSelectedOrAll() {
    const targets = selected?.kind === 'zone'
      ? zones.filter((z) => z.id === selected.id)
      : zones.slice();
    if (!targets.length) { toast(t('noZones')); return; }
    pushHistory();
    targets.forEach((z) => {
      z.points = roundPolygonCorners(z.points, z.points.length > 40 ? 1 : 2);
    });
    tool = 'select';
    syncTools();
    renderZoneList();
    draw();
    try { persist(); } catch (_) { /* ignore */ }
    toast(t('rounded'));
  }

  function boardPayload() {
    return {
      schema: 'plantmap.project.v1',
      name: $('#projectName').value.trim() || 'Untitled Planting Board',
      note: $('#note').value,
      baseDataUrl,
      zones,
      paths,
      boundary,
      theme: themeKey,
      boardChrome: chrome,
      updatedAt: new Date().toISOString()
    };
  }

  function persist() {
    const payload = boardPayload();
    Store.saveBoard(projectId, payload);
    try { localStorage.setItem('pm_project_v1', JSON.stringify(payload)); } catch (_) { /* ignore */ }
  }

  function loadPersisted() {
    try {
      const project = Store.getProject(projectId);
      if (project?.board) applyProject(project.board, false);
    } catch (_) { /* ignore */ }
  }

  function applyProject(data, announce) {
    $('#projectName').value = data.name || 'Untitled Planting Board';
    $('#note').value = data.note || '';
    zones = Array.isArray(data.zones) ? data.zones : [];
    paths = Array.isArray(data.paths) ? data.paths : [];
    boundary = data.boundary || null;
    themeKey = data.theme && THEMES[data.theme] ? data.theme : 'forest';
    TYPES = THEMES[themeKey].types;
    chrome = { legend: true, scale: true, north: true, ...(data.boardChrome || {}) };
    $('#showLegend').checked = chrome.legend;
    $('#showScale').checked = chrome.scale;
    $('#showNorth').checked = chrome.north;
    selected = null;
    draft = [];
    baseDataUrl = data.baseDataUrl || '';
    const finish = () => {
      historyReady = true;
      undoStack = [snapState()];
      redoStack = [];
      renderAllUi();
      draw();
      if (announce) toast(t('imported'));
    };
    if (baseDataUrl) {
      const img = new Image();
      img.onload = () => { baseImage = img; fitBase(); finish(); };
      img.src = baseDataUrl;
    } else {
      baseImage = null;
      finish();
    }
  }

  function contentSize() {
    return {
      w: baseImage ? baseImage.width : 1600,
      h: baseImage ? baseImage.height : 1000
    };
  }

  function exportPng() {
    const { w: contentW, h: contentH } = contentSize();
    const legendW = chrome.legend ? 260 : 40;
    const pad = 32;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = contentW + legendW + pad * 2;
    exportCanvas.height = Math.max(contentH + pad * 2, 720);
    const ex = exportCanvas.getContext('2d');
    ex.fillStyle = '#F7F4EE';
    ex.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ex.save();
    ex.translate(pad, pad);
    const oldScale = view.scale;
    view.scale = 1;
    drawScene(ex, { skipChrome: false });
    view.scale = oldScale;
    ex.restore();
    const a = document.createElement('a');
    a.download = `${($('#projectName').value || 'planting-concept').replace(/[^\w\-]+/g, '_')}.png`;
    a.href = exportCanvas.toDataURL('image/png');
    a.click();
    toast(t('exported'));
  }

  function exportSvg() {
    const { w: contentW, h: contentH } = contentSize();
    const pad = 32;
    const legendW = chrome.legend ? 240 : 0;
    const width = contentW + legendW + pad * 2;
    const height = Math.max(contentH + pad * 2, 720);
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const poly = (pts, close = true) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + (close ? ' Z' : '');
    let body = `<rect x="0" y="0" width="${width}" height="${height}" fill="#F7F4EE"/>`;
    body += `<g transform="translate(${pad} ${pad})">`;
    if (baseDataUrl) body += `<image href="${esc(baseDataUrl)}" x="0" y="0" width="${contentW}" height="${contentH}" />`;
    else body += `<rect x="0" y="0" width="${contentW}" height="${contentH}" fill="#E8E2D8"/>`;
    if (boundary) body += `<path d="${poly(boundary.points)}" fill="none" stroke="#1B1C1E" stroke-width="2" stroke-dasharray="10 8"/>`;
    zones.forEach((z) => {
      const meta = typeMeta(z.type);
      body += `<path d="${poly(z.points)}" fill="${meta.fill}" stroke="${meta.color}" stroke-width="2"${meta.dashed ? ' stroke-dasharray="8 6"' : ''}/>`;
    });
    paths.forEach((p) => {
      const col = p.kind === 'arrow' ? '#E0533F' : '#2F6B45';
      const sw = p.kind === 'spine' ? 10 : 3.5;
      body += `<path d="${poly(p.points, false)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${p.kind === 'spine' ? 0.55 : 0.95}"/>`;
    });
    body += '</g>';
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${($('#projectName').value || 'planting-concept').replace(/[^\w\-]+/g, '_')}.svg`;
    a.click();
    toast(t('svgExported'));
  }

  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const world = screenToWorld(sx, sy);

    if (tool === 'pan' || spacePan || e.button === 1) {
      panning = true;
      panStart = { x: sx, y: sy, vx: view.x, vy: view.y };
      canvas.classList.add('panning');
      return;
    }

    if (tool === 'select') {
      let hit = null;
      for (let i = paths.length - 1; i >= 0; i--) {
        if (nearPath(world, paths[i].points, 12 / view.scale)) { hit = { kind: 'path', id: paths[i].id }; break; }
      }
      if (!hit) {
        for (let i = zones.length - 1; i >= 0; i--) {
          if (pointInPoly(world, zones[i].points)) { hit = { kind: 'zone', id: zones[i].id }; break; }
        }
      }
      if (!hit && boundary && pointInPoly(world, boundary.points)) hit = { kind: 'boundary', id: boundary.id };
      selected = hit;
      renderZoneList();
      draw();
      setStatus(hit ? t('selected') : t('ready'));
      return;
    }

    if (['draw', 'boundary', 'spine', 'arrow'].includes(tool)) {
      draft.push(world);
      setStatus(t('drawing'));
      draw();
    }
  }

  function onPointerMove(e) {
    if (!panning || !panStart) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    view.x = panStart.vx + (sx - panStart.x);
    view.y = panStart.vy + (sy - panStart.y);
    draw();
  }

  function onPointerUp() {
    panning = false;
    panStart = null;
    canvas.classList.remove('panning');
  }

  function onWheel(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const before = screenToWorld(sx, sy);
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    view.scale = Math.min(6, Math.max(0.15, view.scale * factor));
    view.x = sx - before.x * view.scale;
    view.y = sy - before.y * view.scale;
    setStatus(t('ready'));
    draw();
  }

  $$('.tool').forEach((btn) => {
    btn.onclick = () => {
      tool = btn.dataset.tool;
      draft = [];
      syncTools();
      draw();
    };
  });

  $('#langBtn').onclick = () => { lang = lang === 'zh' ? 'en' : 'zh'; applyLang(); draw(); };
  $('#undoBtn').onclick = undo;
  $('#redoBtn').onclick = redo;

  $('#uploadBtn').onclick = () => $('#baseFile').click();
  $('#baseFile').onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        pushHistory();
        baseImage = img;
        baseDataUrl = String(reader.result);
        fitBase();
        try { persist(); } catch (_) { /* ignore */ }
        draw();
        toast(lang === 'zh' ? '底图已加载' : 'Base loaded');
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  $('#clearBaseBtn').onclick = () => {
    pushHistory();
    baseImage = null;
    baseDataUrl = '';
    try { persist(); } catch (_) { /* ignore */ }
    draw();
  };

  $('#roundCornersBtn').addEventListener('click', (e) => {
    e.preventDefault();
    roundSelectedOrAll();
  });

  $('#deleteZoneBtn').onclick = () => {
    if (!selected) return;
    pushHistory();
    if (selected.kind === 'zone') zones = zones.filter((z) => z.id !== selected.id);
    if (selected.kind === 'path') paths = paths.filter((p) => p.id !== selected.id);
    if (selected.kind === 'boundary') boundary = null;
    selected = null;
    renderZoneList();
    try { persist(); } catch (_) { /* ignore */ }
    draw();
    toast(t('deleted'));
  };

  function syncChromeFromUi() {
    chrome = {
      legend: $('#showLegend').checked,
      scale: $('#showScale').checked,
      north: $('#showNorth').checked
    };
    draw();
    try { persist(); } catch (_) { /* ignore */ }
  }
  ['showLegend', 'showScale', 'showNorth'].forEach((id) => {
    $(`#${id}`).addEventListener('change', () => {
      pushHistory();
      syncChromeFromUi();
    });
  });

  $('#note').addEventListener('change', () => { pushHistory(); try { persist(); } catch (_) { /* ignore */ } });
  $('#projectName').addEventListener('change', () => { pushHistory(); try { persist(); } catch (_) { /* ignore */ } });

  const exportMenu = $('#exportMenu');
  $('#exportMenuBtn').onclick = () => {
    exportMenu.hidden = !exportMenu.hidden;
  };
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.export-wrap')) exportMenu.hidden = true;
  });
  $('#exportPngBtn').onclick = () => { exportMenu.hidden = true; exportPng(); };
  $('#exportSvgBtn').onclick = () => { exportMenu.hidden = true; exportSvg(); };

  $('#exportJsonBtn').onclick = () => {
    try { persist(); } catch (_) { /* ignore */ }
    const payload = {
      schema: 'plantmap.bundle.v1',
      exportedAt: new Date().toISOString(),
      project: Store.getProject(projectId)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${($('#projectName').value || 'plantmap').replace(/[^\w\-]+/g, '_')}.json`;
    a.click();
    toast(t('saved'));
  };

  $('#importJsonBtn').onclick = () => $('#importJsonFile').click();
  $('#importJsonFile').onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const board = data.project?.board || data.board || data.project || data;
      applyProject(board, true);
      try { persist(); } catch (_) { /* ignore */ }
    } catch (_) {
      toast(lang === 'zh' ? '文件无效' : 'Invalid file');
    }
    e.target.value = '';
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('dblclick', () => { if (draft.length) closeDraft(); });
  canvas.addEventListener('wheel', onWheel, { passive: false });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
    if (e.code === 'Space') { spacePan = true; syncTools(); }
    if (e.key === 'Enter' && draft.length) closeDraft();
    if (e.key === 'Escape') { draft = []; draw(); setStatus(t('ready')); }
    if ((e.key === 'Backspace' || e.key === 'Delete') && selected && tool === 'select') {
      $('#deleteZoneBtn').click();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') { spacePan = false; syncTools(); }
  });

  wrap.addEventListener('dragover', (e) => e.preventDefault());
  wrap.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        pushHistory();
        baseImage = img;
        baseDataUrl = String(reader.result);
        fitBase();
        try { persist(); } catch (_) { /* ignore */ }
        draw();
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  window.addEventListener('resize', resize);
  applyLang();
  syncTools();
  loadPersisted();
  if (!historyReady) {
    historyReady = true;
    undoStack = [snapState()];
    redoStack = [];
    syncHistoryButtons();
  }
  resize();
})();
