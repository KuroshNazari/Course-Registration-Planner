document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
        const res = await fetch("https://formspree.io/f/xpwlqyob", {
            method: "POST",
            body: data,
            headers: {'Accept': 'application/json'}
        });

        if (res.ok) {
            form.reset();
            closeContactForm();
            openModal('successModal');
        } else {
            openModal('errorModal');
        }
    } catch {
        openModal('errorModal');
    }
});

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}
