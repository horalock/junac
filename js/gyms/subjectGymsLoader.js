let gymsDataCache = null;

async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path} — ${res.status}`);
  return res.json();
}

function normalizeText(s = '') {
  return String(s).toLowerCase().trim();
}

function createGymElement(topic, subject) {
  const a = document.createElement('a');
  a.className = 'instruction-box';
  // ссылка на шаблонную страницу для тренажёров (можно создать pages/gyms/gym-topic.html)
  a.href = `/pages/gyms/gym-topic.html?id=${encodeURIComponent(topic.id)}&subject=${subject}`;

  const title = document.createElement('h4');
  title.className = 'instruction-box-title';
  title.textContent = topic.title;
  a.appendChild(title);

  if (topic.caption) {
    const p = document.createElement('p');
    p.className = 'instruction-box-caption';
    p.textContent = topic.caption;
    a.appendChild(p);
  }

  const grade = document.createElement('h4');
  grade.className = 'instruction-box-grade';
  const grades = Array.isArray(topic.grades) ? topic.grades : [topic.grade];
  grade.textContent = grades.filter(Boolean).join(', ');
  a.appendChild(grade);

  return a;
}

export function renderGyms(data, containerSelector, subject) {
  const container = document.querySelector(containerSelector);
  if (!container || !data) return;
  container.innerHTML = '';
  gymsDataCache = data;

  data.levels.forEach(level => {
    const h2 = document.createElement('h2');
    h2.textContent = level.title;
    h2.id = level.id;
    container.appendChild(h2);

    (level.topics || []).forEach(topic => {
      const el = createGymElement(topic, subject);
      container.appendChild(el);
    });
  });
}

function searchGyms(query) {
  if (!gymsDataCache) return [];
  const q = normalizeText(query);
  if (!q) return [];

  const out = [];
  for (const level of gymsDataCache.levels || []) {
    for (const topic of level.topics || []) {
      if (
        normalizeText(topic.title).includes(q) ||
        normalizeText(topic.caption).includes(q) ||
        normalizeText(topic.grade).includes(q)
      ) {
        out.push({ topic, level });
      }
    }
  }
  return out;
}

export function renderSearchResults(results, containerSelector, subject) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';

  if (results.length === 0) {
    const p = document.createElement('p');
    p.className = 'search-empty';
    p.textContent = 'Тренажёры не найдены';
    container.appendChild(p);
    return;
  }

  const header = document.createElement('h3');
  header.className = 'search-header';
  header.textContent = `Найдено: ${results.length}`;
  container.appendChild(header);

  results.forEach(({ topic }) => {
    container.appendChild(createGymElement(topic, subject));
  });
}

export async function initSubjectGyms(containerSelector, subject = 'math') {
  const path = `/data/gyms/${subject}/topics.json`;
  let data;
  try {
    data = await fetchJson(path);
  } catch (err) {
    console.error(err);
    const container = document.querySelector(containerSelector);
    if (container) container.innerHTML = `<p class="error">Не удалось загрузить темы: ${err.message}</p>`;
    return;
  }

  renderGyms(data, containerSelector, subject);

  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');
  const container = document.querySelector(containerSelector);

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    if (!q.trim()) {
      renderGyms(data, containerSelector, subject);
      if (clearBtn) clearBtn.style.display = 'none';
    } else {
      if (clearBtn) clearBtn.style.display = 'inline-block';
      const results = searchGyms(q);
      renderSearchResults(results, containerSelector, subject);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      renderGyms(data, containerSelector, subject);
      clearBtn.style.display = 'none';
      searchInput.focus();
    });
    clearBtn.style.display = 'none';
  }
}