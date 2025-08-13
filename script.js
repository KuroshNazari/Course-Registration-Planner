const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"];
const hours = ["07:30", "09:00", "10:30", "13:30", "15:00", "17:00"];

/* ---------- Save / Load ---------- */
function saveSchedule() {
    const schedule = { options: {}, chosen: {} };

    // Save options as array of {title, code}
    document.querySelectorAll("#optionsTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        const options = [...cell.querySelectorAll(".option")].map(o => ({
            title: o.dataset.title || "",
            code: o.dataset.code || ""
        }));
        if (options.length) schedule.options[key] = options;
    });

    // Save chosen as {title, code}
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

    // Load options
    document.querySelectorAll("#optionsTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (data.options[key]) {
            data.options[key].forEach(item => {
                // Backward compatibility if item is string
                if (typeof item === "string") {
                    addOptionElement(cell, item, "");
                } else {
                    addOptionElement(cell, item.title || "", item.code || "");
                }
            });
        }
    });

    // Load chosen
    document.querySelectorAll("#chosenTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (data.chosen[key]) {
            const item = data.chosen[key];
            if (typeof item === "string") {
                setChosen(cell, { title: item, code: "" });
            } else {
                setChosen(cell, { title: item.title || "", code: item.code || "" });
            }
        }
    });
}

/* ---------- Build Tables ---------- */
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
                    const title = prompt("عنوان گزینه را وارد کنید:");
                    if (!title) return;
                    const code = prompt("کد عددی را وارد کنید:");
                    if (code === null) return; // allow empty but not cancel
                    addOptionElement(cell, title, code);
                    saveSchedule();
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

/* ---------- Option Elements ---------- */
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
        moveToChosen(cell, { title, code });
    };

    // Insert before the add button (last child)
    cell.insertBefore(option, cell.lastChild);
}

function moveToChosen(cell, item) {
    const chosenCell = [...document.querySelectorAll("#chosenTable .cell")]
        .find(c => c.dataset.day === cell.dataset.day && c.dataset.hour === cell.dataset.hour);
    setChosen(chosenCell, item);
    saveSchedule();
}

function setChosen(cell, item) {
    const { title, code } = item;
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

/* ---------- Contact Form ---------- */
function openContactForm() {
    document.getElementById("contactModal").style.display = "flex";
}
function closeContactForm() {
    document.getElementById("contactModal").style.display = "none";
}
function submitContact() {
    alert("پیام ارسال شد!");
    closeContactForm();
}
// Close on backdrop
window.addEventListener('click', (e) => {
    const modal = document.getElementById("contactModal");
    if (e.target === modal) closeContactForm();
});

/* ---------- Dark / Light Mode Toggle (toggler) ---------- */
const modeSwitch = document.getElementById('modeSwitch');
modeSwitch.addEventListener('change', () => {
    document.body.classList.toggle("dark", modeSwitch.checked);
});

/* ---------- Init ---------- */
createTable("optionsTable", false);
createTable("chosenTable", true);
loadSchedule();
