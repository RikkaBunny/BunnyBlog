const CATEGORY_THEME = {
  indie: "🍊 Indie Engine",
  年度: "🦊 年度总结",
  ue: "🐰 UE Technical",
  unity: "🐸 Unity Technical",
  houdini: "🦝 Houdini Technical",
  vex: "🌵 Houdini Notes",
  通用: "🌼 Common Technical",
  gpu: "🌸 GPU Notes",
  trick: "🔥 Trick Notes",
  show: "🎊 Show Notes"
};

const state = {
  all: [],
  filtered: [],
  activeCategory: "all",
  query: "",
  sortBy: "newest",
  mapBySlug: new Map(),
  index: null
};

const ui = {
  statArticles: document.querySelector("#stat-articles"),
  statCategories: document.querySelector("#stat-categories"),
  statUpdated: document.querySelector("#stat-updated"),
  categoryList: document.querySelector("#category-list"),
  searchInput: document.querySelector("#search-input"),
  sortSelect: document.querySelector("#sort-select"),
  resultTitle: document.querySelector("#result-title"),
  resultCount: document.querySelector("#result-count"),
  articleGrid: document.querySelector("#article-grid"),
  emptyState: document.querySelector("#empty-state"),
  reader: document.querySelector("#reader"),
  readerMeta: document.querySelector("#reader-meta"),
  readerTitle: document.querySelector("#reader-title"),
  readerBody: document.querySelector("#reader-body"),
  closeReader: document.querySelector("#close-reader")
};

function fmtDate(input) {
  if (!input) return "未知日期";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toISOString().slice(0, 10);
}

function cleanFrontmatter(md) {
  return md.replace(/^---[\s\S]*?---\n?/, "");
}

function parseHash() {
  const raw = decodeURIComponent(window.location.hash || "");
  const match = raw.match(/^#post=(.+)$/);
  return match ? match[1] : "";
}

function makePostKey(article) {
  return `${article.category_slug}/${article.filename}`;
}

function humanCategory(slug) {
  return CATEGORY_THEME[slug] || slug;
}

function updateStats() {
  ui.statArticles.textContent = String(state.all.length);
  ui.statCategories.textContent = String(Object.keys(state.index.category_map || {}).length);
  ui.statUpdated.textContent = fmtDate(state.index.generated_at);
}

function buildCategoryChips() {
  const categories = [
    { slug: "all", label: "✨ 全部" },
    ...Object.keys(CATEGORY_THEME)
      .filter((slug) => state.all.some((x) => x.category_slug === slug))
      .map((slug) => ({ slug, label: humanCategory(slug) }))
  ];

  ui.categoryList.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = `chip ${state.activeCategory === cat.slug ? "active" : ""}`;
    btn.textContent = cat.label;
    btn.type = "button";
    btn.addEventListener("click", () => {
      state.activeCategory = cat.slug;
      buildCategoryChips();
      filterAndRender();
    });
    ui.categoryList.appendChild(btn);
  });
}

function sortArticles(list) {
  const items = [...list];
  if (state.sortBy === "title") {
    return items.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  }
  if (state.sortBy === "oldest") {
    return items.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }
  return items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function filterAndRender() {
  const q = state.query.trim().toLowerCase();
  let list = [...state.all];

  if (state.activeCategory !== "all") {
    list = list.filter((a) => a.category_slug === state.activeCategory);
  }

  if (q) {
    list = list.filter((a) => {
      const source = `${a.title} ${a.description} ${a.filename}`.toLowerCase();
      return source.includes(q);
    });
  }

  state.filtered = sortArticles(list);

  ui.resultTitle.textContent = state.activeCategory === "all" ? "全部文章" : humanCategory(state.activeCategory);
  ui.resultCount.textContent = `${state.filtered.length} 篇`;
  renderCards();
}

function renderCards() {
  ui.articleGrid.innerHTML = "";

  if (!state.filtered.length) {
    ui.emptyState.classList.remove("hidden");
    return;
  }
  ui.emptyState.classList.add("hidden");

  state.filtered.forEach((article, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${Math.min(i * 0.02, 0.24)}s`;
    card.innerHTML = `
      <p class="card-meta">${humanCategory(article.category_slug)} · ${fmtDate(article.date)}</p>
      <p class="card-title">${article.title}</p>
      <p class="card-desc">${article.description || "暂无摘要"}</p>
    `;
    card.addEventListener("click", () => openArticle(article));
    ui.articleGrid.appendChild(card);
  });
}

function openReader() {
  ui.reader.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeReader() {
  ui.reader.classList.add("hidden");
  document.body.style.overflow = "";
  if (window.location.hash.startsWith("#post=")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

function normalizeArticleAssets(markdown, article) {
  return markdown.replace(/\]\((assets\/[^)]+)\)/g, (_m, rel) => `](posts/${article.category_slug}/${rel})`);
}

async function openArticle(article) {
  const key = makePostKey(article);
  const path = `posts/${article.category_slug}/${article.filename}`;
  const safePath = encodeURI(path);

  ui.readerMeta.textContent = `${humanCategory(article.category_slug)} · ${fmtDate(article.date)}`;
  ui.readerTitle.textContent = article.title;
  ui.readerBody.innerHTML = "<p>加载中...</p>";
  openReader();

  try {
    const res = await fetch(safePath);
    if (!res.ok) {
      throw new Error(`加载失败: ${res.status}`);
    }
    let markdown = await res.text();
    markdown = cleanFrontmatter(markdown);
    markdown = normalizeArticleAssets(markdown, article);

    const html = marked.parse(markdown, { breaks: true });
    ui.readerBody.innerHTML = DOMPurify.sanitize(html);
    history.replaceState(null, "", `#post=${encodeURIComponent(key)}`);
  } catch (err) {
    ui.readerBody.innerHTML = `<p>文章加载失败：${err.message}</p>`;
  }
}

async function init() {
  const res = await fetch("index.json");
  if (!res.ok) {
    throw new Error(`index.json 加载失败: ${res.status}`);
  }

  state.index = await res.json();
  state.all = (state.index.articles || []).map((x) => ({ ...x }));
  state.all.forEach((a) => state.mapBySlug.set(makePostKey(a), a));

  updateStats();
  buildCategoryChips();
  filterAndRender();

  const hashPost = parseHash();
  if (hashPost && state.mapBySlug.has(hashPost)) {
    openArticle(state.mapBySlug.get(hashPost));
  }
}

ui.searchInput.addEventListener("input", (e) => {
  state.query = e.target.value || "";
  filterAndRender();
});

ui.sortSelect.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  filterAndRender();
});

ui.closeReader.addEventListener("click", closeReader);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeReader();
});
window.addEventListener("hashchange", () => {
  const hashPost = parseHash();
  if (!hashPost) {
    closeReader();
    return;
  }
  const target = state.mapBySlug.get(hashPost);
  if (target) openArticle(target);
});

init().catch((err) => {
  ui.articleGrid.innerHTML = `<div class="empty-state">页面初始化失败：${err.message}</div>`;
});
