
/* =====================================
   PENGATURAN UNDANGAN
===================================== */

// Ganti dengan tanggal dan jam acara yang sebenarnya.
// Format: Tahun, Bulan (0 = Januari), Tanggal, Jam, Menit
const weddingDate = new Date(2026, 11, 20, 8, 0, 0);

// Ganti dengan nomor WhatsApp kamu.
// Gunakan kode negara 62, tanpa tanda + atau angka 0 di depan.
const whatsappNumber = "6281234567890";


/* =====================================
   NAMA TAMU DARI LINK
===================================== */

const params = new URLSearchParams(window.location.search);
const guestName = params.get("to");

const guestNameElement = document.getElementById("guestName");

if (guestName) {
  guestNameElement.textContent = guestName;
}


/* =====================================
   BUKA UNDANGAN
===================================== */

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

openButton.addEventListener("click", async () => {
  cover.classList.add("hidden");
  invitation.classList.remove("hidden");
  musicToggle.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // Browser mungkin menolak audio jika file belum tersedia.
  try {
    await music.play();
    musicToggle.textContent = "♫";
  } catch (error) {
    console.log("Musik belum dapat diputar:", error);
  }
});


/* =====================================
   TOMBOL MUSIK
===================================== */

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.textContent = "♫";
    } catch (error) {
      alert("Musik belum dapat diputar. Periksa file musik.mp3.");
    }
  } else {
    music.pause();
    musicToggle.textContent = "♪";
  }
});


/* =====================================
   COUNTDOWN
===================================== */

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =====================================
   SALIN NOMOR REKENING
===================================== */

const copyButton = document.getElementById("copyAccount");

copyButton.addEventListener("click", async () => {
  const accountNumber = document
    .getElementById("accountNumber")
    .textContent.trim();

  try {
    await navigator.clipboard.writeText(accountNumber);
    copyButton.textContent = "Nomor Berhasil Disalin!";
  } catch (error) {
    // Cadangan jika Clipboard API tidak tersedia.
    window.prompt("Salin nomor rekening berikut:", accountNumber);
  }

  setTimeout(() => {
    copyButton.textContent = "Salin Nomor Rekening";
  }, 2500);
});


/* =====================================
   RSVP MELALUI WHATSAPP
===================================== */

const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const attendance = document.getElementById("attendance").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !attendance) {
    alert("Mohon isi nama dan konfirmasi kehadiran.");
    return;
  }

  const text = [
    "Assalamu'alaikum, saya ingin mengonfirmasi undangan pernikahan.",
    "",
    "Nama: " + name,
    "Konfirmasi: " + attendance,
    "Ucapan dan doa: " + (message || "-"),
    "",
    "Terima kasih."
  ].join("\n");

  const whatsappURL =
  "https://wa.me/" +
  whatsappNumber +
  "?text=" +
  encodeURIComponent(text);

window.open(whatsappURL, "_blank", "noopener,noreferrer");
});