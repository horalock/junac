function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function $(sel) {
  return document.querySelector(sel);
}

async function fetchJson(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
  return r.json();
}

async function fetchText(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
  return r.text();
}

function findTopic(data, topicId) {
  for (const level of data.levels || []) {
    const t = (level.topics || []).find((x) => x.id === topicId);
    if (t) return { topic: t, level };
  }
  return null;
}

function renderLinks(links) {
  const container = $("#topic-links-container");
  if (!container) return;

  container.innerHTML = "";
  if (!Array.isArray(links) || links.length === 0) {
    return; // ничего не показываем если ссылок нет
  }

  const h = document.createElement("h3");
  h.textContent = "Дополнительные материалы";
  container.appendChild(h);

  const ul = document.createElement("ul");
  links.forEach((ln) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = ln.title || ln.text || ln.href;
    a.href = ln.href || "#";
    if (ln.external) {
      a.target = "_blank";
      a.rel = ln.rel || "noopener noreferrer";
    }
    li.appendChild(a);

    if (ln.note) {
      const note = document.createElement("small");
      note.textContent = ln.note;
      li.appendChild(note);
    }

    ul.appendChild(li);
  });

  container.appendChild(ul);
}

export async function initTopic() {
  const topicId = getParam("id");
  const subject = getParam("subject") || "math";

  const backLink = $("#back-link");
  if (backLink) {
    backLink.href = `/pages/books/${subject}/books-${subject}.html`;
  }

  if (!topicId) {
    $("#topic-title").textContent = "Тема не указана";
    return;
  }

  const topicsPath = `/data/books/${subject}/topics.json`;
  let data;
  try {
    data = await fetchJson(topicsPath);
  } catch (err) {
    console.error(err);
    $("#topic-title").textContent = "Ошибка загрузки темы";
    $("#topic-body").textContent = err.message;
    return;
  }

  const found = findTopic(data, topicId);
  if (!found) {
    $("#topic-title").textContent = "Тема не найдена";
    return;
  }

  const { topic } = found;
  $("#topic-title").textContent = topic.title || "Без названия";

  // подгружаем контент, если указан
  if (topic.contentPath) {
    try {
      const html = await fetchText(topic.contentPath);

      // Создаём временный элемент, чтобы разобрать HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Находим все <code> с подсветкой и оборачиваем в <pre>
      tempDiv.querySelectorAll('code[class*="language-"]').forEach((block) => {
        if (block.tagName === "CODE") {
          const pre = document.createElement("pre");
          pre.className = "code-block";
          block.parentNode.insertBefore(pre, block);
          pre.appendChild(block);
        }
      });

      // Вставляем очищенный и обработанный HTML
      document.getElementById("topic-body").innerHTML = tempDiv.innerHTML;

      // Подсвечиваем синтаксис
      Prism.highlightAll();
    } catch (err) {
      console.error(err);
      document.getElementById("topic-body").textContent =
        "Ошибка загрузки контента";
    }
  }

  // подгружаем и отображаем ссылки
  renderLinks(topic.links);

  // обновляем title страницы
  document.title = (topic.title || "Тема") + " — Юнак";
}
