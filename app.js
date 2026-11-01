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
      dropLimit: 'Recommended: up to 500 MB in total. Files are processed in your browser memory.',
      clear: 'Clear list',
      empty: 'No files yet',
      queue: (n, size) => `${n} ${n === 1 ? 'file' : 'files'} in queue · ${size}`,
      sizeWarn: (size) => `The batch weighs ${size}. Above 500 MB the browser may slow down or close the tab. Consider printing in smaller groups.`,
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
      howTitle: "How it works",
      howSub: "Three steps from a folder full of PDFs to a single print job.",
      step1Title: "Add your files",
      step1Body: "Drag the PDFs onto the drop zone or click it to browse. Each file is checked on arrival and shows its page count and size, and anything that is not a valid PDF is flagged so it never reaches the printer.",
      step2Title: "Set the order and options",
      step2Body: "Sort by name or date, or move files up and down by hand. Choose how many copies you need and turn on duplex padding if you print on both sides. The counters show exactly how many pages will come out.",
      step3Title: "Print once",
      step3Body: "Press Print all. The files are merged into one document and the system print dialog opens. Pick the printer, paper and quality a single time and the whole batch is sent as one job.",
      helpTitle: "Tips and frequently asked questions",
      helpSub: "Everything you need to know before printing a large batch.",
      help1Title: "Why does a dialog appear?",
      help1Body: "Browsers do not allow a web page to send documents straight to a printer, for security reasons. Merging everything first means you only see that dialog once, no matter how many files you add.",
      help2Title: "Is there a size limit?",
      help2Body: "There is no hard limit, but everything is processed in your browser memory. Up to about 500 MB in total works smoothly on a normal computer. Above that, the tab can slow down or close, so split very large batches into smaller groups.",
      help3Title: "What does duplex padding do?",
      help3Body: "When printing on both sides, a document with an odd number of pages would make the next one start on the back of its last sheet. Padding adds a blank page so every document begins on a fresh sheet.",
      help4Title: "Are my files uploaded?",
      help4Body: "No. The PDFs are read and merged locally in your browser and are never sent to any server. You can even use the app without an internet connection once the page has loaded.",
      help5Title: "What if a PDF cannot be read?",
      help5Body: "Damaged files or files with unusual protection are marked in red and skipped automatically. The rest of the batch still prints normally.",
      help6Title: "The dialog did not open",
      help6Body: "Some browsers block printing from an embedded document. Use Download merged PDF instead, open the file and print it from your PDF viewer. The result is exactly the same.",
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
      dropLimit: 'Recomendado: hasta 500 MB en total. Los archivos se procesan en la memoria del navegador.',
      clear: 'Vaciar lista',
      empty: 'Todavía no hay archivos',
      queue: (n, size) => `${n} ${n === 1 ? 'archivo' : 'archivos'} en cola · ${size}`,
      sizeWarn: (size) => `El lote ocupa ${size}. Por encima de 500 MB el navegador puede ir lento o cerrar la pestaña. Mejor imprimir en grupos más pequeños.`,
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
      howTitle: "Cómo funciona",
      howSub: "Tres pasos para pasar de una carpeta llena de PDF a un único trabajo de impresión.",
      step1Title: "Añade tus archivos",
      step1Body: "Arrastra los PDF a la zona de carga o haz clic para buscarlos. Cada archivo se comprueba al llegar y muestra sus páginas y su tamaño, y lo que no sea un PDF válido se marca para que nunca llegue a la impresora.",
      step2Title: "Elige el orden y las opciones",
      step2Body: "Ordena por nombre o por fecha, o sube y baja los archivos a mano. Indica cuántas copias necesitas y activa el relleno para doble cara si imprimes por las dos caras. Los contadores muestran exactamente cuántas páginas saldrán.",
      step3Title: "Imprime una sola vez",
      step3Body: "Pulsa Imprimir todo. Los archivos se unen en un solo documento y se abre el diálogo de impresión del sistema. Eliges impresora, papel y calidad una vez y todo el lote se envía como un único trabajo.",
      helpTitle: "Consejos y preguntas frecuentes",
      helpSub: "Todo lo que conviene saber antes de imprimir un lote grande.",
      help1Title: "¿Por qué aparece un diálogo?",
      help1Body: "Por seguridad, los navegadores no permiten que una web envíe documentos directamente a la impresora. Al unirlo todo antes, solo ves ese diálogo una vez, da igual cuántos archivos añadas.",
      help2Title: "¿Hay límite de tamaño?",
      help2Body: "No hay un límite fijo, pero todo se procesa en la memoria del navegador. Hasta unos 500 MB en total funciona con fluidez en un ordenador normal. Por encima, la pestaña puede ir lenta o cerrarse, así que divide los lotes muy grandes en grupos más pequeños.",
      help3Title: "¿Qué hace el relleno para doble cara?",
      help3Body: "Al imprimir por las dos caras, un documento con páginas impares haría que el siguiente empezara en el reverso de su última hoja. El relleno añade una página en blanco para que cada documento empiece en una hoja nueva.",
      help4Title: "¿Se suben mis archivos?",
      help4Body: "No. Los PDF se leen y se unen en tu navegador y nunca se envían a ningún servidor. Incluso puedes usar la aplicación sin conexión una vez cargada la página.",
      help5Title: "¿Y si un PDF no se puede leer?",
      help5Body: "Los archivos dañados o con protecciones poco habituales se marcan en rojo y se omiten automáticamente. El resto del lote se imprime con normalidad.",
      help6Title: "No se abrió el diálogo",
      help6Body: "Algunos navegadores bloquean la impresión desde un documento incrustado. Usa Descargar PDF unido, abre el archivo e imprímelo desde tu visor de PDF. El resultado es exactamente el mismo.",
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
  const SIZE_WARN_BYTES = 500 * 1024 * 1024;

  const fmtSize = (b) => (b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : b < 1073741824 ? (b / 1048576).toFixed(1) + ' MB' : (b / 1073741824).toFixed(2) + ' GB');
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
    const bytes = ok.reduce((s, i) => s + i.file.size, 0);
    return { ok, pages, bytes, toPrint: padded * copies };
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

    const { ok, pages, bytes, toPrint } = totals();
    $('queueCount').textContent = t('queue', items.length, fmtSize(bytes));
    $('sizeWarn').hidden = bytes <= SIZE_WARN_BYTES;
    $('sizeWarnText').textContent = t('sizeWarn', fmtSize(bytes));
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
