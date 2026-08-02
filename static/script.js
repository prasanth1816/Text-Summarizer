const form = document.getElementById("wire-form");
const dialogueInput = document.getElementById("dialogue-input");
const sendBtn = document.getElementById("send-btn");
const wordCountEl = document.getElementById("word-count");
const summaryEl = document.getElementById("summary-text");
const stampEl = document.getElementById("stamp");
const stampPctEl = document.getElementById("stamp-pct");
const chargeEl = document.getElementById("charge");
const morseEl = document.getElementById("morse");
const copyBtn = document.getElementById("copy-btn");
const lampEl = document.getElementById("lamp");
const statusTextEl = document.getElementById("status-text");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SAMPLES = {
    trip:
        "Emma: Hey everyone! Are we still planning the weekend trip?\n" +
        "Liam: Definitely. I already checked the weather, sunny on Saturday.\n" +
        "Sophia: Great! Where are we going finally?\n" +
        "Emma: I think the hill station is the best choice, it's a three-hour drive.\n" +
        "Noah: I agree. The beach will probably be too crowded.\n" +
        "Liam: I can drive, my car has space for five people.\n" +
        "Emma: Perfect, we are six though.\n" +
        "Sophia: My brother said we could borrow his SUV if needed.",
    meeting:
        "Alex: Hi Sam, can we move tomorrow's 10am meeting?\n" +
        "Sam: Sure, what time works for you?\n" +
        "Alex: How about 2pm instead?\n" +
        "Sam: Works for me, I'll update the calendar invite.\n" +
        "Alex: Thanks, also can you loop in Priya?\n" +
        "Sam: Yes, adding her now.",
    grocery:
        "Mia: Are you heading to the store today?\n" +
        "Jake: Yeah, in about an hour. Need anything?\n" +
        "Mia: Milk, eggs, and bread please.\n" +
        "Jake: Got it, anything else?\n" +
        "Mia: Maybe some coffee if they have dark roast.\n" +
        "Jake: Will check, see you soon.",
};

// ----- word counter -----
function updateWordCount() {
    const words = dialogueInput.value.trim().split(/\s+/).filter(Boolean).length;
    wordCountEl.textContent = `${words} word${words === 1 ? "" : "s"}`;
}
dialogueInput.addEventListener("input", updateWordCount);
updateWordCount();

// ----- quick-fill chips -----
document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
        dialogueInput.value = SAMPLES[chip.dataset.sample] || "";
        updateWordCount();
        dialogueInput.focus();
    });
});

// ----- line status lamp -----
async function checkLine() {
    try {
        const res = await fetch("/health");
        if (res.ok) {
            lampEl.className = "lamp online";
            statusTextEl.textContent = "LINE OPEN";
            return;
        }
        throw new Error("bad status");
    } catch {
        lampEl.className = "lamp offline";
        statusTextEl.textContent = "LINE DOWN";
    }
}
checkLine();

// ----- teletype reveal -----
function printSummary(text) {
    summaryEl.classList.remove("placeholder");
    summaryEl.textContent = "";
    summaryEl.classList.add("printing");

    if (prefersReducedMotion) {
        summaryEl.textContent = text;
        summaryEl.classList.remove("printing");
        revealStamp();
        return;
    }

    let i = 0;
    const speed = 16; // ms per character
    const timer = setInterval(() => {
        summaryEl.textContent += text[i];
        i += 1;
        if (i >= text.length) {
            clearInterval(timer);
            summaryEl.classList.remove("printing");
            revealStamp();
        }
    }, speed);
}

function revealStamp() {
    stampEl.classList.add("show");
}

// ----- form submit -----
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dialogue = dialogueInput.value.trim();
    if (!dialogue) return;

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    stampEl.classList.remove("show");
    summaryEl.textContent = "";
    summaryEl.classList.remove("placeholder");
    morseEl.hidden = false;
    chargeEl.textContent = "charged: — words";

    try {
        const response = await fetch("/summarize/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dialogue }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        const summary = data.summary || "No summary returned.";

        morseEl.hidden = true;

        const originalWords = dialogue.split(/\s+/).filter(Boolean).length;
        const summaryWords = summary.split(/\s+/).filter(Boolean).length;
        const pct = originalWords > 0
            ? Math.max(0, Math.round(100 * (1 - summaryWords / originalWords)))
            : 0;

        stampPctEl.textContent = `${pct}% SHORTER`;
        chargeEl.textContent = `charged: ${summaryWords} words`;

        printSummary(summary);
    } catch (err) {
        morseEl.hidden = true;
        summaryEl.classList.remove("printing");
        summaryEl.textContent = `Transmission failed: ${err.message}`;
        chargeEl.textContent = "charged: — words";
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send ▸";
    }
});

// ----- copy button -----
copyBtn.addEventListener("click", async () => {
    const text = summaryEl.textContent.trim();
    if (!text || text.startsWith("Your condensed message")) return;
    try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => (copyBtn.textContent = original), 1500);
    } catch {
        // clipboard API unavailable — fail silently, text is still selectable
    }
}