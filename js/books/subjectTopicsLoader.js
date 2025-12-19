let allTopicsData = null;

async function fetchJson(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки тем:', error);
    return null;
  }
}

function normalizeText(text) {
  return text.toLowerCase().trim();
}

function searchTopics(query) {
  if (!allTopicsData || !query.trim()) return [];

  const normalizedQuery = normalizeText(query);
  const results = [];

  for (const level of allTopicsData.levels || []) {
    for (const topic of level.topics || []) {
      const titleMatch = normalizeText(topic.title).includes(normalizedQuery);
      const captionMatch = normalizeText(topic.caption || '').includes(normalizedQuery);
      const gradeMatch = normalizeText(topic.grade || '').includes(normalizedQuery);

      if (titleMatch || captionMatch || gradeMatch) {
        results.push({ topic, level });
      }
    }
  }

  return results;
}

function createTopicElement(topic, subject) {
  const topicLink = document.createElement('a');
  topicLink.className = 'instruction-box';
  topicLink.href = `/pages/books/topic.html?id=${encodeURIComponent(topic.id)}&subject=${subject}`;

  const titleEl = document.createElement('h4');
  titleEl.className = 'instruction-box-title';
  titleEl.textContent = topic.title;
  topicLink.appendChild(titleEl);

  if (topic.caption && topic.caption.trim() !== '') {
    const captionEl = document.createElement('p');
    captionEl.className = 'instruction-box-caption';
    captionEl.textContent = topic.caption;
    topicLink.appendChild(captionEl);
  }

  const gradeEl = document.createElement('h4');
  const grades = Array.isArray(topic.grades) ? topic.grades : [topic.grade];
  gradeEl.textContent = grades.join(', ');
  topicLink.appendChild(gradeEl);

  return topicLink;
}

export function renderTopics(data, containerSelector, subject) {
  const container = document.querySelector(containerSelector);
  if (!container || !data) {
    console.error('Контейнер или данные не найдены');
    return;
  }

  container.innerHTML = '';
  allTopicsData = data;

  data.levels.forEach((level) => {
    const levelTitle = document.createElement('h2');
    levelTitle.textContent = level.title;
    levelTitle.className = 'level-title';
    container.appendChild(levelTitle);

    level.topics.forEach((topic) => {
      const topicElement = createTopicElement(topic, subject);
      container.appendChild(topicElement);
    });
  });
}

export function renderSearchResults(results, containerSelector, subject) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = '';

  if (results.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'search-empty';
    emptyMsg.textContent = 'Темы не найдены';
    container.appendChild(emptyMsg);
    return;
  }

  const header = document.createElement('h3');
  header.className = 'search-header';
  header.textContent = `Найдено: ${results.length}`;
  container.appendChild(header);

  results.forEach(({ topic }) => {
    const topicElement = createTopicElement(topic, subject);
    container.appendChild(topicElement);
  });
}

export async function initSubjectTopics(containerSelector, subject = 'math') {
  const topicsPath = `/data/books/${subject}/topics.json`;
  const data = await fetchJson(topicsPath);
  
  if (!data) {
    console.error(`Не удалось загрузить темы для ${subject}`);
    return;
  }

  renderTopics(data, containerSelector, subject);

  // Поиск
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');

  if (!searchInput) return;

  // Обработчик ввода
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;

    if (!query.trim()) {
      // Если поле пусто — показывай оригинальный список
      renderTopics(data, containerSelector, subject);
      clearBtn.style.display = 'none';
    } else {
      // Если есть запрос — показывай результаты
      clearBtn.style.display = 'inline-block';
      const results = searchTopics(query);
      renderSearchResults(results, containerSelector, subject);
    }
  });

  // Кнопка очистки
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      renderTopics(data, containerSelector, subject);
      clearBtn.style.display = 'none';
      searchInput.focus();
    });
  }
}