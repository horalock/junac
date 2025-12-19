// Загрузчик контента для gym-topic.html

function q(selector) { return document.querySelector(selector); }
function getParam(name) { return new URLSearchParams(location.search).get(name); }

async function fetchJson(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
  return r.json();
}

async function fetchText(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
  return r.text();
}

function findTopic(topicsData, id) {
  for (const level of topicsData.levels || []) {
    const t = (level.topics || []).find(x => x.id === id);
    if (t) return { topic: t, level };
  }
  return null;
}

export async function initGym() {
  const id = getParam('id');
  const subject = getParam('subject') || 'math';
  const backLink = q('#back-link');
  if (backLink) backLink.href = `/pages/gyms/${subject}/gym-${subject}.html`;

  if (!id) {
    q('#gym-title').textContent = 'Тренажёр не указан';
    return;
  }

  const topicsPath = `/data/gyms/${subject}/topics.json`;
  let data;
  try {
    data = await fetchJson(topicsPath);
  } catch (err) {
    q('#gym-title').textContent = 'Ошибка загрузки списка тренажёров';
    q('#gym-content').textContent = err.message;
    console.error(err);
    return;
  }

  const found = findTopic(data, id);
  if (!found) {
    q('#gym-title').textContent = 'Тренажёр не найден';
    return;
  }

  const { topic, level } = found;
  q('#gym-title').textContent = topic.title || 'Тренажёр';
  q('#gym-meta').textContent = `${level.title || ''} ${topic.grade || ''}`.trim();

  if (!topic.contentPath) {
    q('#gym-content').textContent = 'Контент отсутствует';
    return;
  }

  try {
    const html = await fetchText(topic.contentPath);
    // Вставляем как HTML — контент локальный, если сторонний — санитайзируй
    q('#gym-content').innerHTML = html;
    // показать общие контролы, если нужны
    const controls = q('#gym-controls');
    if (controls) controls.style.display = 'block';
  } catch (err) {
    q('#gym-content').textContent = `Ошибка загрузки контента: ${err.message}`;
    console.error(err);
  }
}