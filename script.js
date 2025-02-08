const days = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه"];
const hours = ["07:30", "09:00", "10:30", "13:30", "15:00"];

function saveSchedule() {
    const schedule = { options: {}, chosen: {} };

    // Save options
    document.querySelectorAll("#optionsTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        const options = [...cell.children]
            .filter(child => child.classList.contains("option"))
            .map(option => option.innerText.replace("×", "").trim()); // Remove delete button text
        
        if (options.length > 0) {
            schedule.options[key] = options;
        }
    });

    // Save chosen
    document.querySelectorAll("#chosenTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        const text = cell.innerText.replace("×", "").trim(); // Remove delete button text

        if (text) {
            schedule.chosen[key] = text;
        }
    });

    localStorage.setItem("schedule", JSON.stringify(schedule));
}

function loadSchedule() {
    const savedData = localStorage.getItem("schedule");
    if (!savedData) return;
    
    const data = JSON.parse(savedData);

    // Load options table
    document.querySelectorAll("#optionsTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (data.options[key]) {
            data.options[key].forEach(optionText => {
                const option = document.createElement("div");
                option.className = "option";
                option.innerText = optionText;

                const deleteBtn = document.createElement("button");
                deleteBtn.innerText = "×";
                deleteBtn.className = "delete-btn";
                deleteBtn.onclick = (event) => {
                    event.stopPropagation();
                    option.remove();
                    saveSchedule();
                };

                option.appendChild(deleteBtn);
                option.onclick = (event) => {
                    event.stopPropagation();
                    moveToChosen(cell, optionText);
                };

                cell.insertBefore(option, cell.lastChild);
            });
        }
    });

    // Load chosen table
    document.querySelectorAll("#chosenTable .cell").forEach(cell => {
        const key = `${cell.dataset.day}-${cell.dataset.hour}`;
        if (data.chosen[key]) {
            cell.innerHTML = data.chosen[key];

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "×";
            deleteBtn.className = "delete-btn";
            deleteBtn.onclick = (event) => {
                event.stopPropagation();
                cell.innerHTML = "";
                saveSchedule();
            };

            cell.appendChild(deleteBtn);
        }
    });
}

function createTable(container, isChosenTable) {
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
            if (!isChosenTable) {
                const addButton = document.createElement("button");
                addButton.innerText = "+";
                addButton.className = "add-btn";
                addButton.onclick = (event) => {
                    event.stopPropagation();
                    addOption(cell);
                };
                cell.appendChild(addButton);
            }
            table.appendChild(cell);
        });
    });
}

function createCell(text, className) {
    const div = document.createElement("div");
    div.className = className;
    if (text) {
        div.innerText = text;
    }
    return div;
}

function addOption(cell) {
    const optionText = prompt("Enter your option:");
    if (optionText) {
        const option = document.createElement("div");
        option.className = "option";
        option.innerText = optionText;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            option.remove();
            saveSchedule();
        };
        
        option.appendChild(deleteBtn);
        option.onclick = (event) => {
            event.stopPropagation();
            moveToChosen(cell, optionText);
        };
        cell.insertBefore(option, cell.lastChild);
        saveSchedule();
    }
}

function moveToChosen(cell, optionText) {
    const { day, hour } = cell.dataset;
    const chosenTable = document.getElementById("chosenTable");
    const chosenCell = [...chosenTable.children].find(c => c.dataset?.day === day && c.dataset?.hour === hour);
    
    if (chosenCell) {
        chosenCell.innerHTML = optionText;
        chosenCell.dataset.day = day;
        chosenCell.dataset.hour = hour;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            chosenCell.innerHTML = "";
            saveSchedule();
        };
        chosenCell.appendChild(deleteBtn);
        saveSchedule();
    }
}
function captureScreenshot(tableId) {
    const table = document.getElementById(tableId);
    const padding = 20; // Adjust padding as needed

    html2canvas(table, {
        backgroundColor: null // Keeps transparency
    }).then(canvas => {
        // Create a new canvas with padding
        const newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");

        // Set new canvas size (original + padding)
        newCanvas.width = canvas.width + 2 * padding;
        newCanvas.height = canvas.height + 2 * padding;

        // Fill background (optional)
        ctx.fillStyle = "#ffffff"; // Change color if needed
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Draw the original image on the new canvas with padding
        ctx.drawImage(canvas, padding, padding);

        // Create a download link
        const link = document.createElement("a");
        link.href = newCanvas.toDataURL("image/png");
        link.download = tableId + ".png";
        link.click();
    });
}



// Initialize the tables and load stored data
createTable("optionsTable", false);
createTable("chosenTable", true);
loadSchedule();