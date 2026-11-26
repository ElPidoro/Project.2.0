const STORAGE_KEY = "nextlab_habit_balance_mvp_v1";

const SPHERES = [
  { key: "Навчання", label: "Навчання" },
  { key: "Спорт", label: "Спорт" },
  { key: "Сон", label: "Сон" },
  { key: "Відпочинок", label: "Відпочинок" },
  { key: "Здоров'я", label: "Здоров'я" },
  { key: "Особисте", label: "Особисті проєкти" }
];

const RANKS = [
  "Новачок дисципліни",
  "Шукач ритму",
  "Практик балансу",
  "Майстер серій",
  "Стратег режиму",
  "Архітектор звичок",
  "Хранитель фокусу",
  "Володар енергії",
  "Грандмайстер балансу",
  "Легенда продуктивності"
];

const THEME_LABELS = {
  emerald: "Смарагд",
  ocean: "Океан",
  amber: "Бурштин",
  violet: "Аметист",
  rose: "Малина",
  teal: "Бірюза",
  crimson: "Рубін",
  indigo: "Індиго",
  coral: "Корал"
};

const DAILY_QUOTES = [
  "Маленькі щоденні кроки формують великі результати.",
  "Дисципліна — це вибір між тим, чого хочеш зараз, і тим, чого прагнеш найбільше.",
  "Не переривай ланцюжок двічі поспіль — навіть мінімальний крок рахується.",
  "Баланс не означає робити все одразу; він означає вчасно відновлювати сили.",
  "Фокус на одній справі 25 хвилин дає більше, ніж 2 години перемикань.",
  "Твоя енергія — головний ресурс: бережи сон і короткі прогулянки."
];

let currentQuoteIdx = 0;
let activeJournalTags = new Set();

const DEFAULT_JOURNAL_TAGS = ["#продуктивність", "#спорт", "#спокій", "#енергія", "#ідея"];

const HABIT_TEMPLATES = [
  { title: "Читання книги 20 хв", category: "Навчання", weeklyGoal: 6 },
  { title: "Склянка води одразу після пробудження", category: "Здоров'я", weeklyGoal: 7 },
  { title: "Розтяжка спини та шиї 10 хв", category: "Спорт", weeklyGoal: 5 },
  { title: "Цифровий детокс за 1 год до сну", category: "Сон", weeklyGoal: 6 },
  { title: "День без доданого цукру", category: "Здоров'я", weeklyGoal: 5 },
  { title: "Вечірнє планування завтрашнього дня", category: "Відпочинок", weeklyGoal: 6 }
];

function getTodayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function createDefaultState() {
  const today = getTodayISO(0);
  const history = {};
  const energyLog = {};
  const focusLog = {};
  const waterLog = {};

  for (let i = 21; i >= 1; i--) {
    const dateKey = getTodayISO(-i);
    const doneIds = [];
    if (i % 2 === 0 || i % 3 === 0) doneIds.push("h1");
    if (i % 2 !== 0) doneIds.push("h2");
    if (i % 4 !== 0) doneIds.push("h3");
    if (i % 3 === 0) doneIds.push("h4");
    history[dateKey] = doneIds;
    energyLog[dateKey] = (i % 3) + 3;
    focusLog[dateKey] = i % 2 === 0 ? 1 : 0;
    waterLog[dateKey] = 4 + (i % 5);
  }
  history[today] = ["h1"];
  energyLog[today] = 4;
  focusLog[today] = 1;
  waterLog[today] = 3;

  return {
    theme: "emerald",
    activeDate: today,
    selectedCategory: "Усі",
    searchQuery: "",
    sortBy: "default",
    heatmapDays: 90,
    heatmapCategory: "Усі",
    selectedInspectDate: today,
    habits: [
      { id: "h1", title: "Ранкова розминка та турнік (20 хв)", category: "Спорт", weeklyGoal: 5, archived: false },
      { id: "h2", title: "Підготовка до предметів / код без відволікань", category: "Навчання", weeklyGoal: 6, archived: false },
      { id: "h3", title: "Лягти спати до 23:30 без телефону", category: "Сон", weeklyGoal: 7, archived: false },
      { id: "h4", title: "Прогулянка або відпочинок для очей 30 хв", category: "Відпочинок", weeklyGoal: 5, archived: false }
    ],
    history,
    energyLog,
    focusLog,
    waterLog,
    dailyTasks: {
      [today]: [
        { id: "dt1", title: "Закрити головну задачу дня до 18:00", done: false },
        { id: "dt2", title: "Підготувати план на завтра (5 хв)", done: false }
      ]
    },
    journalTags: [...DEFAULT_JOURNAL_TAGS],
    journalNotes: [
      {
        id: "jn_1",
        date: today,
        time: "09:15",
        text: "Вдалий старт дня! Зробив розминку та тримаю фокус на головному.",
        tags: ["#продуктивність", "#спорт"]
      },
      {
        id: "jn_2",
        date: getTodayISO(-1),
        time: "21:30",
        text: "Коротка прогулянка ввечері дуже допомогла перезавантажити голову після роботи.",
        tags: ["#спокій", "#енергія"]
      },
      {
        id: "jn_3",
        date: getTodayISO(-3),
        time: "14:20",
        text: "Ідея: ставити 25-хвилинний фокус-таймер перед початком складних задач.",
        tags: ["#ідея", "#продуктивність"]
      }
    ],
    balance: {
      "Навчання": 8,
      "Спорт": 7,
      "Сон": 6,
      "Відпочинок": 4,
      "Здоров'я": 7,
      "Особисте": 8
    },
    profile: {
      nickname: "Даниїїл",
      username: "@danyiil"
    },
    favoriteHabits: ["h1", "h2"],
    friends: [
      { id: "f1", nickname: "Максим", username: "@max_run", streak: 14, rank: "Майстер серій" },
      { id: "f2", nickname: "Аліна", username: "@alina_zen", streak: 9, rank: "Практик балансу" },
      { id: "f3", nickname: "Дмитро", username: "@dima_code", streak: 21, rank: "Архітектор звичок" }
    ],
    snapshots: [
      {
        label: "Попередній тиждень",
        values: {
          "Навчання": 7,
          "Спорт": 6,
          "Сон": 5,
          "Відпочинок": 5,
          "Здоров'я": 6,
          "Особисте": 7
        }
      }
    ],
    selectedSnapshotIdx: 0
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.habits) || typeof parsed.history !== "object") {
      return createDefaultState();
    }
    const def = createDefaultState();
    let migratedNotes = Array.isArray(parsed.journalNotes) ? parsed.journalNotes : null;
    if (!migratedNotes) {
      migratedNotes = [];
      if (parsed.journal && typeof parsed.journal === "object") {
        Object.entries(parsed.journal).forEach(([dateKey, entry], idx) => {
          if (entry && (entry.text?.trim() || (entry.tags && entry.tags.length))) {
            migratedNotes.push({
              id: `jn_mig_${idx}_${dateKey}`,
              date: dateKey,
              time: "12:00",
              text: entry.text || "",
              tags: Array.isArray(entry.tags) ? entry.tags : []
            });
          }
        });
      }
      if (!migratedNotes.length) migratedNotes = def.journalNotes;
    }

    return {
      ...def,
      ...parsed,
      energyLog: parsed.energyLog || def.energyLog,
      focusLog: parsed.focusLog || def.focusLog,
      waterLog: parsed.waterLog && typeof parsed.waterLog === "object" ? parsed.waterLog : def.waterLog,
      dailyTasks: parsed.dailyTasks && typeof parsed.dailyTasks === "object" ? parsed.dailyTasks : def.dailyTasks,
      journalTags: Array.isArray(parsed.journalTags) && parsed.journalTags.length ? parsed.journalTags : def.journalTags,
      journalNotes: migratedNotes,
      profile: parsed.profile && typeof parsed.profile === "object"
        ? (parsed.profile.nickname === "Олександр" ? def.profile : parsed.profile)
        : def.profile,
      favoriteHabits: Array.isArray(parsed.favoriteHabits) ? parsed.favoriteHabits : def.favoriteHabits,
      friends: Array.isArray(parsed.friends) ? parsed.friends : def.friends,
      snapshots: Array.isArray(parsed.snapshots) && parsed.snapshots.length ? parsed.snapshots : def.snapshots
    };
  } catch (e) {
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Помилка запису в localStorage:", e);
  }
}

let state = loadState();
let animatedBalance = { ...state.balance };
let animFrameId = null;

// Одноразова анімація прогрес-бара при відкритті сторінки
const mainProgressBar = document.getElementById("today-progress-bar");
mainProgressBar.addEventListener("animationend", () => {
  mainProgressBar.classList.remove("sweep-once");
}, { once: true });

function applyTheme(themeName) {
  state.theme = themeName;
  document.documentElement.setAttribute("data-theme", themeName);
  document.querySelectorAll(".theme-dot").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.setTheme === themeName);
  });
  const themePill = document.getElementById("footer-theme-pill");
  if (themePill) {
    themePill.textContent = `Тема: ${THEME_LABELS[themeName] || themeName}`;
  }
  saveState();
  drawBalanceCanvas(animatedBalance);
}

function updateNavIndicator() {
  const activeBtn = document.querySelector(".nav-btn.active");
  const indicator = document.getElementById("nav-indicator");
  if (!activeBtn || !indicator) return;
  indicator.style.width = `${activeBtn.offsetWidth}px`;
  indicator.style.height = `${activeBtn.offsetHeight}px`;
  indicator.style.top = `${activeBtn.offsetTop}px`;
  indicator.style.left = "0px";
  indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

function spawnConfettiBurst(originEl, count = 14) {
  if (!originEl) return;
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--lv-4").trim() || "#39d353";
  const colors = [accent, "#58a6ff", "#e3b341", "#ff7eb6", "#ffffff"];

  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "burst-particle";
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const dist = 28 + Math.random() * 44;
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    p.style.background = colors[i % colors.length];
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove(), { once: true });
  }
}

function syncRealCalendarDate() {
  const realToday = getTodayISO(0);
  if (state.activeDate !== realToday) {
    state.activeDate = realToday;
    if (!Array.isArray(state.history[realToday])) state.history[realToday] = [];
    state.selectedInspectDate = realToday;
    saveState();
  }
}

function calculateStreak(habitId) {
  let streak = 0;
  let offset = 0;
  const todayList = state.history[state.activeDate] || [];
  if (!todayList.includes(habitId)) offset = -1;

  while (offset > -365) {
    const d = new Date(state.activeDate);
    d.setDate(d.getDate() + offset);
    const key = d.toISOString().slice(0, 10);
    if ((state.history[key] || []).includes(habitId)) {
      streak++;
      offset--;
    } else {
      break;
    }
  }
  return streak;
}

function getWeeklyProgress(habitId) {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(state.activeDate);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if ((state.history[key] || []).includes(habitId)) count++;
  }
  return count;
}

function getWeakestSphere() {
  let minSphere = SPHERES[0];
  let minVal = state.balance[minSphere.key] ?? 10;
  for (const s of SPHERES) {
    const val = state.balance[s.key] ?? 5;
    if (val < minVal) {
      minVal = val;
      minSphere = s;
    }
  }
  return { sphere: minSphere, value: minVal };
}

function getHarmonyPercent() {
  const vals = SPHERES.map(s => state.balance[s.key] ?? 5);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const spread = Math.max(...vals) - Math.min(...vals);
  const score = Math.max(0, Math.round((avg / 10) * 100 - spread * 4));
  return Math.min(100, score);
}

// --- FOCUS TIMER ---
let focusDurationSec = 25 * 60;
let focusRemainingSec = focusDurationSec;
let focusInterval = null;
let focusAudioCtx = null;

function ensureFocusAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!focusAudioCtx) {
    focusAudioCtx = new AudioCtx();
  }
  if (focusAudioCtx.state === "suspended") {
    focusAudioCtx.resume().catch(() => {});
  }
  return focusAudioCtx;
}

function playToneSequence(notes, options = {}) {
  const {
    type = "sine",
    volume = 0.1,
    stepSec = 0.14,
    durationSec = 0.45
  } = options;

  try {
    const ctx = ensureFocusAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * stepSec;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + durationSec + 0.02);
    });
  } catch (e) {
    // Ignore audio errors if blocked by browser policy
  }
}

function playFocusCompleteSound() {
  playToneSequence([523.25, 659.25, 783.99], {
    type: "sine",
    volume: 0.12,
    stepSec: 0.16,
    durationSec: 0.55
  });
}

function playAllCompleteSound() {
  playToneSequence([523.25, 659.25, 783.99, 1046.5], {
    type: "triangle",
    volume: 0.11,
    stepSec: 0.09,
    durationSec: 0.45
  });
}

function playCheckSound() {
  playToneSequence([660, 880], {
    type: "sine",
    volume: 0.06,
    stepSec: 0.055,
    durationSec: 0.14
  });
}

function playWaterSound() {
  playToneSequence([440, 587.33], {
    type: "sine",
    volume: 0.06,
    stepSec: 0.06,
    durationSec: 0.18
  });
}

function playSyncSound() {
  playToneSequence([587.33, 880], {
    type: "triangle",
    volume: 0.07,
    stepSec: 0.08,
    durationSec: 0.22
  });
}

function renderFocusTimer() {
  const mins = String(Math.floor(focusRemainingSec / 60)).padStart(2, "0");
  const secs = String(focusRemainingSec % 60).padStart(2, "0");
  document.getElementById("focus-timer-display").textContent = `${mins}:${secs}`;
  const todaySessions = state.focusLog[state.activeDate] || 0;
  document.getElementById("focus-sessions-badge").textContent = `Сесій: ${todaySessions}`;
  document.getElementById("focus-start-btn").textContent = focusInterval ? "Пауза" : "Старт";
}

document.querySelectorAll(".focus-presets .pill").forEach(pill => {
  pill.addEventListener("click", () => {
    if (focusInterval) return;
    document.querySelectorAll(".focus-presets .pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    focusDurationSec = Number(pill.dataset.mins) * 60;
    focusRemainingSec = focusDurationSec;
    renderFocusTimer();
  });
});

document.getElementById("focus-start-btn").addEventListener("click", () => {
  if (focusInterval) {
    clearInterval(focusInterval);
    focusInterval = null;
    renderFocusTimer();
    return;
  }
  ensureFocusAudioContext();
  focusInterval = setInterval(() => {
    focusRemainingSec--;
    if (focusRemainingSec <= 0) {
      clearInterval(focusInterval);
      focusInterval = null;
      focusRemainingSec = focusDurationSec;
      state.focusLog[state.activeDate] = (state.focusLog[state.activeDate] || 0) + 1;
      saveState();
      playFocusCompleteSound();
      renderAll();
    }
    renderFocusTimer();
  }, 1000);
  renderFocusTimer();
});

document.getElementById("focus-reset-btn").addEventListener("click", () => {
  clearInterval(focusInterval);
  focusInterval = null;
  focusRemainingSec = focusDurationSec;
  renderFocusTimer();
});

// --- RENDER TODAY ---
function renderToday() {
  const activeHabits = state.habits.filter(h => !h.archived);
  const doneToday = state.history[state.activeDate] || [];
  const completedCount = activeHabits.filter(h => doneToday.includes(h.id)).length;
  const remainingCount = Math.max(0, activeHabits.length - completedCount);
  const percent = activeHabits.length ? Math.round((completedCount / activeHabits.length) * 100) : 0;

  document.getElementById("current-date-label").textContent = `Активна дата: ${state.activeDate}`;
  document.getElementById("today-percent-badge").textContent = `${percent}%`;
  document.getElementById("today-progress-bar").style.width = `${percent}%`;
  document.getElementById("today-summary-text").textContent =
    `Виконано ${completedCount} із ${activeHabits.length} активних звичок`;

  document.getElementById("nav-badge-today").textContent = remainingCount;

  const values = SPHERES.map(s => state.balance[s.key] || 0);
  const avg = (values.reduce((a, b) => a + b, 0) / SPHERES.length).toFixed(1);
  const weakest = getWeakestSphere();
  document.getElementById("balance-avg-badge").textContent = `${avg} / 10`;
  document.getElementById("weakest-sphere-hint").textContent =
    `Найбільше просідає: ${weakest.sphere.label} (${weakest.value}/10)`;

  const currentEnergy = state.energyLog[state.activeDate] || 0;
  const energyLabels = {
    1: "Низький заряд — варто дати собі більше відпочинку",
    2: "Трохи втомлений стан — обери 1–2 головні звички",
    3: "Стабільний робочий ритм",
    4: "Гарний тонус і концентрація",
    5: "Максимум енергії — чудовий день для складних цілей"
  };
  document.getElementById("energy-status-text").textContent =
    currentEnergy ? energyLabels[currentEnergy] : "Оціни свій стан для щоденного журналу";
  document.querySelectorAll(".energy-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.energy) === currentEnergy);
  });

  renderFocusTimer();

  const listEl = document.getElementById("today-habit-list");
  listEl.innerHTML = "";

  let filtered = activeHabits.filter(h => {
    const matchCat = state.selectedCategory === "Усі" || h.category === state.selectedCategory;
    const matchSearch = h.title.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (state.sortBy === "undone") {
    filtered = [...filtered].sort((a, b) => Number(doneToday.includes(a.id)) - Number(doneToday.includes(b.id)));
  } else if (state.sortBy === "streak") {
    filtered = [...filtered].sort((a, b) => calculateStreak(b.id) - calculateStreak(a.id));
  }

  if (!filtered.length) {
    listEl.innerHTML = `<li class="muted-text">За цим фільтром звичок не знайдено.</li>`;
  } else {
    filtered.forEach((habit, index) => {
      const isDone = doneToday.includes(habit.id);
      const streak = calculateStreak(habit.id);
      const weekCount = getWeeklyProgress(habit.id);
      const goal = habit.weeklyGoal || 5;
      const goalMet = weekCount >= goal;

      const li = document.createElement("li");
      li.className = `habit-item ${isDone ? "done" : ""}`;
      li.style.animationDelay = `${index * 35}ms`;
      li.innerHTML = `
        <label class="habit-left">
          <input type="checkbox" class="habit-checkbox" ${isDone ? "checked" : ""} />
          <span class="habit-title">${escapeHtml(habit.title)}</span>
        </label>
        <div class="habit-meta">
          <span class="goal-tag ${goalMet ? "met" : ""}" title="Прогрес за останні 7 днів">Ціль: ${weekCount}/${goal}</span>
          <span class="cat-tag">${escapeHtml(habit.category)}</span>
          <span class="streak-badge" title="Поточна серія днів">🔥 ${streak} дн.</span>
        </div>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", () => toggleHabitToday(habit.id, checkbox));
      listEl.appendChild(li);
    });
  }

  renderDailyTasks();
  renderWaterTracker();
  renderWeekRhythm();
}

function renderDailyTasks() {
  const listEl = document.getElementById("daily-task-list");
  const badgeEl = document.getElementById("daily-tasks-badge");
  if (!listEl || !badgeEl) return;

  const tasks = state.dailyTasks[state.activeDate] || [];
  const doneCount = tasks.filter(t => t.done).length;
  badgeEl.textContent = `${doneCount} / ${tasks.length}`;

  if (!tasks.length) {
    listEl.innerHTML = `<li class="muted-text">Поки що задач немає — додай 1–3 головні справи на сьогодні.</li>`;
    return;
  }

  listEl.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `daily-task-item ${task.done ? "done" : ""}`;
    li.innerHTML = `
      <label class="daily-task-left">
        <input type="checkbox" class="habit-checkbox" ${task.done ? "checked" : ""} />
        <span class="daily-task-title">${escapeHtml(task.title)}</span>
      </label>
      <button type="button" class="daily-task-del" title="Видалити задачу">×</button>
    `;

    const checkbox = li.querySelector("input");
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveState();
      if (task.done) {
        const allTasksDone = tasks.length > 0 && tasks.every(t => t.done);
        spawnConfettiBurst(checkbox, allTasksDone ? 22 : 10);
        if (allTasksDone) playAllCompleteSound();
        else playCheckSound();
      }
      renderDailyTasks();
    });

    li.querySelector(".daily-task-del").addEventListener("click", () => {
      state.dailyTasks[state.activeDate] = tasks.filter(t => t.id !== task.id);
      saveState();
      renderDailyTasks();
    });

    listEl.appendChild(li);
  });
}

function renderWaterTracker() {
  const container = document.getElementById("water-glasses");
  const badgeEl = document.getElementById("water-badge");
  const statusEl = document.getElementById("water-status-text");
  if (!container || !badgeEl || !statusEl) return;

  const goal = 8;
  const count = Math.max(0, Math.min(goal, Number(state.waterLog[state.activeDate]) || 0));
  const liters = (count * 0.25).toFixed(2).replace(/\.00$/, ".0");

  badgeEl.textContent = `${count} / ${goal} 💧`;
  statusEl.textContent = count >= goal
    ? `Норму виконано: ${liters} л із 2.0 л!`
    : `Випито ${liters} з 2.0 л (ціль: ${goal} склянок)`;

  container.innerHTML = "";
  for (let i = 1; i <= goal; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `water-glass-btn ${i <= count ? "filled" : ""}`;
    btn.title = `${i} склянка (${(i * 0.25).toFixed(2)} л)`;
    btn.textContent = "💧";
    btn.addEventListener("click", () => {
      const next = count === i ? i - 1 : i;
      setWaterCount(next, btn);
    });
    container.appendChild(btn);
  }
}

function setWaterCount(nextCount, originEl) {
  const prev = Number(state.waterLog[state.activeDate]) || 0;
  const clamped = Math.max(0, Math.min(8, nextCount));
  state.waterLog[state.activeDate] = clamped;
  saveState();
  if (clamped === 8 && prev < 8) {
    if (originEl) spawnConfettiBurst(originEl, 18);
    playAllCompleteSound();
  } else if (clamped > prev) {
    playWaterSound();
  }
  renderWaterTracker();
  renderWeekRhythm();
}

function renderWeekRhythm() {
  const stripEl = document.getElementById("week-rhythm-strip");
  const avgBadge = document.getElementById("week-rhythm-avg-badge");
  if (!stripEl || !avgBadge) return;

  const activeHabits = state.habits.filter(h => !h.archived);
  const dayNames = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const energyIcons = { 1: "😫", 2: "😕", 3: "😐", 4: "🙂", 5: "⚡" };
  let sumPct = 0;

  stripEl.innerHTML = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date(state.activeDate);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const done = (state.history[key] || []).filter(id => activeHabits.some(h => h.id === id)).length;
    const pct = activeHabits.length ? Math.round((done / activeHabits.length) * 100) : 0;
    sumPct += pct;

    const energy = state.energyLog[key];
    const water = state.waterLog[key] || 0;
    const isToday = key === state.activeDate;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `rhythm-day-card ${isToday ? "is-today" : ""}`;
    btn.innerHTML = `
      <div class="rhythm-day-top">
        <span>${isToday ? "Сьогодні" : dayNames[d.getDay()]}</span>
        <span>${key.slice(8)}.${key.slice(5, 7)}</span>
      </div>
      <div class="rhythm-day-pct">${pct}%</div>
      <div class="rhythm-mini-bar">
        <div class="rhythm-mini-fill" style="width: ${pct}%"></div>
      </div>
      <div class="rhythm-day-meta">
        <span>${energy ? energyIcons[energy] : "—"}</span>
        <span>💧${water}</span>
      </div>
    `;

    btn.addEventListener("click", () => {
      state.selectedInspectDate = key;
      document.querySelector('.nav-btn[data-tab="heatmap"]')?.click();
      renderHeatmap();
    });

    stripEl.appendChild(btn);
  }

  avgBadge.textContent = `Середнє: ${Math.round(sumPct / 7)}%`;
}

function toggleHabitToday(habitId, originEl) {
  const list = state.history[state.activeDate] || [];
  const idx = list.indexOf(habitId);
  const wasChecked = idx >= 0;
  if (wasChecked) list.splice(idx, 1);
  else list.push(habitId);
  state.history[state.activeDate] = list;
  saveState();
  if (!wasChecked) {
    const activeHabits = state.habits.filter(h => !h.archived);
    const doneActiveCount = activeHabits.filter(h => list.includes(h.id)).length;
    const allDone = activeHabits.length > 0 && doneActiveCount >= activeHabits.length;
    spawnConfettiBurst(originEl, allDone ? 24 : 12);
    if (allDone) playAllCompleteSound();
    else playCheckSound();
  }
  renderAll();
}

// --- RENDER HEATMAP ---
const HEATMAP_MONTH_NAMES = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

function renderHeatmap() {
  const grid = document.getElementById("heatmap-grid");
  grid.innerHTML = "";

  document.querySelectorAll(".period-switch .pill").forEach(p => {
    p.classList.toggle("active", Number(p.dataset.days) === state.heatmapDays);
  });

  const relevantHabits = state.habits.filter(h => {
    if (h.archived) return false;
    return state.heatmapCategory === "Усі" || h.category === state.heatmapCategory;
  });
  const relevantIds = new Set(relevantHabits.map(h => h.id));
  const totalHabits = Math.max(relevantHabits.length, 1);
  const days = state.heatmapDays;

  let bestStreak = 0;
  let tempStreak = 0;
  let totalRatioSum = 0;

  const weekdaySums = [0, 0, 0, 0, 0, 0, 0];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

  const monthGroups = new Map();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(state.activeDate);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const rawDone = state.history[dateKey] || [];
    const doneIds = state.heatmapCategory === "Усі"
      ? rawDone
      : rawDone.filter(id => relevantIds.has(id));

    const ratio = Math.min(doneIds.length / totalHabits, 1);
    totalRatioSum += ratio;

    const jsDay = d.getDay();
    const monIdx = jsDay === 0 ? 6 : jsDay - 1;
    weekdaySums[monIdx] += ratio;
    weekdayCounts[monIdx]++;

    if (doneIds.length > 0) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }

    let level = 0;
    if (ratio > 0 && ratio <= 0.25) level = 1;
    else if (ratio > 0.25 && ratio <= 0.5) level = 2;
    else if (ratio > 0.5 && ratio < 1) level = 3;
    else if (ratio >= 1 && doneIds.length > 0) level = 4;

    const cell = document.createElement("div");
    cell.className = `cell lv-${level} ${state.selectedInspectDate === dateKey ? "selected" : ""}`;
    cell.title = `${dateKey}: виконано ${doneIds.length} звичок (${Math.round(ratio * 100)}%)`;
    cell.addEventListener("click", () => {
      state.selectedInspectDate = dateKey;
      renderHeatmap();
    });

    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthGroups.has(monthKey)) {
      monthGroups.set(monthKey, {
        label: `${HEATMAP_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        cells: []
      });
    }
    monthGroups.get(monthKey).cells.push(cell);
  }

  monthGroups.forEach(group => {
    const monthEl = document.createElement("div");
    monthEl.className = "heatmap-month";

    const headerEl = document.createElement("div");
    headerEl.className = "heatmap-month-header";
    headerEl.innerHTML = `<span class="heatmap-month-title">${group.label}</span><span class="heatmap-month-count">${group.cells.length} дн.</span>`;

    const cellsEl = document.createElement("div");
    cellsEl.className = "heatmap-month-cells";
    group.cells.forEach(cell => cellsEl.appendChild(cell));

    monthEl.appendChild(headerEl);
    monthEl.appendChild(cellsEl);
    grid.appendChild(monthEl);
  });

  document.getElementById("stat-best-streak").textContent = `${bestStreak} дн.`;
  document.getElementById("stat-current-streak").textContent = `${tempStreak} дн.`;
  document.getElementById("stat-avg-rate").textContent = `${Math.round((totalRatioSum / days) * 100)}%`;
  document.getElementById("nav-badge-streak").textContent = `🔥${tempStreak}`;

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
  const wdayEl = document.getElementById("weekday-bars");
  wdayEl.innerHTML = dayNames.map((name, idx) => {
    const pct = weekdayCounts[idx] ? Math.round((weekdaySums[idx] / weekdayCounts[idx]) * 100) : 0;
    return `
      <div class="wday-row">
        <span>${name}</span>
        <div class="wday-track"><div class="wday-fill" style="width:${pct}%"></div></div>
        <span class="muted-text">${pct}%</span>
      </div>
    `;
  }).join("");

  renderDayInspector();
}

function renderDayInspector() {
  const dateKey = state.selectedInspectDate;
  const doneIds = state.history[dateKey] || [];
  const energy = state.energyLog[dateKey];
  const sessions = state.focusLog[dateKey] || 0;
  const titleEl = document.getElementById("inspector-date-title");
  const bodyEl = document.getElementById("inspector-date-body");

  titleEl.textContent = `Звіт за ${dateKey}`;
  const metaLine = `<div style="margin-bottom:8px">Енергія: <strong>${energy ? energy + "/5" : "—"}</strong> • Фокус-сесій: <strong>${sessions}</strong></div>`;

  if (!doneIds.length) {
    bodyEl.innerHTML = metaLine + "У цей день виконаних звичок не зафіксовано.";
    return;
  }

  const names = doneIds.map(id => {
    const found = state.habits.find(h => h.id === id);
    return found ? `• ${found.title} (${found.category})` : `• Звичка #${id}`;
  });
  bodyEl.innerHTML = metaLine + names.map(n => `<div>${escapeHtml(n)}</div>`).join("");
}

// --- RENDER BALANCE WHEEL ---
function renderBalance() {
  const container = document.getElementById("sliders-container");
  container.innerHTML = "";

  SPHERES.forEach(s => {
    const val = state.balance[s.key] ?? 5;
    const row = document.createElement("div");
    row.className = "slider-row";
    row.innerHTML = `
      <div class="slider-label">
        <span>${s.label}</span>
        <strong>${val} / 10</strong>
      </div>
      <input type="range" min="1" max="10" value="${val}" />
    `;
    row.querySelector("input").addEventListener("input", e => {
      state.balance[s.key] = Number(e.target.value);
      saveState();
      animateBalanceCanvas();
      updateBalanceAdvice();
      row.querySelector("strong").textContent = `${e.target.value} / 10`;
    });
    container.appendChild(row);
  });

  const snapSelect = document.getElementById("snapshot-select");
  snapSelect.innerHTML = state.snapshots
    .map((snap, idx) => `<option value="${idx}" ${idx === state.selectedSnapshotIdx ? "selected" : ""}>${escapeHtml(snap.label)}</option>`)
    .join("");

  animateBalanceCanvas();
  updateBalanceAdvice();
}

function updateBalanceAdvice() {
  const weakest = getWeakestSphere();
  const harmony = getHarmonyPercent();
  document.getElementById("harmony-score-text").textContent = `Індекс гармонії колеса: ${harmony}%`;
  document.getElementById("balance-advice-text").textContent =
    `Зараз найбільше просідає сфера «${weakest.sphere.label}» (${weakest.value}/10). Додай просту щоденну дію, щоб вирівняти колесо.`;
}

function animateBalanceCanvas() {
  if (animFrameId) cancelAnimationFrame(animFrameId);

  function step() {
    let needsMore = false;
    SPHERES.forEach(s => {
      const target = state.balance[s.key] ?? 5;
      const current = animatedBalance[s.key] ?? target;
      const diff = target - current;
      if (Math.abs(diff) > 0.02) {
        animatedBalance[s.key] = current + diff * 0.22;
        needsMore = true;
      } else {
        animatedBalance[s.key] = target;
      }
    });

    drawBalanceCanvas(animatedBalance);
    if (needsMore) animFrameId = requestAnimationFrame(step);
  }
  animFrameId = requestAnimationFrame(step);
}

function drawBalanceCanvas(activeValues) {
  const canvas = document.getElementById("balance-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = 145;
  const count = SPHERES.length;

  const accentHex = getComputedStyle(document.documentElement).getPropertyValue("--lv-4").trim() || "#39d353";
  const accentRgb = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || "57, 211, 83";

  ctx.clearRect(0, 0, w, h);

  for (let step = 2; step <= 10; step += 2) {
    ctx.beginPath();
    ctx.arc(cx, cy, (maxR * step) / 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  SPHERES.forEach((s, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#30363d";
    ctx.stroke();

    const lx = cx + Math.cos(angle) * (maxR + 28);
    const ly = cy + Math.sin(angle) * (maxR + 28);
    ctx.fillStyle = "#e6edf3";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.label, lx, ly);
  });

  const compareSnap = state.snapshots[state.selectedSnapshotIdx] || state.snapshots[0];
  if (compareSnap) {
    drawPolygon(ctx, cx, cy, maxR, compareSnap.values, "rgba(88, 166, 255, 0.1)", "#58a6ff", true, accentHex);
  }
  drawPolygon(ctx, cx, cy, maxR, activeValues, `rgba(${accentRgb}, 0.26)`, accentHex, false, accentHex);
}

function drawPolygon(ctx, cx, cy, maxR, dataMap, fillStyle, strokeStyle, dashed, pointColor) {
  const count = SPHERES.length;
  ctx.save();
  ctx.beginPath();
  const points = [];

  SPHERES.forEach((s, i) => {
    const val = dataMap[s.key] ?? 5;
    const r = (maxR * val) / 10;
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push({ x, y });
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.closePath();
  if (dashed) ctx.setLineDash([5, 5]);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();

  if (!dashed) {
    ctx.setLineDash([]);
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = pointColor;
      ctx.fill();
    });
  }
  ctx.restore();
}

// --- RENDER ACHIEVEMENTS ---
function renderAchievements() {
  const allCheckins = Object.values(state.history).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const totalFocus = Object.values(state.focusLog).reduce((sum, n) => sum + (Number(n) || 0), 0);
  const activeHabits = state.habits.filter(h => !h.archived);
  const doneToday = state.history[state.activeDate] || [];
  const perfectToday = activeHabits.length > 0 && activeHabits.every(h => doneToday.includes(h.id));
  const bestStreak = Math.max(0, ...activeHabits.map(h => calculateStreak(h.id)));
  const harmony = getHarmonyPercent();
  const energyDays = Object.keys(state.energyLog).length;

  const achievements = [
    { icon: "🌱", title: "Перший крок", desc: "Виконай хоча б 1 звичку", xp: 50, done: allCheckins >= 1 },
    { icon: "⚡", title: "Ідеальний день", desc: "Закрий 100% звичок за день", xp: 120, done: perfectToday },
    { icon: "🔥", title: "Тиждень без пропусків", desc: "Досягни серії 7 днів поспіль", xp: 150, done: bestStreak >= 7 },
    { icon: "🎯", title: "Глибокий фокус", desc: "Заверши 3 фокус-сесії таймера", xp: 100, done: totalFocus >= 3 },
    { icon: "⚖️", title: "Майстер балансу", desc: "Індекс гармонії колеса ≥ 75%", xp: 140, done: harmony >= 75 },
    { icon: "📚", title: "Архітектор режиму", desc: "Створи 5 або більше звичок", xp: 90, done: state.habits.length >= 5 },
    { icon: "🔋", title: "Пульс енергії", desc: "Зафіксуй самопочуття за 7 днів", xp: 80, done: energyDays >= 7 },
    { icon: "🏆", title: "Марафонець (50+)", desc: "Накопич 50 виконаних звичок", xp: 200, done: allCheckins >= 50 }
  ];

  const unlocked = achievements.filter(a => a.done);
  const habitsXp = allCheckins * 10;
  const focusXp = totalFocus * 25;
  const achXp = unlocked.reduce((s, a) => s + a.xp, 0);
  const totalXp = habitsXp + focusXp + achXp;
  const level = Math.floor(totalXp / 200) + 1;
  const xpInLevel = totalXp % 200;
  const currentRankIdx = Math.min(level - 1, RANKS.length - 1);
  const rankTitle = RANKS[currentRankIdx];
  const nextRankTitle = RANKS[currentRankIdx + 1] || null;

  document.getElementById("user-level-badge").textContent = `Рівень ${level}`;
  document.getElementById("user-rank-title").textContent = rankTitle;
  document.getElementById("user-xp-label").textContent = `${totalXp} XP`;
  document.getElementById("xp-progress-bar").style.width = `${Math.round((xpInLevel / 200) * 100)}%`;
  document.getElementById("xp-next-hint").textContent = `До рівня ${level + 1}: залишилось ${200 - xpInLevel} XP`;

  const previewEl = document.getElementById("rank-next-preview");
  if (previewEl) {
    previewEl.textContent = nextRankTitle
      ? `Наступний: ${nextRankTitle} · усього ${RANKS.length} рангів ▾`
      : `Максимальний ранг (${RANKS.length}/${RANKS.length}) ▾`;
  }

  document.getElementById("ach-total-checkins").textContent = allCheckins;
  document.getElementById("ach-total-focus").textContent = totalFocus;
  document.getElementById("ach-unlocked-count").textContent = `${unlocked.length} / ${achievements.length}`;
  document.getElementById("nav-badge-ach").textContent = `${unlocked.length}/${achievements.length}`;

  const gridEl = document.getElementById("achievements-grid");
  gridEl.innerHTML = achievements.map(a => `
    <div class="ach-card ${a.done ? "unlocked" : ""}">
      <div class="ach-top">
        <span class="ach-icon">${a.icon}</span>
        <span class="ach-xp">+${a.xp} XP</span>
      </div>
      <h3>${escapeHtml(a.title)}</h3>
      <p class="muted-text">${escapeHtml(a.desc)}</p>
      <span class="cat-tag" style="align-self:flex-start">${a.done ? "Відкрито" : "У процесі"}</span>
    </div>
  `).join("");

  // Джерела XP
  const xpBreakdownEl = document.getElementById("xp-breakdown-list");
  if (xpBreakdownEl) {
    const sources = [
      { label: `Виконані звички (${allCheckins} × 10 XP)`, val: habitsXp },
      { label: `Фокус-сесії (${totalFocus} × 25 XP)`, val: focusXp },
      { label: `Відкриті нагороди (${unlocked.length}/${achievements.length})`, val: achXp }
    ];
    const safeTotal = Math.max(1, totalXp);
    xpBreakdownEl.innerHTML = sources.map(s => {
      const pct = Math.round((s.val / safeTotal) * 100);
      return `
        <div class="cat-row">
          <div class="cat-row-top">
            <span>${escapeHtml(s.label)}</span>
            <strong>${s.val} XP (${pct}%)</strong>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Шлях рангів
  const ladderEl = document.getElementById("rank-ladder-list");
  const ladderBadge = document.getElementById("rank-ladder-badge");
  const ladderSub = document.getElementById("rank-ladder-subtitle");
  if (ladderBadge) ladderBadge.textContent = `${currentRankIdx + 1} / ${RANKS.length}`;
  if (ladderSub) ladderSub.textContent = `Усього ${RANKS.length} рангів · гортай список`;
  if (ladderEl) {
    ladderEl.innerHTML = RANKS.map((name, idx) => {
      const reqXp = idx * 200;
      const isCurrent = idx === currentRankIdx;
      const isUnlocked = idx < currentRankIdx;
      const isNext = idx === currentRankIdx + 1;
      const cls = isCurrent ? "current" : isUnlocked ? "unlocked" : isNext ? "next-rank" : "";
      const tag = isCurrent ? "Поточний" : isNext ? "Наступний" : isUnlocked ? "Пройдено" : `${reqXp} XP`;
      return `
        <div class="rank-ladder-item ${cls}" data-rank-idx="${idx}">
          <div class="rank-ladder-left">
            <span class="rank-num">${idx + 1}</span>
            <span>${escapeHtml(name)}</span>
          </div>
          <span class="rank-xp-req">${tag} · ${reqXp} XP</span>
        </div>
      `;
    }).join("");
  }
}

// --- RENDER MANAGE ---
function renderManage() {
  const listEl = document.getElementById("manage-habits-list");
  listEl.innerHTML = "";

  state.habits.forEach((habit, index) => {
    const row = document.createElement("div");
    row.className = `manage-row ${habit.archived ? "archived" : ""}`;
    row.innerHTML = `
      <input type="text" value="${escapeHtml(habit.title)}" aria-label="Назва звички" />
      <select aria-label="Категорія">
        ${["Спорт", "Навчання", "Сон", "Відпочинок", "Здоров'я"]
          .map(c => `<option value="${c}" ${habit.category === c ? "selected" : ""}>${c}</option>`)
          .join("")}
      </select>
      <label class="muted-text" style="display:flex;align-items:center;gap:4px">
        Ціль/тиждень:
        <input type="number" min="1" max="7" value="${habit.weeklyGoal || 5}" />
      </label>
      <div class="btn-row" style="margin-top:0">
        <button class="btn btn-secondary btn-sm move-up-btn" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="btn btn-secondary btn-sm move-down-btn" ${index === state.habits.length - 1 ? "disabled" : ""}>↓</button>
        <button class="btn btn-secondary btn-sm toggle-arch-btn">${habit.archived ? "Відновити" : "В архів"}</button>
        <button class="btn btn-danger btn-sm del-btn">Видалити</button>
      </div>
    `;

    const titleInput = row.querySelector('input[type="text"]');
    const goalInput = row.querySelector('input[type="number"]');
    const catSelect = row.querySelector("select");

    titleInput.addEventListener("change", () => {
      if (titleInput.value.trim()) {
        habit.title = titleInput.value.trim();
        saveState();
        renderAll();
      }
    });

    goalInput.addEventListener("change", () => {
      const val = Math.min(7, Math.max(1, Number(goalInput.value) || 5));
      habit.weeklyGoal = val;
      saveState();
      renderAll();
    });

    catSelect.addEventListener("change", () => {
      habit.category = catSelect.value;
      saveState();
      renderAll();
    });

    row.querySelector(".move-up-btn").addEventListener("click", () => {
      if (index > 0) {
        [state.habits[index - 1], state.habits[index]] = [state.habits[index], state.habits[index - 1]];
        saveState();
        renderAll();
      }
    });

    row.querySelector(".move-down-btn").addEventListener("click", () => {
      if (index < state.habits.length - 1) {
        [state.habits[index + 1], state.habits[index]] = [state.habits[index], state.habits[index + 1]];
        saveState();
        renderAll();
      }
    });

    row.querySelector(".toggle-arch-btn").addEventListener("click", () => {
      habit.archived = !habit.archived;
      saveState();
      renderAll();
    });

    row.querySelector(".del-btn").addEventListener("click", () => {
      state.habits = state.habits.filter(h => h.id !== habit.id);
      saveState();
      renderAll();
    });

    listEl.appendChild(row);
  });

  renderHabitTemplates();
}

function renderHabitTemplates() {
  const grid = document.getElementById("habit-templates-grid");
  if (!grid) return;

  grid.innerHTML = "";
  HABIT_TEMPLATES.forEach(tpl => {
    const exists = state.habits.some(h => h.title.toLowerCase() === tpl.title.toLowerCase());
    const card = document.createElement("div");
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-info">
        <span class="template-title">${escapeHtml(tpl.title)}</span>
        <span class="muted-text" style="font-size:0.76rem">${escapeHtml(tpl.category)} · Ціль ${tpl.weeklyGoal}/7</span>
      </div>
      <button type="button" class="btn ${exists ? "btn-secondary" : "btn-primary"} btn-sm" ${exists ? "disabled" : ""}>
        ${exists ? "✓ Вже є" : "+ Додати"}
      </button>
    `;

    const btn = card.querySelector("button");
    if (!exists) {
      btn.addEventListener("click", () => {
        state.habits.push({
          id: "h_" + Date.now(),
          title: tpl.title,
          category: tpl.category,
          weeklyGoal: tpl.weeklyGoal,
          archived: false
        });
        saveState();
        renderAll();
      });
    }
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- RENDER ANALYTICS ---
function renderAnalytics() {
  const activeHabits = state.habits.filter(h => !h.archived);
  const totalActive = activeHabits.length;
  const chartEl = document.getElementById("weekly-chart");
  const catEl = document.getElementById("category-breakdown");
  if (!chartEl || !catEl) return;

  const dayNames = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  let totalDoneWeek = 0;
  let totalPossibleWeek = 0;
  let focusWeek = 0;
  let energySum = 0;
  let energyDays = 0;

  chartEl.innerHTML = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date(state.activeDate);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const doneIds = (state.history[key] || []).filter(id => activeHabits.some(h => h.id === id));
    const pct = totalActive ? Math.round((doneIds.length / totalActive) * 100) : 0;

    totalDoneWeek += doneIds.length;
    totalPossibleWeek += totalActive;
    focusWeek += Number(state.focusLog[key]) || 0;
    if (state.energyLog[key]) {
      energySum += Number(state.energyLog[key]);
      energyDays++;
    }

    const col = document.createElement("div");
    col.className = `weekly-bar-col ${i === 0 ? "is-today" : ""}`;
    col.title = `${key}: ${doneIds.length}/${totalActive} (${pct}%)`;
    col.innerHTML = `
      <span class="weekly-bar-pct">${pct}%</span>
      <div class="weekly-bar-track">
        <div class="weekly-bar-fill" style="height: ${Math.max(4, pct)}%"></div>
      </div>
      <span class="weekly-bar-day">${dayNames[d.getDay()]}</span>
    `;
    chartEl.appendChild(col);
  }

  const weekRate = totalPossibleWeek ? Math.round((totalDoneWeek / totalPossibleWeek) * 100) : 0;
  document.getElementById("analytics-week-rate").textContent = `${weekRate}%`;
  document.getElementById("analytics-week-focus").textContent = `${focusWeek} сесій`;
  document.getElementById("analytics-week-energy").textContent =
    energyDays ? `${(energySum / energyDays).toFixed(1)} / 5` : "— / 5";

  const categories = ["Спорт", "Навчання", "Сон", "Відпочинок", "Здоров'я"];
  catEl.innerHTML = "";
  categories.forEach(cat => {
    const catHabits = activeHabits.filter(h => h.category === cat);
    if (!catHabits.length) return;
    let doneCount = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(state.activeDate);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const list = state.history[key] || [];
      doneCount += catHabits.filter(h => list.includes(h.id)).length;
    }
    const maxCount = catHabits.length * 7;
    const pct = maxCount ? Math.round((doneCount / maxCount) * 100) : 0;

    const row = document.createElement("div");
    row.className = "cat-row";
    row.innerHTML = `
      <div class="cat-row-top">
        <span>${escapeHtml(cat)} <span class="muted-text">(${catHabits.length})</span></span>
        <strong>${pct}%</strong>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
    catEl.appendChild(row);
  });

  if (!catEl.children.length) {
    catEl.innerHTML = `<p class="muted-text">Додай активні звички, щоб бачити статистику за категоріями.</p>`;
  }

  // Рейтинг звичок за 7 днів
  const rankEl = document.getElementById("analytics-habit-ranking");
  if (rankEl) {
    rankEl.innerHTML = "";
    if (!activeHabits.length) {
      rankEl.innerHTML = `<p class="muted-text">Немає активних звичок.</p>`;
    } else {
      const ranked = activeHabits
        .map(h => {
          const count = getWeeklyProgress(h.id);
          const pct = Math.round((count / 7) * 100);
          return { habit: h, count, pct, streak: calculateStreak(h.id) };
        })
        .sort((a, b) => b.pct - a.pct || b.streak - a.streak);

      ranked.forEach(({ habit, count, pct, streak }) => {
        const row = document.createElement("div");
        row.className = "habit-rank-row";
        row.innerHTML = `
          <div class="habit-rank-top">
            <span>${escapeHtml(habit.title)}</span>
            <span class="habit-rank-meta">
              <span class="muted-text">${count}/7</span>
              <span>🔥${streak}</span>
              <strong>${pct}%</strong>
            </span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${pct}%"></div>
          </div>
        `;
        rankEl.appendChild(row);
      });
    }
  }

  // Енергія та фокус за 7 днів
  const energyChartEl = document.getElementById("analytics-energy-chart");
  const insightEl = document.getElementById("analytics-insight-text");
  if (energyChartEl) {
    energyChartEl.innerHTML = "";
    let highEnergyRates = [];
    let lowEnergyRates = [];
    let bestDay = { label: "—", pct: -1 };

    for (let i = 6; i >= 0; i--) {
      const d = new Date(state.activeDate);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const energy = Number(state.energyLog[key]) || 0;
      const focus = Number(state.focusLog[key]) || 0;
      const doneIds = (state.history[key] || []).filter(id => activeHabits.some(h => h.id === id));
      const dayPct = totalActive ? Math.round((doneIds.length / totalActive) * 100) : 0;
      const barPct = Math.round((energy / 5) * 100);

      if (dayPct > bestDay.pct) bestDay = { label: `${dayNames[d.getDay()]} (${key.slice(8)}.${key.slice(5, 7)})`, pct: dayPct };
      if (energy >= 4) highEnergyRates.push(dayPct);
      else if (energy > 0) lowEnergyRates.push(dayPct);

      const col = document.createElement("div");
      col.className = `weekly-bar-col ${i === 0 ? "is-today" : ""}`;
      col.title = `${key}: Енергія ${energy || "—"}/5, Фокус-сесій: ${focus}`;
      col.innerHTML = `
        <span class="weekly-bar-pct">${energy ? `${energy}/5` : "—"}</span>
        <div class="weekly-bar-track">
          <div class="weekly-bar-fill energy-fill" style="height: ${Math.max(4, barPct)}%"></div>
        </div>
        <span class="weekly-bar-day">${dayNames[d.getDay()]}</span>
      `;
      energyChartEl.appendChild(col);
    }

    if (insightEl) {
      if (highEnergyRates.length && lowEnergyRates.length) {
        const hiAvg = Math.round(highEnergyRates.reduce((a, b) => a + b, 0) / highEnergyRates.length);
        const loAvg = Math.round(lowEnergyRates.reduce((a, b) => a + b, 0) / lowEnergyRates.length);
        insightEl.textContent = `У дні з високою енергією (4–5) ти виконуєш в середньому ${hiAvg}% звичок проти ${loAvg}% у дні втоми. Піковий день: ${bestDay.label} (${bestDay.pct}%).`;
      } else {
        insightEl.textContent = `Найпродуктивніший день тижня: ${bestDay.label} (${bestDay.pct}% виконання). Відмічай енергію щодня для глибшої аналітики.`;
      }
    }
  }
}

// --- RENDER JOURNAL ---
function renderJournalTagsBar() {
  const tagsEl = document.getElementById("journal-tags");
  const filterSelect = document.getElementById("journal-filter-tag");
  if (!tagsEl) return;

  const tags = Array.isArray(state.journalTags) && state.journalTags.length
    ? state.journalTags
    : [...DEFAULT_JOURNAL_TAGS];

  tagsEl.innerHTML = "";
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `pill journal-tag-btn journal-tag-pill ${activeJournalTags.has(tag) ? "active" : ""}`;
    btn.dataset.tag = tag;
    btn.innerHTML = `<span>${escapeHtml(tag)}</span><span class="journal-tag-remove" title="Прибрати тег">×</span>`;

    btn.addEventListener("click", e => {
      if (e.target.classList.contains("journal-tag-remove")) {
        e.stopPropagation();
        state.journalTags = tags.filter(t => t !== tag);
        activeJournalTags.delete(tag);
        saveState();
        renderJournal();
        return;
      }
      if (activeJournalTags.has(tag)) activeJournalTags.delete(tag);
      else activeJournalTags.add(tag);
      btn.classList.toggle("active", activeJournalTags.has(tag));
    });

    tagsEl.appendChild(btn);
  });

  if (filterSelect) {
    const prevVal = filterSelect.value || "Усі";
    const allUsedTags = new Set(tags);
    (state.journalNotes || []).forEach(n => (n.tags || []).forEach(t => allUsedTags.add(t)));
    filterSelect.innerHTML = `<option value="Усі">Усі теги</option>` +
      [...allUsedTags].map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
    filterSelect.value = allUsedTags.has(prevVal) ? prevVal : "Усі";
  }
}

function renderJournal() {
  const dateLabel = document.getElementById("journal-active-date-label");
  const feedEl = document.getElementById("journal-feed");
  const countLabel = document.getElementById("journal-count-label");
  if (!feedEl) return;

  if (dateLabel) dateLabel.textContent = `Нова нотатка за ${state.activeDate}`;
  renderJournalTagsBar();

  const searchQ = (document.getElementById("journal-search-input")?.value || "").trim().toLowerCase();
  const filterTag = document.getElementById("journal-filter-tag")?.value || "Усі";

  const allNotes = [...(state.journalNotes || [])].sort((a, b) => {
    const dateCmp = (b.date || "").localeCompare(a.date || "");
    if (dateCmp !== 0) return dateCmp;
    return (b.time || "").localeCompare(a.time || "");
  });

  const filtered = allNotes.filter(note => {
    const matchTag = filterTag === "Усі" || (note.tags || []).includes(filterTag);
    const matchSearch = !searchQ ||
      (note.text || "").toLowerCase().includes(searchQ) ||
      (note.tags || []).some(t => t.toLowerCase().includes(searchQ));
    return matchTag && matchSearch;
  });

  countLabel.textContent = filtered.length === allNotes.length
    ? `${allNotes.length} записів`
    : `${filtered.length} із ${allNotes.length} записів`;
  feedEl.innerHTML = "";

  if (!filtered.length) {
    feedEl.innerHTML = `<p class="muted-text">Записів за цим фільтром не знайдено. Напиши нову нотатку вище!</p>`;
    return;
  }

  filtered.forEach(note => {
    const energy = state.energyLog[note.date];
    const doneCount = (state.history[note.date] || []).length;
    const item = document.createElement("div");
    item.className = "journal-entry";
    const tagsHtml = (note.tags || [])
      .map(t => `<button type="button" class="journal-chip clickable" data-filter-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
      .join("");

    item.innerHTML = `
      <div class="journal-entry-head">
        <span class="journal-entry-date">${escapeHtml(note.date)}${note.time ? ` · ${escapeHtml(note.time)}` : ""}</span>
        <div class="journal-entry-actions">
          <span class="muted-text">Звичок: ${doneCount}${energy ? ` · Енергія: ${energy}/5` : ""}</span>
          <button type="button" class="daily-task-del journal-del-btn" title="Видалити нотатку">×</button>
        </div>
      </div>
      <p class="journal-entry-text">${escapeHtml(note.text || "Без тексту")}</p>
      ${tagsHtml ? `<div class="journal-entry-tags">${tagsHtml}</div>` : ""}
    `;

    item.querySelector(".journal-del-btn").addEventListener("click", () => {
      state.journalNotes = (state.journalNotes || []).filter(n => n.id !== note.id);
      saveState();
      renderJournal();
    });

    item.querySelectorAll(".journal-chip[data-filter-tag]").forEach(chip => {
      chip.addEventListener("click", () => {
        const filterSelect = document.getElementById("journal-filter-tag");
        if (filterSelect) {
          filterSelect.value = chip.dataset.filterTag;
          renderJournal();
        }
      });
    });

    feedEl.appendChild(item);
  });
}

// --- RENDER FOOTER ---
function renderFooter() {
  const quoteEl = document.getElementById("footer-quote-text");
  const levelPill = document.getElementById("footer-level-pill");
  const streakPill = document.getElementById("footer-streak-pill");
  const themePill = document.getElementById("footer-theme-pill");

  if (quoteEl) quoteEl.textContent = DAILY_QUOTES[currentQuoteIdx % DAILY_QUOTES.length];
  if (levelPill) {
    const levelText = document.getElementById("user-level-badge")?.textContent || "Рівень 1";
    const xpText = document.getElementById("user-xp-label")?.textContent || "0 XP";
    levelPill.textContent = `${levelText} · ${xpText}`;
  }
  if (streakPill) {
    const bestStreakText = document.getElementById("nav-badge-streak")?.textContent || "🔥0";
    streakPill.textContent = `${bestStreakText} дн. серія`;
  }
  if (themePill) {
    themePill.textContent = `Тема: ${THEME_LABELS[state.theme] || state.theme}`;
  }
}

function renderAll() {
  renderToday();
  renderHeatmap();
  renderBalance();
  renderAnalytics();
  renderJournal();
  renderAchievements();
  renderManage();
  renderProfile();
  renderFooter();
  updateNavIndicator();
}

// --- RENDER PROFILE ---
function renderProfile() {
  const profile = state.profile || { nickname: "Даниїїл", username: "@danyiil" };
  const nick = profile.nickname || "Даниїїл";
  const user = profile.username || "@danyiil";

  const headerName = document.getElementById("header-profile-name");
  if (headerName) headerName.textContent = nick;

  const nickDisp = document.getElementById("profile-nickname-display");
  const userDisp = document.getElementById("profile-username-display");
  if (nickDisp) nickDisp.textContent = nick;
  if (userDisp) userDisp.textContent = user.startsWith("@") ? user : `@${user}`;

  const activeHabits = state.habits.filter(h => !h.archived);
  const longestHabitStreak = Math.max(0, ...state.habits.map(h => calculateStreak(h.id)));
  const currentActiveStreak = Number(
    (document.getElementById("stat-current-streak")?.textContent || "0").replace(/\D/g, "")
  ) || 0;
  const bestOverallStreak = Math.max(longestHabitStreak, currentActiveStreak);

  const rankText = document.getElementById("user-rank-title")?.textContent || RANKS[0];
  const levelText = document.getElementById("user-level-badge")?.textContent || "Рівень 1";

  const rankBadge = document.getElementById("profile-rank-badge");
  const rankStat = document.getElementById("profile-rank-stat");
  const longestEl = document.getElementById("profile-longest-streak");
  const currentEl = document.getElementById("profile-current-streak");
  if (rankBadge) rankBadge.textContent = `${levelText} · ${rankText}`;
  if (rankStat) rankStat.textContent = rankText;
  if (longestEl) longestEl.textContent = `${bestOverallStreak} дн.`;
  if (currentEl) currentEl.textContent = `${currentActiveStreak} дн.`;

  // Улюблені звички
  const favGrid = document.getElementById("profile-fav-habits");
  const favCountEl = document.getElementById("profile-fav-count");
  const favIds = Array.isArray(state.favoriteHabits) ? state.favoriteHabits : [];
  if (favGrid) {
    const sorted = [...activeHabits].sort((a, b) => Number(favIds.includes(b.id)) - Number(favIds.includes(a.id)));
    const activeFavCount = activeHabits.filter(h => favIds.includes(h.id)).length;
    if (favCountEl) favCountEl.textContent = `${activeFavCount} обраних`;

    if (!sorted.length) {
      favGrid.innerHTML = `<p class="muted-text">Додай активні звички, щоб обрати улюблені.</p>`;
    } else {
      favGrid.innerHTML = "";
      sorted.forEach(habit => {
        const isFav = favIds.includes(habit.id);
        const streak = calculateStreak(habit.id);
        const item = document.createElement("div");
        item.className = `profile-fav-item ${isFav ? "is-fav" : ""}`;
        item.innerHTML = `
          <div style="min-width: 0">
            <div style="font-weight: 600; font-size: 0.88rem">${escapeHtml(habit.title)}</div>
            <div class="muted-text" style="font-size: 0.76rem">${escapeHtml(habit.category)} · 🔥 ${streak} дн.</div>
          </div>
          <button type="button" class="fav-star-btn ${isFav ? "active" : ""}" title="${isFav ? "Прибрати з улюблених" : "Додати в улюблені"}">★</button>
        `;
        item.querySelector(".fav-star-btn").addEventListener("click", () => {
          if (!Array.isArray(state.favoriteHabits)) state.favoriteHabits = [];
          if (state.favoriteHabits.includes(habit.id)) {
            state.favoriteHabits = state.favoriteHabits.filter(id => id !== habit.id);
          } else {
            state.favoriteHabits.push(habit.id);
          }
          saveState();
          renderProfile();
        });
        favGrid.appendChild(item);
      });
    }
  }

  // Список друзів
  const friendsEl = document.getElementById("profile-friends-list");
  const friendsCountEl = document.getElementById("profile-friends-count");
  const friends = Array.isArray(state.friends) ? state.friends : [];
  if (friendsCountEl) friendsCountEl.textContent = `${friends.length} друзів`;
  if (friendsEl) {
    if (!friends.length) {
      friendsEl.innerHTML = `<p class="muted-text">Список друзів порожній — додай друга вище!</p>`;
    } else {
      friendsEl.innerHTML = "";
      friends.forEach(fr => {
        const letter = (fr.nickname || "Д").trim().charAt(0).toUpperCase();
        const uname = (fr.username || "").startsWith("@") ? fr.username : `@${fr.username}`;
        const row = document.createElement("div");
        row.className = "friend-row";
        row.innerHTML = `
          <div class="friend-left">
            <span class="friend-avatar">${escapeHtml(letter)}</span>
            <div class="friend-meta">
              <span class="friend-name">${escapeHtml(fr.nickname)}</span>
              <span class="muted-text" style="font-size: 0.76rem">${escapeHtml(uname)} · ${escapeHtml(fr.rank || RANKS[0])}</span>
            </div>
          </div>
          <div class="friend-right">
            <span class="streak-badge">🔥 ${Number(fr.streak) || 0} дн.</span>
            <button type="button" class="daily-task-del" title="Видалити з друзів">×</button>
          </div>
        `;
        row.querySelector(".daily-task-del").addEventListener("click", () => {
          state.friends = friends.filter(f => f.id !== fr.id);
          saveState();
          renderProfile();
        });
        friendsEl.appendChild(row);
      });
    }
  }
}

// --- EVENTS ---
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    document.getElementById("profile-header-btn")?.classList.remove("active");
    const indicator = document.getElementById("nav-indicator");
    if (indicator) indicator.style.opacity = "1";
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    updateNavIndicator();
    if (btn.dataset.tab === "balance") animateBalanceCanvas();
  });
});

const HOTKEY_TABS = {
  "1": "today",
  "2": "heatmap",
  "3": "balance",
  "4": "analytics",
  "5": "journal",
  "6": "achievements",
  "7": "manage"
};

document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const target = e.target;
  if (
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable)
  ) {
    return;
  }
  const tabName = HOTKEY_TABS[e.key];
  if (!tabName) return;
  document.querySelector(`.nav-btn[data-tab="${tabName}"]`)?.click();
});

document.getElementById("profile-header-btn")?.addEventListener("click", () => {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const indicator = document.getElementById("nav-indicator");
  if (indicator) indicator.style.opacity = "0";
  document.getElementById("profile-header-btn")?.classList.add("active");
  document.getElementById("tab-profile")?.classList.add("active");
  renderProfile();
});

window.addEventListener("resize", updateNavIndicator);

document.querySelectorAll(".theme-dot").forEach(dot => {
  dot.addEventListener("click", () => applyTheme(dot.dataset.setTheme));
});

document.querySelectorAll("[data-goto]").forEach(el => {
  el.addEventListener("click", e => {
    if (e.target.closest("button, input, select, a") && !e.target.closest("[data-goto]")?.isSameNode(el)) {
      return;
    }
    if (el.tagName !== "BUTTON" && e.target.closest("button, input, select, a")) {
      return;
    }
    const targetTab = el.dataset.goto;
    document.querySelector(`.nav-btn[data-tab="${targetTab}"]`)?.click();
  });
});

document.getElementById("profile-edit-toggle-btn")?.addEventListener("click", () => {
  const form = document.getElementById("profile-edit-form");
  if (!form) return;
  const isHidden = form.style.display === "none";
  form.style.display = isHidden ? "block" : "none";
  if (isHidden) {
    const profile = state.profile || { nickname: "Даниїїл", username: "@danyiil" };
    document.getElementById("profile-nickname-input").value = profile.nickname || "";
    document.getElementById("profile-username-input").value = profile.username || "";
    document.getElementById("profile-nickname-input").focus();
  }
});

document.getElementById("profile-edit-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const nickname = document.getElementById("profile-nickname-input").value.trim();
  let username = document.getElementById("profile-username-input").value.trim().replace(/\s+/g, "_");
  if (!nickname || !username) return;
  if (!username.startsWith("@")) username = "@" + username;
  state.profile = { nickname, username };
  saveState();
  document.getElementById("profile-edit-form").style.display = "none";
  renderProfile();
});

document.getElementById("profile-add-friend-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const nickInput = document.getElementById("friend-nickname-input");
  const userInput = document.getElementById("friend-username-input");
  const nickname = nickInput.value.trim();
  let username = userInput.value.trim().replace(/\s+/g, "_");
  if (!nickname || !username) return;
  if (!username.startsWith("@")) username = "@" + username;

  if (!Array.isArray(state.friends)) state.friends = [];
  state.friends.push({
    id: "f_" + Date.now(),
    nickname,
    username,
    streak: Math.floor(Math.random() * 14) + 1,
    rank: RANKS[Math.floor(Math.random() * 4)]
  });
  nickInput.value = "";
  userInput.value = "";
  saveState();
  renderProfile();
});

document.querySelectorAll(".energy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    state.energyLog[state.activeDate] = Number(btn.dataset.energy);
    saveState();
    renderAll();
  });
});

document.getElementById("complete-all-btn").addEventListener("click", e => {
  const activeIds = state.habits.filter(h => !h.archived).map(h => h.id);
  const prevDone = state.history[state.activeDate] || [];
  const hadRemaining = activeIds.some(id => !prevDone.includes(id));
  state.history[state.activeDate] = [...new Set(activeIds)];
  saveState();
  if (activeIds.length > 0 && hadRemaining) {
    spawnConfettiBurst(e.currentTarget, 24);
    playAllCompleteSound();
  }
  renderAll();
});

document.getElementById("clear-today-btn").addEventListener("click", () => {
  state.history[state.activeDate] = [];
  saveState();
  renderAll();
});

document.getElementById("habit-search-input").addEventListener("input", e => {
  state.searchQuery = e.target.value;
  renderToday();
});

document.getElementById("habit-sort-select").addEventListener("change", e => {
  state.sortBy = e.target.value;
  renderToday();
});

document.querySelectorAll("#category-filters .pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("#category-filters .pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    state.selectedCategory = pill.dataset.cat;
    saveState();
    renderToday();
  });
});

document.getElementById("heatmap-cat-filter").addEventListener("change", e => {
  state.heatmapCategory = e.target.value;
  renderHeatmap();
});

document.querySelectorAll(".period-switch .pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".period-switch .pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    state.heatmapDays = Number(pill.dataset.days);
    saveState();
    renderHeatmap();
  });
});

document.getElementById("quick-add-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("habit-title-input");
  const select = document.getElementById("habit-cat-select");
  const title = input.value.trim();
  if (!title) return;

  state.habits.push({
    id: "h_" + Date.now(),
    title,
    category: select.value,
    weeklyGoal: 5,
    archived: false
  });
  input.value = "";
  saveState();
  renderAll();
});

function syncBalanceWithHabits() {
  const last7Dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(state.activeDate);
    d.setDate(d.getDate() - i);
    last7Dates.push(d.toISOString().slice(0, 10));
  }

  let updatedCount = 0;
  SPHERES.forEach(s => {
    const sphereHabits = state.habits.filter(h => !h.archived && h.category === s.key);
    if (sphereHabits.length === 0) return;

    const ratioSum = sphereHabits.reduce((sum, h) => {
      const doneCount = last7Dates.reduce((acc, dateKey) => {
        const dayDone = state.history[dateKey] || [];
        return acc + (dayDone.includes(h.id) ? 1 : 0);
      }, 0);
      const goal = Math.max(1, Number(h.weeklyGoal) || 5);
      return sum + Math.min(doneCount / goal, 1);
    }, 0);

    const avgRatio = ratioSum / sphereHabits.length;
    state.balance[s.key] = Math.max(1, Math.round(avgRatio * 10));
    updatedCount++;
  });

  if (updatedCount > 0) {
    saveState();
    renderBalance();
    renderToday();
  }
  return updatedCount;
}

document.getElementById("snapshot-select").addEventListener("change", e => {
  state.selectedSnapshotIdx = Number(e.target.value);
  animateBalanceCanvas();
});

let syncBalanceBtnTimer = null;
document.getElementById("sync-balance-btn")?.addEventListener("click", e => {
  const updated = syncBalanceWithHabits();
  if (updated > 0) playSyncSound();
  const btn = e.currentTarget;
  if (!btn) return;
  if (syncBalanceBtnTimer) clearTimeout(syncBalanceBtnTimer);
  btn.textContent = updated > 0 ? "Синхронізовано ✓" : "Немає активних звичок";
  syncBalanceBtnTimer = setTimeout(() => {
    btn.textContent = "Синхронізувати зі звичками";
    syncBalanceBtnTimer = null;
  }, 1800);
});

document.getElementById("save-week-snapshot-btn").addEventListener("click", () => {
  state.snapshots.unshift({
    label: `Зріз від ${state.activeDate}`,
    values: { ...state.balance }
  });
  if (state.snapshots.length > 6) state.snapshots.pop();
  state.selectedSnapshotIdx = 0;
  saveState();
  renderBalance();
});

document.getElementById("add-weak-habit-btn").addEventListener("click", () => {
  const weakest = getWeakestSphere().sphere.key;
  const mappedCat = ["Спорт", "Навчання", "Сон", "Відпочинок", "Здоров'я"].includes(weakest)
    ? weakest
    : "Відпочинок";

  document.querySelector('.nav-btn[data-tab="today"]').click();
  document.getElementById("habit-cat-select").value = mappedCat;
  document.getElementById("habit-title-input").focus();
});

function addCustomJournalTag() {
  const input = document.getElementById("new-tag-input");
  if (!input) return;
  let raw = input.value.trim().replace(/\s+/g, "_");
  if (!raw) return;
  if (!raw.startsWith("#")) raw = "#" + raw;

  if (!Array.isArray(state.journalTags)) state.journalTags = [...DEFAULT_JOURNAL_TAGS];
  if (!state.journalTags.includes(raw)) {
    state.journalTags.push(raw);
  }
  activeJournalTags.add(raw);
  input.value = "";
  saveState();
  renderJournal();
}

document.getElementById("add-tag-btn")?.addEventListener("click", addCustomJournalTag);
document.getElementById("new-tag-input")?.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCustomJournalTag();
  }
});

document.getElementById("journal-form").addEventListener("submit", e => {
  e.preventDefault();
  const textarea = document.getElementById("journal-textarea");
  const text = textarea.value.trim();
  if (!text && activeJournalTags.size === 0) return;

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (!Array.isArray(state.journalNotes)) state.journalNotes = [];

  state.journalNotes.push({
    id: "jn_" + Date.now(),
    date: state.activeDate,
    time,
    text,
    tags: [...activeJournalTags]
  });

  textarea.value = "";
  activeJournalTags.clear();
  saveState();
  renderJournal();

  const badge = document.getElementById("journal-saved-badge");
  if (badge) {
    badge.style.opacity = "1";
    setTimeout(() => { badge.style.opacity = "0"; }, 1800);
  }
});

document.getElementById("journal-clear-btn").addEventListener("click", () => {
  document.getElementById("journal-textarea").value = "";
  activeJournalTags.clear();
  renderJournalTagsBar();
});

document.getElementById("journal-search-input")?.addEventListener("input", renderJournal);
document.getElementById("journal-filter-tag")?.addEventListener("change", renderJournal);

document.getElementById("rank-card-trigger")?.addEventListener("click", () => {
  const ladderCard = document.getElementById("rank-ladder-card");
  const currentItem = document.querySelector("#rank-ladder-list .rank-ladder-item.current");
  if (ladderCard) {
    ladderCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  if (currentItem) {
    currentItem.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

document.getElementById("footer-next-quote-btn").addEventListener("click", () => {
  currentQuoteIdx = (currentQuoteIdx + 1) % DAILY_QUOTES.length;
  renderFooter();
});

document.getElementById("daily-task-form")?.addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("daily-task-input");
  const title = input.value.trim();
  if (!title) return;

  if (!Array.isArray(state.dailyTasks[state.activeDate])) {
    state.dailyTasks[state.activeDate] = [];
  }
  state.dailyTasks[state.activeDate].push({
    id: "dt_" + Date.now(),
    title,
    done: false
  });
  input.value = "";
  saveState();
  renderDailyTasks();
});

document.getElementById("water-plus-btn")?.addEventListener("click", e => {
  const cur = Number(state.waterLog[state.activeDate]) || 0;
  setWaterCount(cur + 1, e.currentTarget);
});

document.getElementById("water-minus-btn")?.addEventListener("click", () => {
  const cur = Number(state.waterLog[state.activeDate]) || 0;
  setWaterCount(cur - 1);
});

syncRealCalendarDate();
applyTheme(state.theme || "emerald");
renderAll();