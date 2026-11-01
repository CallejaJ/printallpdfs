(function () {
  'use strict';

  const { PDFDocument } = PDFLib;
  const $ = (id) => document.getElementById(id);

  // ---------- i18n ----------
  const STRINGS = {
    en: {
      legend: 'Drop as many PDFs as you need, put them in order and print them all at once. They are merged in your browser into a single document, so you only pick the printer once.',
      filesTitle: 'Files',
      filesSub: 'Add PDFs and arrange the print order.',
      dropAria: 'Choose PDF files',
      dropTitle: 'Drop your PDFs here',
      dropSub: 'or click to browse your computer',
      clear: 'Clear list',
      empty: 'No files yet',
      queue: (n) => `${n} ${n === 1 ? 'file' : 'files'} in queue`,
      optionsTitle: 'Print options',
      optionsSub: 'Applied to the merged document.',
      order: 'Order',
      orderManual: 'Manual',
      orderName: 'By name',
      orderDate: 'By date',
      copies: 'Copies',
      blank: 'Duplex padding',
      blankHint: 'Adds a blank page after odd-length documents so each one starts on a new sheet.',
      statFiles: 'PDFs',
      statPages: 'Pages',
      statTotal: 'To print',
      print: 'Print all',
      download: 'Download merged PDF',
      privacy: 'Your files never leave your computer. Browsers cannot print without the dialog, so pick the printer once and the whole batch prints.',
      footerBeta: 'Beta version',
      unreadable: 'Unreadable',
      pages: (n) => `${n} pp`,
      skipped: (n) => `Skipped ${n} non-PDF file(s).`,
      merging: 'Merging PDFs…',
      opening: (n) => `Opening the print dialog (${n} pages). If it does not appear, use "Download merged PDF".`,
      downloaded: (n) => `Downloaded: ${n} pages.`,
      error: (m) => `Error: ${m}`,
      up: 'Move up',
      down: 'Move down',
      remove: 'Remove',
      themeLight: 'Switch to light mode',
      themeDark: 'Switch to dark mode',
    },
    es: {
      legend: 'Arrastra todos los PDF que necesites, ordénalos e imprímelos de una vez. Se unen en tu navegador en un solo documento, así que solo eliges la impresora una vez.',
      filesTitle: 'Archivos',
      filesSub: 'Añade PDF y decide el orden de impresión.',
      dropAria: 'Elegir archivos PDF',
      dropTitle: 'Arrastra aquí tus PDF',
      dropSub: 'o haz clic para buscarlos en tu equipo',
      clear: 'Vaciar lista',
      empty: 'Todavía no hay archivos',
      queue: (n) => `${n} ${n === 1 ? 'archivo' : 'archivos'} en cola`,
      optionsTitle: 'Opciones de impresión',
      optionsSub: 'Se aplican al documento unido.',
      order: 'Orden',
      orderManual: 'Manual',
      orderName: 'Por nombre',
      orderDate: 'Por fecha',
      copies: 'Copias',
      blank: 'Relleno para doble cara',
      blankHint: 'Añade una página en blanco tras los documentos impares para que cada uno empiece en hoja nueva.',
      statFiles: 'PDF',
      statPages: 'Páginas',
      statTotal: 'A imprimir',
      print: 'Imprimir todo',
      download: 'Descargar PDF unido',
      privacy: 'Tus archivos no salen de tu equipo. El navegador no puede imprimir sin el diálogo: eliges la impresora una vez y se imprime todo el lote.',
      footerBeta: 'Versión beta',
      unreadable: 'No se puede leer',
      pages: (n) => `${n} pág`,
      skipped: (n) => `Se ignoraron ${n} archivo(s) que no son PDF.`,
      merging: 'Uniendo PDF…',
      opening: (n) => `Abriendo el diálogo de impresión (${n} páginas). Si no aparece, usa "Descargar PDF unido".`,
      downloaded: (n) => `Descargado: ${n} páginas.`,
      error: (m) => `Error: ${m}`,
      up: 'Subir',
      down: 'Bajar',
      remove: 'Quitar',
      themeLight: 'Activar modo claro',
      themeDark: 'Activar modo oscuro',
    },
  };

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  };

  let lang = store.get('lang') === 'es' ? 'es' : 'en';
  const t = (key, ...args) => {
    const v = STRINGS[lang][key];
    return typeof v === 'function' ? v(...args) : v;
  };

  // Status is stored as a key + args so it re-translates on language change.
  let status = null;
  function setStatus(key, ...args) {
    status = key ? { key, args } : null;
    paintStatus();
  }
  function paintStatus() {
    const el = $('status');
    el.textContent = status ? t(status.key, ...status.args) : '';
    el.classList.toggle('error', !!status && status.key === 'error');
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    $('list').dataset.empty = t('empty');
    paintTheme();
    render();
    paintStatus();
  }

  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.onclick = () => { lang = b.dataset.lang; store.set('lang', lang); applyLang(); };
  });

  // ---------- theme ----------
  const SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function paintTheme() {
    const dark = document.documentElement.dataset.theme !== 'light';
    const btn = $('theme');
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('aria-label', dark ? t('themeLight') : t('themeDark'));
    btn.title = btn.getAttribute('aria-label');
  }

  $('theme').onclick = () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
    paintTheme();
  };

  // ---------- queue ----------
  let items = []; // { file, pages, error }
  let lastUrl = null;
  let busy = false;

  const fmtSize = (b) => (b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB');
  const FILE_ICON = '<svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>';

  async function addFiles(fileList) {
    const all = [...fileList];
    const pdfs = all.filter((f) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name));
    const skipped = all.length - pdfs.length;
    for (const file of pdfs) {
      const item = { file, pages: null, error: false };
      items.push(item);
      try {
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        item.pages = doc.getPageCount();
      } catch (e) {
        item.error = true;
      }
    }
    applySort();
    render();
    setStatus(skipped ? 'skipped' : null, skipped);
  }

  function applySort() {
    const mode = $('sort').value;
    if (mode === 'name') items.sort((a, b) => a.file.name.localeCompare(b.file.name, lang, { numeric: true }));
    if (mode === 'date') items.sort((a, b) => a.file.lastModified - b.file.lastModified);
  }

  function totals() {
    const ok = items.filter((i) => !i.error);
    const pages = ok.reduce((s, i) => s + (i.pages || 0), 0);
    const padded = ok.reduce((s, i) => s + (i.pages || 0) + ($('blank').checked && i.pages % 2 === 1 ? 1 : 0), 0);
    const copies = Math.max(1, Math.min(50, parseInt($('copies').value, 10) || 1));
    return { ok, pages, toPrint: padded * copies };
  }

  function render() {
    const list = $('list');
    list.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      if (it.error) li.className = 'err';
      li.innerHTML = `<span class="n">${i + 1}</span>${FILE_ICON}<span class="name"></span>
        <span class="meta"></span>
        <span class="row-actions">
          <button class="mini" type="button" data-a="up">↑</button>
          <button class="mini" type="button" data-a="down">↓</button>
          <button class="icon" type="button" data-a="del">✕</button>
        </span>`;
      li.querySelector('.name').textContent = it.file.name;
      li.querySelector('.name').title = it.file.name;
      li.querySelector('.meta').textContent = it.error ? t('unreadable') : `${it.pages == null ? '…' : t('pages', it.pages)} · ${fmtSize(it.file.size)}`;
      const [up, down, del] = li.querySelectorAll('button');
      up.title = up.ariaLabel = t('up');
      down.title = down.ariaLabel = t('down');
      del.title = del.ariaLabel = t('remove');
      up.disabled = i === 0;
      down.disabled = i === items.length - 1;
      li.querySelectorAll('button').forEach((b) => { b.onclick = () => act(i, b.dataset.a); });
      list.appendChild(li);
    });

    const { ok, pages, toPrint } = totals();
    $('queueCount').textContent = t('queue', items.length);
    $('statFiles').textContent = ok.length;
    $('statPages').textContent = pages;
    $('statSheets').textContent = toPrint;
    $('print').disabled = busy || ok.length === 0;
    $('download').disabled = busy || ok.length === 0;
    $('clear').disabled = busy || items.length === 0;
  }

  function act(i, a) {
    if (a === 'del') items.splice(i, 1);
    if (a === 'up' && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    if (a === 'down' && i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
    if (a !== 'del') $('sort').value = 'manual';
    render();
  }

  // ---------- merge ----------
  async function buildMerged() {
    const out = await PDFDocument.create();
    const copies = Math.max(1, Math.min(50, parseInt($('copies').value, 10) || 1));
    const padBlank = $('blank').checked;
    const sources = [];
    for (const it of items.filter((i) => !i.error)) {
      sources.push(await PDFDocument.load(await it.file.arrayBuffer(), { ignoreEncryption: true }));
    }
    for (let c = 0; c < copies; c++) {
      for (const src of sources) {
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
        if (padBlank && pages.length % 2 === 1) {
          const { width, height } = pages[pages.length - 1].getSize();
          out.addPage([width, height]);
        }
      }
    }
    const bytes = await out.save();
    if (lastUrl) URL.revokeObjectURL(lastUrl);
    lastUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    return { url: lastUrl, pages: out.getPageCount() };
  }

  async function withBusy(fn) {
    busy = true;
    render();
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setStatus('error', e.message);
    } finally {
      busy = false;
      render();
    }
  }

  $('print').onclick = () => withBusy(async () => {
    setStatus('merging');
    const { url, pages } = await buildMerged();
    const frame = $('frame');
    frame.onload = () => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } catch (e) {
        window.open(url, '_blank');
      }
    };
    frame.src = url;
    setStatus('opening', pages);
  });

  $('download').onclick = () => withBusy(async () => {
    setStatus('merging');
    const { url, pages } = await buildMerged();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'printallpdfs-merged.pdf';
    a.click();
    setStatus('downloaded', pages);
  });

  $('clear').onclick = () => { items = []; setStatus(null); render(); };
  $('sort').onchange = () => { applySort(); render(); };
  $('copies').oninput = render;
  $('blank').onchange = render;

  // ---------- drop zone ----------
  const drop = $('drop');
  drop.onclick = () => $('file').click();
  drop.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file').click(); }
  };
  $('file').onchange = (e) => { addFiles(e.target.files); e.target.value = ''; };
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', (e) => addFiles(e.dataTransfer.files));
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => e.preventDefault());

  $('year').textContent = new Date().getFullYear();
  applyLang();
})();
