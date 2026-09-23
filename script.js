const weddingDate = new Date("2027-07-18T16:00:00+03:00");
const countdownUnits = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function updateCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownUnits.days.textContent = String(days).padStart(3, "0");
  countdownUnits.hours.textContent = String(hours).padStart(2, "0");
  countdownUnits.minutes.textContent = String(minutes).padStart(2, "0");
  countdownUnits.seconds.textContent = String(seconds).padStart(2, "0");
}

if (countdownUnits.days) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού");
  });
}

const partySizeSelect = document.querySelector('select[name="party_size"]');
const guestFields = document.querySelector("#guest-fields");
const attendanceSelect = document.querySelector('select[name="attendance"]');
const contactNameInput = document.querySelector('input[name="name"]');
const attendanceStatus = document.querySelector("#attendance-status");
const whatsappNumbers = ["306986320398"];
const copyRsvpButton = document.querySelector("#copy-rsvp");
const contactActions = document.querySelector("#contact-actions");
const whatsappButton = document.querySelector("#whatsapp-rsvp");
const viberButton = document.querySelector("#viber-rsvp");
const smsButton = document.querySelector("#sms-rsvp");
const rsvpForm = document.querySelector("#rsvp-form");
let latestRsvpMessage = "";

function renderGuestFields() {
  const partySize = Number.parseInt(partySizeSelect.value, 10) || 0;
  guestFields.replaceChildren();

  if (!partySize) {
    return;
  }

  const title = document.createElement("p");
  title.className = "guest-fields-title";
  title.textContent = "Ονόματα καλεσμένων";
  guestFields.append(title);

  for (let index = 1; index <= partySize; index += 1) {
    const title = document.createElement("p");
    title.className = "guest-fields-person";
    title.textContent = `Άτομο ${index}`;
    guestFields.append(title);

    const firstNameLabel = document.createElement("label");
    firstNameLabel.textContent = "Όνομα";
    const firstNameInput = document.createElement("input");
    firstNameInput.type = "text";
    firstNameInput.name = `guest_first_name_${index}`;
    firstNameInput.placeholder = "Όνομα";
    firstNameInput.required = true;
    firstNameLabel.append(firstNameInput);

    const surnameLabel = document.createElement("label");
    surnameLabel.textContent = "Επώνυμο";
    const surnameInput = document.createElement("input");
    surnameInput.type = "text";
    surnameInput.name = `guest_surname_${index}`;
    surnameInput.placeholder = "Επώνυμο";
    surnameInput.required = true;
    surnameLabel.append(surnameInput);

    guestFields.append(firstNameLabel, surnameLabel);
  }

  syncSoloGuestName();
  updateContactButtons();
}

function syncAttendanceState() {
  const declined = attendanceSelect && attendanceSelect.value.includes("Δυστυχώς");

  if (attendanceStatus) {
    attendanceStatus.textContent = attendanceSelect.value
      ? declined ? "❌" : "✅"
      : "";
    attendanceStatus.classList.toggle("is-declined", declined);
    attendanceStatus.classList.toggle("is-accepted", Boolean(attendanceSelect.value) && !declined);
  }

  if (declined) {
    partySizeSelect.value = "";
    guestFields.replaceChildren();
  }

  partySizeSelect.disabled = declined;
  partySizeSelect.required = !declined;
  guestFields.hidden = declined;

  guestFields.querySelectorAll("input").forEach((input) => {
    input.disabled = declined;
    input.required = !declined;
  });

  updateContactButtons();
}

function syncSoloGuestName() {
  if (!partySizeSelect || partySizeSelect.value !== "1" || !contactNameInput) return;
  const nameParts = contactNameInput.value.trim().split(/\s+/).filter(Boolean);
  const firstName = guestFields.querySelector('input[name="guest_first_name_1"]');
  const surname = guestFields.querySelector('input[name="guest_surname_1"]');
  if (firstName) firstName.value = nameParts.shift() || "";
  if (surname) surname.value = nameParts.join(" ");
  updateContactButtons();
}

if (partySizeSelect && guestFields) {
  partySizeSelect.addEventListener("change", renderGuestFields);
}

if (attendanceSelect) {
  attendanceSelect.addEventListener("change", syncAttendanceState);
}

if (contactNameInput) {
  contactNameInput.addEventListener("input", syncSoloGuestName);
}

function buildRsvpMessage() {
  const formData = new FormData(rsvpForm);
  const partySize = Number.parseInt(formData.get("party_size"), 10);
  const attendance = formData.get("attendance");
  const attendanceMark = attendance.includes("Δυστυχώς") ? "✗" : "✓";
  const guests = [];
  for (let index = 1; index <= partySize; index += 1) {
    guests.push(`${formData.get(`guest_first_name_${index}`)} ${formData.get(`guest_surname_${index}`)}`);
  }
  return [
    "Νέα απάντηση γάμου:",
    `Όνομα επικοινωνίας: ${formData.get("name")}`,
    `Κινητό: ${formData.get("phone")}`,
    `Απάντηση: ${attendanceMark} ${attendance}`,
    `Καλεσμένοι: ${guests.join(", ")}`,
    `Σημείωση: ${formData.get("note") || "-"}`
  ].join("\n");
}

function updateContactButtons() {
  if (!rsvpForm) return;
  const isValid = rsvpForm.checkValidity();
  latestRsvpMessage = isValid ? buildRsvpMessage() : "";
  [whatsappButton, viberButton, smsButton, copyRsvpButton].forEach((button) => {
    if (button) button.disabled = !isValid;
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener("input", updateContactButtons);
  rsvpForm.addEventListener("change", updateContactButtons);
}

if (whatsappButton) {
  whatsappButton.addEventListener("click", () => {
    const whatsappUrl = `https://wa.me/${whatsappNumbers[0]}?text=${encodeURIComponent(latestRsvpMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

if (viberButton) {
  viberButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(latestRsvpMessage);
    window.location.href = `viber://chat?number=%2B${whatsappNumbers[0]}`;
  });
}

if (smsButton) {
  smsButton.addEventListener("click", () => {
    window.location.href = `sms:+${whatsappNumbers[0]}?body=${encodeURIComponent(latestRsvpMessage)}`;
  });
}

if (copyRsvpButton) {
  copyRsvpButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(latestRsvpMessage);
    document.querySelector("#form-message").textContent = "Η απάντηση αντιγράφηκε. Μπορείς να τη στείλεις με SMS ή email.";
  });
}
