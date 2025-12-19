// ...existing code...
(function () {
  const $ = (s) => document.querySelector(s);

  function getParam(name) { return new URLSearchParams(location.search).get(name); }
  function getTestId() {
    const id = getParam('id');
    if (id) return id;
    const b = document.body && document.body.id ? document.body.id : '';
    return b ? (b.endsWith('-db') ? b.replace(/-db$/, '') : b) : null;
  }
  function getSubject() {
    const s = getParam('subject');
    if (s) return s;
    const m = location.pathname.match(/\/pages\/gyms\/([^\/]+)\//);
    return m ? m[1] : 'math';
  }

  async function fetchJson(path) {
    const r = await fetch(path, { cache: 'no-store' });
    if (!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
    return r.json();
  }

  function normalize(s = '') {
    return String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(',', '.');
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function flashBg(color, duration = 700) {
    const body = document.body;
    const prev = body.style.backgroundColor || '';
    body.style.backgroundColor = color;
    setTimeout(() => { body.style.backgroundColor = prev; }, duration);
  }

  function renderLinks(links) {
    const container = $('#additional-links');
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(links) || links.length === 0) {
      // ничего не показываем, можно оставить подсказку
      return;
    }
    const h = document.createElement('h3');
    h.textContent = 'Полезные ссылки';
    container.appendChild(h);
    const ul = document.createElement('ul');
    links.forEach((ln) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = ln.title || ln.text || ln.href;
      a.href = ln.href || '#';
      if (ln.external) a.target = '_blank';
      if (ln.rel) a.rel = ln.rel;
      li.appendChild(a);
      if (ln.note) {
        const note = document.createElement('small');
        note.style.marginLeft = '0.5rem';
        note.textContent = ln.note;
        li.appendChild(note);
      }
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  async function init() {
    const testId = getTestId();
    const subject = getSubject();

    const area = $('#test-area');
    const input = $('#intup-answer-field');
    const btn = $('#check-test-btn');
    const correctEl = $('#correct-answer');
    const wrongEl = $('#wrong-answer');

    if (!area || !input || !btn || !correctEl || !wrongEl) return;

    if (!testId) {
      area.textContent = 'Тренажёр не указан (параметр id).';
      btn.disabled = true;
      return;
    }

    const path = `/data/gyms/${subject}/tests/${testId}.json`;
    let data;
    try {
      data = await fetchJson(path);
    } catch (err) {
      console.error(err);
      area.textContent = 'Ошибка загрузки теста.';
      btn.disabled = true;
      return;
    }

    // подгрузить и показать ссылки (если есть)
    renderLinks(data.links);

    const raw = Array.isArray(data.questions) ? data.questions : [];
    const questions = raw.map(q => ({ q: q.q ?? q.question ?? '', a: q.a ?? q.answer ?? '' }))
                         .filter(x => x.q !== '');

    if (!questions.length) {
      area.textContent = 'В тесте нет вопросов.';
      btn.disabled = true;
      return;
    }

    let order = [];
    let pos = 0;
    let correct = 0;
    let wrong = 0;
    let finished = false;

    function reset() {
      order = questions.map((_, i) => i);
      shuffle(order);
      pos = 0;
      correct = 0;
      wrong = 0;
      finished = false;
      correctEl.textContent = '0';
      wrongEl.textContent = '0';
      btn.textContent = 'Проверить';
      input.disabled = false;
      render();
    }

    function render() {
      if (pos >= order.length) {
        area.textContent = 'Все задания выполнены! =)';
        btn.textContent = 'Ещё раз';
        input.value = '';
        input.disabled = true;
        finished = true;
        return;
      }
      const cur = questions[order[pos]].q;
      area.textContent = cur;
      input.value = '';
      input.focus();
    }

    function check() {
      if (finished) { reset(); return; }
      const cur = questions[order[pos]];
      if (!cur) return;
      const user = input.value;
      if (!String(user).trim()) return; // игнор пустого ответа
      const ok = normalize(cur.a) === normalize(user);
      if (ok) {
        correct++;
        correctEl.textContent = String(correct);
        flashBg('rgba(188,237,200,0.6)'); // тускло-зелёный
      } else {
        wrong++;
        wrongEl.textContent = String(wrong);
        flashBg('rgba(255,190,190,0.6)'); // тускло-красный
      }
      pos++;
      render();
    }

    btn.addEventListener('click', check);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });

    // запуск
    reset();
  }

  document.addEventListener('DOMContentLoaded', init);
})();