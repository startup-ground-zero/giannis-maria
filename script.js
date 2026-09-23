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
const whatsappNumbers = ["306986320398"];

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
}

if (partySizeSelect && guestFields) {
  partySizeSelect.addEventListener("change", renderGuestFields);
}

const rsvpForm = document.querySelector("#rsvp-form");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#form-message");
  const formData = new FormData(event.currentTarget);
  const guestName = formData.get("name");
  const partySize = formData.get("party_size");
  const guests = [];
  for (let index = 1; index <= Number.parseInt(partySize, 10); index += 1) {
    guests.push(`${formData.get(`guest_first_name_${index}`)} ${formData.get(`guest_surname_${index}`)}`);
  }
  const whatsappText = [
    "Νέα απάντηση γάμου:",
    `Όνομα επικοινωνίας: ${guestName}`,
    `Απάντηση: ${formData.get("attendance")}`,
    `Άτομα: ${partySize}`,
    `Καλεσμένοι: ${guests.join(", ")}`,
    `Σημείωση: ${formData.get("note") || "-"}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumbers[0]}?text=${encodeURIComponent(whatsappText)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  message.textContent = `Ευχαριστούμε, ${guestName}. Η απάντησή σου είναι έτοιμη για αποστολή στο WhatsApp.`;
  event.currentTarget.reset();
  });
}
