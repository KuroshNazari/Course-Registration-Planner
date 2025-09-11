const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"];
const hours = ["۰۷:۳۰", "۰۹:۰۰", "۱۰:۳۰", "۱۳:۳۰", "۱۵:۰۰", "۱۷:۰۰"];
let currentCell = null;

/* Save / Load */
function saveSchedule() {
    const schedule = {options: {}, chosen: {}};
    document.querySelectorAll("#optionsTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        const options = [...cell.querySelectorAll(".option")].map(o => ({
            title: o.dataset.title || "",
            code: o.dataset.code || ""
        }));
        if (options.length) schedule.options[key] = options;
    });
    document.querySelectorAll("#chosenTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (cell.dataset.chosenTitle || cell.dataset.chosenCode) {
            schedule.chosen[key] = {
                title: cell.dataset.chosenTitle || "",
                code: cell.dataset.chosenCode || ""
            };
        }
    });
    localStorage.setItem("schedule", JSON.stringify(schedule));
}
function loadSchedule() {
    const saved = localStorage.getItem("schedule");
    if (!saved) return;
    const data = JSON.parse(saved);
    document.querySelectorAll("#optionsTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (data.options[key]) {
            data.options[key].forEach(item => {
                if (typeof item === "string") {
                    addOptionElement(cell, item, "");
                } else {
                    addOptionElement(cell, item.title || "", item.code || "");
                }
            });
        }
    });
    document.querySelectorAll("#chosenTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (data.chosen[key]) {
            const item = data.chosen[key];
            if (typeof item === "string") {
                setChosen(cell, {title: item, code: ""});
            } else {
                setChosen(cell, {title: item.title || "", code: item.code || ""});
            }
        }
    });
}

/* Build Tables */
function createTable(container, isChosen) {
    const table = document.getElementById(container);
    table.innerHTML = '';
    table.appendChild(createCell("", "header"));
    hours.forEach(hour => table.appendChild(createCell(hour, "header")));
    days.forEach(day => {
        table.appendChild(createCell(day, "header"));
        hours.forEach(hour => {
            const cell = createCell("", "cell");
            cell.dataset.day = day;
            cell.dataset.hour = hour;
            if (!isChosen) {
                const addBtn = document.createElement("button");
                addBtn.className = "add-btn";
                addBtn.innerText = "+";
                addBtn.onclick = (e) => {
                    e.stopPropagation();
                    currentCell = cell;
                    openOptionForm();
                };
                cell.appendChild(addBtn);
            }
            table.appendChild(cell);
        });
    });
}
function createCell(text, className) {
    const div = document.createElement("div");
    div.className = className;
    if (text) div.innerText = text;
    return div;
}

/* Option Functions */
function addOptionElement(cell, title, code) {
    const option = document.createElement("div");
    option.className = "option";
    option.dataset.title = title;
    option.dataset.code = code;
    const t = document.createElement("div");
    t.className = "title";
    t.textContent = title;
    const c = document.createElement("div");
    c.className = "code";
    c.textContent = code ? `${code}` : "-";
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.innerText = "×";
    del.onclick = (e) => {
        e.stopPropagation();
        option.remove();
        saveSchedule();
    };
    option.appendChild(t);
    option.appendChild(c);
    option.appendChild(del);
    option.onclick = (e) => {
        e.stopPropagation();
        moveToChosen(cell, {title, code});
    };
    cell.insertBefore(option, cell.lastChild);
}
function moveToChosen(cell, item) {
    const chosenCell = [...document.querySelectorAll("#chosenTable .cell")]
        .find(c => c.dataset.day === cell.dataset.day && c.dataset.hour === cell.dataset.hour);
    setChosen(chosenCell, item);
    saveSchedule();
}
function setChosen(cell, item) {
    const {title, code} = item;
    cell.innerHTML = '';
    cell.dataset.chosenTitle = title;
    cell.dataset.chosenCode = code || "";
    const t = document.createElement("div");
    t.className = "title";
    t.textContent = title;
    const c = document.createElement("div");
    c.className = "code";
    c.textContent = code ? `${code}` : "-";
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.innerText = "×";
    del.onclick = (e) => {
        e.stopPropagation();
        cell.innerHTML = "";
        delete cell.dataset.chosenTitle;
        delete cell.dataset.chosenCode;
        saveSchedule();
    };
    cell.appendChild(t);
    cell.appendChild(c);
    cell.appendChild(del);
}

/* Contact Form */
function openContactForm() {
    document.getElementById("contactModal").style.display = "flex";
}
function closeContactForm() {
    document.getElementById("contactModal").style.display = "none";
}

/* Add Option Form */
function openOptionForm() {
    document.getElementById("optionModal").style.display = "flex";
}
function closeOptionForm() {
    document.getElementById("optionModal").style.display = "none";
}
function submitOption() {
    const title = document.getElementById("optionTitle").value.trim();
    const code = document.getElementById("optionCode").value.trim();
    if (!title) return;
    addOptionElement(currentCell, title, code);
    saveSchedule();
    closeOptionForm();
    document.getElementById("optionTitle").value = "";
    document.getElementById("optionCode").value = "";
}

/* Close on backdrop */
window.addEventListener('click', (e) => {
    const modals = [document.getElementById("contactModal"), document.getElementById("optionModal")];
    modals.forEach(m => {
        if (e.target === m) m.style.display = "none";
    });
});

/* Dark / Light Toggle */
document.getElementById('modeSwitch').addEventListener('change', (e) => {
    document.body.classList.toggle("dark", e.target.checked);
});


/* Init */
createTable("optionsTable", false);
createTable("chosenTable", true);
loadSchedule();