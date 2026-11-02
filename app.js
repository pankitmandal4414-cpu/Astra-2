const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const toast = (message) => {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
};

function addActivity(title, category = "Workspace") {
  const list = $("#activityList");
  if (!list) return;
  const row = document.createElement("div");
  row.className = "activity";
  const mark = document.createElement("span"); mark.className = "activity-mark"; mark.textContent = "◈";
  const content = document.createElement("div");
  const heading = document.createElement("b"); heading.textContent = title;
  const meta = document.createElement("small"); meta.textContent = `Just now · ${category}`;
  content.append(heading, meta); row.append(mark, content); list.prepend(row);
  while (list.children.length > 6) list.lastElementChild.remove();
}

function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleTimeString([], {hour12:false});
  $("#date").textContent = now.toLocaleDateString([], {day:"2-digit", month:"short", year:"numeric"});
}
updateClock(); setInterval(updateClock, 1000);

function showView(name) {
  const target = $(`#view-${name}`);
  if (!target) return;
  $$(".view").forEach(view => view.classList.toggle("active", view === target));
  $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.view === name));
  $("#crumb").textContent = name === "security" ? "Cyber Lab" : name === "study" ? "Study Centre" : name.charAt(0).toUpperCase() + name.slice(1);
  $("#sidebar").classList.remove("open");
  addActivity(`${$("#crumb").textContent} opened`);
}
$$("[data-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
$$("[data-goto]").forEach(button => button.addEventListener("click", () => showView(button.dataset.goto)));
$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
$("#clearActivity").addEventListener("click", () => { $("#activityList").replaceChildren(); toast("Activity log cleared"); });

/* Assistant demo: replies are local and rule-based; no messages are transmitted. */
function addMessage(text, who = "assistant") {
  const wrap = document.createElement("div"); wrap.className = `message ${who === "user" ? "user-message" : "assistant-message"}`;
  const avatar = document.createElement("span"); avatar.className = "message-avatar"; avatar.textContent = who === "user" ? "U" : "A";
  const body = document.createElement("div"); const label = document.createElement("small"); label.textContent = who === "user" ? "YOU" : "ASTRA · LOCAL DEMO";
  const p = document.createElement("p"); p.textContent = text; body.append(label, p); wrap.append(avatar, body);
  $("#chatMessages").append(wrap); $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
}
function localReply(message) {
  const q = message.toLowerCase();
  if (q.includes("plan") || q.includes("day")) return "Let's make your day manageable: choose one important task, two smaller tasks, and a realistic break. Add them in the Study Centre so you can track your progress.";
  if (q.includes("study") || q.includes("checklist")) return "A useful study cycle is: set one clear goal, learn a small section, close your notes and recall the key ideas, then solve a few questions. You can add each step as a task in the Study Centre.";
  if (q.includes("cyber") || q.includes("security")) return "Start with the fundamentals: strong unique passphrases, multi-factor authentication, software updates, backups and careful app permissions. Use the Cyber Lab for safe demonstrations.";
  if (q.includes("hello") || q.includes("hi ")) return "Hello, Operator. ASTRA's local interface is ready. What would you like to explore?";
  return "I received your message in this local demo. Live AI responses are not connected yet. The interface is working; a future AI connection should be added through a secure backend so private API keys never appear in public browser code.";
}
$("#chatForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("#chatInput"); const message = input.value.trim(); if (!message) return;
  addMessage(message, "user"); input.value = "";
  setTimeout(() => addMessage(localReply(message)), 350); addActivity("Assistant message sent", "AI Assistant");
});
$("#clearChat").addEventListener("click", () => {
  $("#chatMessages").replaceChildren();
  addMessage("Conversation cleared. I'm ready for a new topic."); toast("Chat cleared");
});
$$(".prompt-chip").forEach(button => button.addEventListener("click", () => {
  $("#chatInput").value = button.textContent; $("#chatInput").focus();
}));

/* Safe password-quality teaching aid. Input is assessed in memory only. */
$("#passDemo").addEventListener("input", e => {
  const value = e.target.value; let score = 0;
  if (value.length >= 12) score++;
  if (value.length >= 18) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const labels = ["Waiting for input","Very short","Needs improvement","Fair","Good","Long & varied"];
  const colors = ["#294156","#e17b79","#e6a45d","#e6c66a","#75c9a6","#55d9ed"];
  $("#strengthBar").style.width = `${score * 20}%`;
  $("#strengthBar").style.background = colors[score];
  $("#strengthText").textContent = value.length ? labels[score] : labels[0];
  $("#strengthBits").textContent = value.length ? `${value.length} characters` : "—";
});
$("#runSim").addEventListener("click", () => {
  const output = $("#simOutput");
  output.innerHTML = '<span class="ok">✓ Simulation started</span><br>Example router · 192.0.2.1 · Sample only<br>Example laptop · 192.0.2.10 · Sample only<br>Example tablet · 192.0.2.11 · Sample only<br><span class="ok">✓ Finished — no real network activity occurred.</span>';
  addActivity("Network concepts simulation completed", "Cyber Lab");
});

/* Educational command console; never passes commands to the operating system. */
const terminalOutput = $("#terminalOutput");
function termLine(text, className = "") {
  const p = document.createElement("p"); if (className) p.className = className; p.textContent = text; terminalOutput.append(p); terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
$("#terminalForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("#terminalInput"); const command = input.value.trim().toLowerCase(); if (!command) return;
  termLine(`astra@local:~$ ${command}`, "term-command"); input.value = "";
  const responses = {
    help: ["Available local commands: help, status, time, modules, clear", "This console is a learning simulation, not a system shell."],
    status: ["ASTRA CORE: ONLINE", "SECURITY MODE: SAFE SIMULATION", "EXTERNAL DEVICE ACCESS: DISABLED"],
    time: [`Local time: ${new Date().toLocaleString()}`],
    modules: ["Overview · AI Assistant · Cyber Lab · Devices · Terminal · Study Centre"]
  };
  if (command === "clear") { terminalOutput.replaceChildren(); return; }
  (responses[command] || ["Command not recognised. Type help to see available commands."]).forEach(line => termLine(line, "term-muted"));
  addActivity(`Terminal command: ${command}`, "Terminal");
});
$("#clearTerminal").addEventListener("click", () => { terminalOutput.replaceChildren(); toast("Terminal cleared"); });

/* Study checklist is kept in this page session only. */
let tasks = [];
function renderTasks() {
  const list = $("#taskList"); list.replaceChildren();
  const done = tasks.filter(t => t.done).length;
  $("#taskCount").textContent = String(done).padStart(2, "0");
  $("#taskProgress").textContent = `${done} / ${tasks.length} DONE`;
  if (!tasks.length) { const empty = document.createElement("div"); empty.className = "empty-state"; empty.textContent = "No tasks yet. Add one small goal to get started."; list.append(empty); return; }
  tasks.forEach(task => {
    const row = document.createElement("label"); row.className = `task-row${task.done ? " done" : ""}`;
    const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.checked = task.done;
    checkbox.addEventListener("change", () => { task.done = checkbox.checked; renderTasks(); if (task.done) addActivity("Study task completed", "Study Centre"); });
    const text = document.createElement("span"); text.textContent = task.text;
    const del = document.createElement("button"); del.type = "button"; del.className = "delete-task"; del.textContent = "×"; del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", e => { e.preventDefault(); tasks = tasks.filter(t => t.id !== task.id); renderTasks(); });
    row.append(checkbox, text, del); list.append(row);
  });
}
$("#taskForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("#taskInput"); const value = input.value.trim(); if (!value) return;
  tasks.push({id: Date.now() + Math.random(), text: value, done:false}); input.value = ""; renderTasks(); addActivity("Study task added", "Study Centre");
});

/* 25-minute focus timer. */
let remaining = 25 * 60, timerId = null;
function displayTimer() { $("#timerDisplay").textContent = `${String(Math.floor(remaining / 60)).padStart(2,"0")}:${String(remaining % 60).padStart(2,"0")}`; }
$("#timerStart").addEventListener("click", () => {
  if (timerId) { clearInterval(timerId); timerId = null; $("#timerStart").textContent = "Resume focus"; return; }
  $("#timerStart").textContent = "Pause";
  timerId = setInterval(() => {
    remaining--; displayTimer();
    if (remaining <= 0) { clearInterval(timerId); timerId = null; remaining = 0; $("#timerStart").textContent = "Start again"; toast("Focus session complete. Take a short break."); addActivity("Focus session completed", "Study Centre"); }
  }, 1000);
});
$("#timerReset").addEventListener("click", () => { if (timerId) clearInterval(timerId); timerId = null; remaining = 25 * 60; displayTimer(); $("#timerStart").textContent = "Start focus"; });
renderTasks(); displayTimer();
