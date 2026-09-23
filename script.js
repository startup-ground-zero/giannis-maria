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
    const label = document.createElement("label");
    label.textContent = `Άτομο ${index}`;
    const input = document.createElement("input");
    input.type = "text";
    input.name = `guest_name_${index}`;
    input.placeholder = `Όνομα ατόμου ${index}`;
    input.required = true;
    label.append(input);
    guestFields.append(label);
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
  message.textContent = `Ευχαριστούμε, ${guestName}. Η απάντησή σου για ${partySize} καταχωρήθηκε.`;
  event.currentTarget.reset();
  });
}
