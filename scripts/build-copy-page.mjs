import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync('src/about-us-page.portable.tsx', 'utf8');

const cssMatch = source.match(/const aboutStyles = `([\s\S]*?)`;\s*$/);
const css = cssMatch ? cssMatch[1].trim() : '';
const brandStart = source.indexOf('const BRAND = {');
const brandEnd = source.indexOf('/* ---------------------------------------------------------------------------\n * EDIT 3');
const brand = brandStart !== -1 && brandEnd !== -1 ? source.slice(brandStart, brandEnd).trim() : '';

const esc = (s) => JSON.stringify(s).replace(/</g, '\\u003c');

const FULL = esc(source);
const CSS = esc(css);
const BRAND = esc(brand);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Copy About Us page — Balloon Creation</title>
<style>
  :root { --ink:#37301f; --soft:#6b5f4c; --gold:#a97c33; --line:rgba(169,124,51,.26); }
  * { box-sizing:border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:var(--ink);
         background:linear-gradient(160deg,#fdfaf0,#f7efe0 60%,#fbf3e6); min-height:100vh; }
  .wrap { max-width:1080px; margin-inline:auto; padding:40px 24px 80px; }
  header { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:22px; }
  h1 { margin:0; font-family:Georgia,serif; font-size:clamp(26px,3.4vw,38px); font-weight:600; }
  h1 em { font-style:italic; color:#a05f45; }
  .sub { margin:8px 0 0; color:var(--soft); font-size:14.5px; line-height:1.7; max-width:620px; }
  .meta { font-size:12px; color:var(--soft); border:1px solid var(--line); border-radius:999px; padding:7px 14px; white-space:nowrap; }
  .tabs { display:flex; gap:8px; flex-wrap:wrap; margin:24px 0 14px; }
  .tab { border:1px solid var(--line); background:rgba(255,253,246,.7); color:var(--soft); border-radius:999px;
         padding:9px 16px; font-size:12.5px; font-weight:600; cursor:pointer; transition:.2s; }
  .tab:hover { color:var(--gold); border-color:var(--gold); }
  .tab.is-active { background:linear-gradient(115deg,#e6cf9a,#c9a252 45%,#e8d29b 75%,#cda45a); color:#2a2418; border-color:rgba(169,124,51,.5); }
  .bar { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:14px; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; height:52px; padding-inline:26px;
         border:1px solid rgba(169,124,51,.5); border-radius:4px; cursor:pointer; font-size:14px; font-weight:700;
         background:linear-gradient(115deg,#e6cf9a,#c9a252 45%,#e8d29b 75%,#cda45a); color:#2a2418;
         box-shadow:0 6px 22px rgba(169,124,51,.24); transition:transform .22s, box-shadow .22s; }
  .btn:hover { transform:translateY(-2px); box-shadow:0 14px 30px rgba(169,124,51,.3); }
  .btn:active { transform:translateY(0) scale(.99); }
  .btn.secondary { background:rgba(255,253,246,.8); color:var(--ink); box-shadow:none; font-weight:600; font-size:13px; height:46px; padding-inline:20px; }
  .btn.secondary:hover { border-color:var(--gold); color:var(--gold); }
  .hint { font-size:12px; color:var(--soft); }
  pre { margin:0; max-height:60vh; overflow:auto; padding:18px 20px; border:1px solid var(--line); border-radius:8px;
        background:#241f16; color:#f4ead4; font:12.5px/1.65 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
        white-space:pre; tab-size:2; }
  .toast { position:fixed; left:50%; bottom:26px; transform:translate(-50%,20px); opacity:0; pointer-events:none;
           background:#2b2417; color:#fdf8ec; padding:13px 22px; border-radius:999px; font-size:13px; font-weight:600;
           box-shadow:0 18px 40px -18px rgba(0,0,0,.6); transition:.28s; z-index:50; }
  .toast.show { opacity:1; transform:translate(-50%,0); }
  .steps { margin-top:24px; padding:20px 22px; border:1px solid var(--line); border-radius:8px; background:rgba(255,253,246,.6); }
  .steps h2 { margin:0 0 10px; font-family:Georgia,serif; font-size:18px; }
  .steps ol { margin:0; padding-left:20px; color:var(--soft); font-size:13.5px; line-height:2; }
  code { background:rgba(169,124,51,.14); padding:2px 6px; border-radius:4px; font-size:12.5px; }
  @media(max-width:560px){ .wrap{padding:26px 16px 70px;} pre{font-size:11.5px;max-height:52vh;} .btn{width:100%;} }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <h1>Copy the <em>About Us</em> page</h1>
      <p class="sub">Poora page ek hi file mein — header, footer, saare sections aur poori CSS. Neeche button dabaiye, sab clipboard mein aa jayega.</p>
    </div>
    <span class="meta" id="meta"></span>
  </header>

  <div class="tabs" role="tablist">
    <button class="tab is-active" data-tab="full" role="tab" aria-selected="true">Full file (.tsx)</button>
    <button class="tab" data-tab="css" role="tab" aria-selected="false">CSS only</button>
    <button class="tab" data-tab="brand" role="tab" aria-selected="false">Contact config</button>
  </div>

  <div class="bar">
    <button class="btn" id="copy">📋 Copy everything</button>
    <button class="btn secondary" id="download">⬇ Download .tsx</button>
    <span class="hint" id="tabHint"></span>
  </div>

  <pre id="code" aria-label="Code to copy"></pre>

  <div class="steps">
    <h2>Paste karne ke baad 3 chhote edits</h2>
    <ol>
      <li><code>EDIT 1</code> — apni 3 photos ke path daalein.</li>
      <li><code>EDIT 2</code> — <code>BRAND</code> object mein phone, WhatsApp, years.</li>
      <li><code>EDIT 3</code> — <code>NAV</code> ke links apne routes se badlein.</li>
    </ol>
  </div>
</div>

<div class="toast" id="toast">Copied!</div>

<script>
  const CODE = { full: ${FULL}, css: ${CSS}, brand: ${BRAND} };
  const LABELS = {
    full: '1 file · ' + CODE.full.split('\\n').length + ' lines · ready to paste',
    css: CODE.css.split('\\n').length + ' lines of CSS',
    brand: 'Phone / WhatsApp / years config'
  };
  const pre = document.getElementById('code');
  const toast = document.getElementById('toast');
  const hint = document.getElementById('tabHint');
  let active = 'full';

  function show(tab) {
    active = tab;
    pre.textContent = CODE[tab];
    hint.textContent = LABELS[tab];
    document.querySelectorAll('.tab').forEach(function (t) {
      const on = t.dataset.tab === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
  }

  function flash(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(flash._t);
    flash._t = setTimeout(function () { toast.classList.remove('show'); }, 1900);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through to legacy path */ }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  document.getElementById('copy').addEventListener('click', async function (e) {
    const btn = e.currentTarget;
    const text = CODE[active];
    const ok = await copyText(text);
    btn.textContent = ok ? '✓ Copied!' : '✗ Copy failed';
    flash(ok ? 'Poora code copy ho gaya — paste kar dijiye!' : 'Copy nahi hua — neeche se manually select karein.');
    setTimeout(function () { btn.textContent = '📋 Copy everything'; }, 2000);
  });

  document.getElementById('download').addEventListener('click', function () {
    const blob = new Blob([CODE.full], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'AboutUsPage.tsx';
    a.click();
    URL.revokeObjectURL(a.href);
    flash('File download ho gayi!');
  });

  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { show(t.dataset.tab); });
  });

  document.getElementById('meta').textContent = 'Ready · ' + CODE.full.length.toLocaleString() + ' characters';
  show('full');
</script>
</body>
</html>`;

writeFileSync('public/copy-about.html', html);
console.log('written public/copy-about.html', html.length, 'chars');
console.log('source', source.length, '| css', css.length, '| brand', brand.length);
