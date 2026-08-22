// meriblog OS — gerenciador de janelas
// Comentado em detalhe de propósito: é um bom material de estudo de DOM/eventos em JS puro.

document.addEventListener("DOMContentLoaded", () => {
  const isTouch = window.matchMedia("(hover: none)").matches;
  const isMobile = () => window.innerWidth <= 760;

  let zTop = 10;
  const openWindows = new Set();

  // ------------------------------------------
  // abrir / fechar / focar janelas
  // ------------------------------------------
  let activeWindowId = null;

  function focusWindow(win) {
    win.classList.remove("minimized");
    zTop += 1;
    win.style.zIndex = zTop;
    activeWindowId = win.id;
    document.querySelectorAll(".taskbar-tab").forEach((t) => {
      t.classList.remove("active");
      t.classList.remove("is-minimized");
    });
    const tab = document.querySelector(`.taskbar-tab[data-window="${win.id}"]`);
    if (tab) tab.classList.add("active");
  }

  function minimizeWindow(win) {
    win.classList.add("minimized");
    if (activeWindowId === win.id) activeWindowId = null;
    const tab = document.querySelector(`.taskbar-tab[data-window="${win.id}"]`);
    if (tab) {
      tab.classList.remove("active");
      tab.classList.add("is-minimized");
    }
  }

  function toggleMaximize(win) {
    if (win.classList.contains("maximized")) {
      win.classList.remove("maximized");
      // restaura a posição/tamanho de antes de maximizar
      if (win.dataset.prevStyle) {
        win.style.cssText += win.dataset.prevStyle;
      }
    } else {
      win.dataset.prevStyle = `top:${win.style.top};left:${win.style.left};width:${win.style.width};height:${win.style.height};`;
      win.classList.add("maximized");
    }
    focusWindow(win);
  }

  function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    if (!win.classList.contains("open")) {
      win.classList.add("open");
      openWindows.add(id);
      addTaskbarTab(id, win);

      // cascata: cada nova janela abre um pouco deslocada da anterior
      if (!isMobile()) {
        const offset = (openWindows.size - 1) * 26;
        win.style.top = 70 + (offset % 220) + "px";
        win.style.left = 70 + (offset % 260) + "px";
      }
    }
    focusWindow(win);
  }

  function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.remove("open");
    openWindows.delete(id);
    const tab = document.querySelector(`.taskbar-tab[data-window="${id}"]`);
    if (tab) tab.remove();
  }

  function addTaskbarTab(id, win) {
    if (document.querySelector(`.taskbar-tab[data-window="${id}"]`)) return;
    const label = win.dataset.title || id;
    const tab = document.createElement("button");
    tab.className = "taskbar-tab";
    tab.dataset.window = id;
    tab.textContent = label;
    tab.addEventListener("click", () => {
      if (win.classList.contains("minimized")) {
        focusWindow(win);
      } else if (activeWindowId === win.id) {
        minimizeWindow(win); // clicar de novo na aba ativa minimiza, igual barra de tarefas de verdade
      } else {
        focusWindow(win);
      }
    });
    document.querySelector(".taskbar-tabs").appendChild(tab);
  }

  // ------------------------------------------
  // ícones do desktop: 1 clique seleciona, 2 cliques (ou 1 toque no celular) abre
  // ------------------------------------------
  document.querySelectorAll(".icon").forEach((icon) => {
    const targetId = icon.dataset.opens;

    icon.addEventListener("click", () => {
      document.querySelectorAll(".icon").forEach((i) => i.classList.remove("selected"));
      icon.classList.add("selected");
      if (isTouch) openWindow(targetId); // no celular, 1 toque já abre
    });

    icon.addEventListener("dblclick", () => openWindow(targetId));
  });

  document.querySelectorAll("[data-open-window]").forEach((el) => {
    el.addEventListener("click", () => openWindow(el.dataset.openWindow));
  });

  // clicar no "vazio" do desktop desmarca os ícones
  document.querySelector(".desktop").addEventListener("click", (e) => {
    if (e.target.classList.contains("desktop")) {
      document.querySelectorAll(".icon").forEach((i) => i.classList.remove("selected"));
    }
  });

  // ------------------------------------------
  // janelas: fechar, focar ao clicar, arrastar pela barra de título
  // ------------------------------------------
  document.querySelectorAll(".window").forEach((win) => {
    win.addEventListener("mousedown", () => focusWindow(win));

    const closeBtn = win.querySelector(".close-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => closeWindow(win.id));

    const [minimizeBtn, maximizeBtn] = win.querySelectorAll(".win-controls .win-btn");
    if (minimizeBtn) minimizeBtn.addEventListener("click", () => minimizeWindow(win));
    if (maximizeBtn) maximizeBtn.addEventListener("click", () => toggleMaximize(win));

    const titlebar = win.querySelector(".titlebar");
    if (!titlebar) return;

    titlebar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".win-btn")) return;
      toggleMaximize(win);
    });

    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    titlebar.addEventListener("mousedown", (e) => {
      if (isMobile() || win.classList.contains("maximized") || e.target.closest(".win-btn")) return;
      dragging = true;
      win.classList.add("dragging");
      focusWindow(win);
      startX = e.clientX;
      startY = e.clientY;
      const rect = win.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = startLeft + dx;
      let newTop = Math.max(0, startTop + dy);
      win.style.left = newLeft + "px";
      win.style.top = newTop + "px";
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
      win.classList.remove("dragging");
    });
  });

  // ------------------------------------------
  // botão iniciar
  // ------------------------------------------
  const startBtn = document.querySelector(".start-btn");
  const startMenu = document.querySelector(".start-menu");

  if (startBtn && startMenu) {
    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.classList.remove("open");
      }
    });

    document.querySelectorAll(".start-menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        openWindow(item.dataset.opens);
        startMenu.classList.remove("open");
      });
    });
  }

  // ------------------------------------------
  // relógio da barra de tarefas
  // ------------------------------------------
  const clockEl = document.querySelector(".taskbar-clock");
  function tickClock() {
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${h}:${m}`;
  }
  tickClock();
  setInterval(tickClock, 15000);

  // ------------------------------------------
  // posts: alternar entre lista e detalhe dentro da mesma janela
  // ------------------------------------------
  document.querySelectorAll("[data-show-post]").forEach((row) => {
    row.addEventListener("click", () => {
      const postId = row.dataset.showPost;
      document.querySelector(".file-list").style.display = "none";
      document.getElementById(postId).classList.add("open");
    });
  });

  document.querySelectorAll("[data-back-to-list]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".post-detail").forEach((p) => p.classList.remove("open"));
      document.querySelector(".file-list").style.display = "flex";
    });
  });

  // ------------------------------------------
  // álbum: abrir imagem no visualizador
  // ------------------------------------------
  document.querySelectorAll("[data-show-photo]").forEach((item) => {
    item.addEventListener("click", () => {
      const photoId = item.dataset.showPhoto;
      const source = document.getElementById(photoId);
      if (!source) return;
      document.querySelector("#viewer-title").textContent = source.dataset.filename;
      document.querySelector("#viewer-frame").innerHTML = source.querySelector(".album-thumb").innerHTML;
      document.querySelector("#viewer-caption-title").textContent = source.dataset.caption;
      document.querySelector("#viewer-caption-text").textContent = source.dataset.note;
      openWindow("window-viewer");
    });
  });

  // ------------------------------------------
  // trilha: clicar num marco mostra o comentário
  // ------------------------------------------
  document.querySelectorAll(".map-stop-card, .map-dot").forEach((el) => {
    el.addEventListener("click", () => {
      const note = el.closest(".map-stop").querySelector(".map-stop-note");
      if (note) note.classList.toggle("open");
    });
  });

  // ------------------------------------------
  // widget: calendário do mês atual
  // ------------------------------------------
  function renderCalendar() {
    const calEl = document.querySelector("#widget-calendar-grid");
    const monthLabel = document.querySelector("#widget-calendar-month");
    if (!calEl) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthNames = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
    monthLabel.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = ["D","S","T","Q","Q","S","S"].map((d) => `<span>${d}</span>`).join("");
    for (let i = 0; i < firstDay; i++) html += `<span></span>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today;
      html += `<span class="cal-day${isToday ? " cal-today" : ""}">${d}</span>`;
    }
    calEl.innerHTML = html;
  }
  renderCalendar();

  // ------------------------------------------
  // widget: clima (API gratuita Open-Meteo, sem chave)
  // ------------------------------------------
  function renderWeather(tempC, code) {
    const iconEl = document.querySelector("#widget-weather-icon");
    const tempEl = document.querySelector("#widget-weather-temp");
    const descEl = document.querySelector("#widget-weather-desc");
    if (!iconEl) return;

    const map = {
      0: ["☀️", "céu limpo"], 1: ["🌤️", "poucas nuvens"], 2: ["⛅", "parcialmente nublado"],
      3: ["☁️", "nublado"], 45: ["🌫️", "neblina"], 48: ["🌫️", "neblina"],
      51: ["🌦️", "garoa"], 53: ["🌦️", "garoa"], 55: ["🌦️", "garoa"],
      61: ["🌧️", "chuva fraca"], 63: ["🌧️", "chuva"], 65: ["🌧️", "chuva forte"],
      71: ["🌨️", "neve"], 73: ["🌨️", "neve"], 75: ["🌨️", "neve forte"],
      80: ["🌦️", "pancadas"], 81: ["🌦️", "pancadas"], 82: ["⛈️", "pancadas fortes"],
      95: ["⛈️", "tempestade"], 96: ["⛈️", "tempestade"], 99: ["⛈️", "tempestade"],
    };
    const [icon, desc] = map[code] || ["🌡️", "—"];
    iconEl.textContent = icon;
    tempEl.textContent = `${Math.round(tempC)}°C`;
    descEl.textContent = desc;
  }

  function fetchWeather(lat, lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
      .then((res) => res.json())
      .then((data) => renderWeather(data.current.temperature_2m, data.current.weather_code))
      .catch(() => {
        const descEl = document.querySelector("#widget-weather-desc");
        if (descEl) descEl.textContent = "não foi possível carregar";
      });
  }

  // coordenadas de fallback: São Paulo, SP (troque se quiser fixar sua cidade)
  const FALLBACK_LAT = -23.5505;
  const FALLBACK_LON = -46.6333;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(FALLBACK_LAT, FALLBACK_LON),
      { timeout: 5000 }
    );
  } else {
    fetchWeather(FALLBACK_LAT, FALLBACK_LON);
  }

  // ------------------------------------------
  // widget: pomodoro
  // ------------------------------------------
  const POMO_START_SECONDS = 25 * 60;
  let pomoSeconds = POMO_START_SECONDS;
  let pomoInterval = null;

  const pomoTimeEl = document.querySelector("#widget-pomodoro-time");
  const pomoPlayBtn = document.querySelector("#widget-pomodoro-play");
  const pomoResetBtn = document.querySelector("#widget-pomodoro-reset");

  function renderPomo() {
    const m = String(Math.floor(pomoSeconds / 60)).padStart(2, "0");
    const s = String(pomoSeconds % 60).padStart(2, "0");
    if (pomoTimeEl) pomoTimeEl.textContent = `${m}:${s}`;
  }
  renderPomo();

  if (pomoPlayBtn) {
    pomoPlayBtn.addEventListener("click", () => {
      if (pomoInterval) {
        clearInterval(pomoInterval);
        pomoInterval = null;
        pomoPlayBtn.textContent = "▶";
      } else {
        pomoPlayBtn.textContent = "⏸";
        pomoInterval = setInterval(() => {
          pomoSeconds -= 1;
          if (pomoSeconds <= 0) {
            pomoSeconds = 0;
            clearInterval(pomoInterval);
            pomoInterval = null;
            pomoPlayBtn.textContent = "▶";
          }
          renderPomo();
        }, 1000);
      }
    });
  }

  if (pomoResetBtn) {
    pomoResetBtn.addEventListener("click", () => {
      clearInterval(pomoInterval);
      pomoInterval = null;
      pomoSeconds = POMO_START_SECONDS;
      if (pomoPlayBtn) pomoPlayBtn.textContent = "▶";
      renderPomo();
    });
  }
});
