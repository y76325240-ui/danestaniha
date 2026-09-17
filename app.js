function totalFacts() {
  return Object.values(FACTS).reduce((sum, list) => sum + list.length, 0);
}

function renderHome() {
  const grid = document.getElementById("grid");
  grid.innerHTML = CATEGORIES.map((cat) => {
    const count = (FACTS[cat.id] || []).length;
    return `
      <button class="card" data-id="${cat.id}" style="border-color:${cat.color}33">
        <span class="emoji">${cat.emoji}</span>
        <h2>${cat.title}</h2>
        <span>${count} دانستنی</span>
      </button>
    `;
  }).join("");

  document.getElementById("fact-count").textContent = totalFacts();
  document.getElementById("cat-count").textContent = CATEGORIES.length;

  grid.querySelectorAll(".card").forEach((btn) => {
    btn.addEventListener("click", () => openCategory(btn.dataset.id));
  });
}

function openCategory(id, filteredFacts) {
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) return;
  const facts = filteredFacts || FACTS[id] || [];
  document.getElementById("panel-title").textContent = `${cat.emoji} ${cat.title}`;
  document.getElementById("facts").innerHTML = facts
    .map(
      (text, i) => `
        <article class="fact">
          <div class="num">${i + 1}</div>
          <p>${text}</p>
        </article>
      `
    )
    .join("");
  document.getElementById("overlay").classList.add("open");
  document.getElementById("panel").classList.add("open");
}

function closePanel() {
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("panel").classList.remove("open");
}

function randomFact() {
  const ids = Object.keys(FACTS);
  const id = ids[Math.floor(Math.random() * ids.length)];
  const list = FACTS[id];
  const fact = list[Math.floor(Math.random() * list.length)];
  const cat = CATEGORIES.find((c) => c.id === id);
  document.getElementById("panel-title").textContent = `🎲 دانستنی تصادفی · ${cat.emoji} ${cat.title}`;
  document.getElementById("facts").innerHTML = `
    <article class="fact">
      <div class="num">!</div>
      <p>${fact}</p>
    </article>
  `;
  document.getElementById("overlay").classList.add("open");
  document.getElementById("panel").classList.add("open");
}

function searchFacts(query) {
  const q = query.trim();
  if (!q) return;
  const results = [];
  CATEGORIES.forEach((cat) => {
    (FACTS[cat.id] || []).forEach((text) => {
      if (text.includes(q)) {
        results.push({ cat, text });
      }
    });
  });
  document.getElementById("panel-title").textContent = `نتایج جست‌وجو برای «${q}»`;
  document.getElementById("facts").innerHTML = results.length
    ? results
        .map(
          (item, i) => `
            <article class="fact">
              <div class="num">${i + 1}</div>
              <p><strong>${item.cat.emoji} ${item.cat.title}</strong><br>${item.text}</p>
            </article>
          `
        )
        .join("")
    : `<article class="fact"><div class="num">?</div><p>چیزی پیدا نشد. یک کلمه دیگر امتحان کن.</p></article>`;
  document.getElementById("overlay").classList.add("open");
  document.getElementById("panel").classList.add("open");
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  document.getElementById("overlay").addEventListener("click", closePanel);
  document.getElementById("close").addEventListener("click", closePanel);
  document.getElementById("random").addEventListener("click", randomFact);
  document.getElementById("search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchFacts(e.target.value);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });
});
