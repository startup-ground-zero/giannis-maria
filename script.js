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

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#form-message");
  const guestName = new FormData(event.currentTarget).get("name");
  message.textContent = `Ευχαριστούμε, ${guestName}. Η απάντησή σου καταχωρήθηκε.`;
  event.currentTarget.reset();
});
