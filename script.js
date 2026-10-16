/* SCRIPT UNDANGAN ANISA & EKO */
(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const weddingDate = new Date(2027, 10, 20, 10, 0, 0); // 20 November 2027, 10.00 WIB
  const whatsappNumber = "6281234567890"; // Ganti dengan nomor WhatsApp tujuan yang benar

  function init() {
    const cover = byId("cover");
    const invitation = byId("invitation");
    const openButton = byId("openInvitation");
    const music = byId("weddingMusic");
    const musicToggle = byId("musicToggle");
    const guestNameElement = byId("guestName");

    if (!cover || !invitation || !openButton) {
      console.error("Elemen undangan tidak ditemukan. Pastikan index.html yang dipakai adalah versi terbaru.");
      return;
    }

    // Nama tamu dari URL, contoh: ?to=Keluarga%20Bapak
    const guestName = new URLSearchParams(window.location.search).get("to");
    if (guestNameElement && guestName) guestNameElement.textContent = guestName;

    // Delegasi klik membuat tombol tetap berfungsi walau ada animasi dekoratif.
    document.addEventListener("click", async (event) => {
      const target = event.target instanceof Element ? event.target.closest("#openInvitation") : null;
      if (!target) return;
      event.preventDefault();
      cover.classList.add("hidden");
      invitation.classList.remove("hidden");
      if (musicToggle) musicToggle.classList.remove("hidden");
      document.body.classList.add("invitation-open");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (music) {
        try { await music.play(); }
        catch (error) { console.info("Musik tidak diputar otomatis; pengunjung bisa menekan tombol musik.", error); }
      }
    });

    if (musicToggle && music) {
      musicToggle.addEventListener("click", async () => {
        if (music.paused) {
          try { await music.play(); musicToggle.textContent = "♫"; }
          catch (error) { alert("Musik belum bisa diputar. Pastikan file assets/musik.mp3 tersedia."); }
        } else {
          music.pause(); musicToggle.textContent = "♪";
        }
      });
    }

    // Hitung mundur menuju akad.
    const days = byId("days"), hours = byId("hours"), minutes = byId("minutes"), seconds = byId("seconds");
    function updateCountdown() {
      if (!days || !hours || !minutes || !seconds) return;
      const diff = weddingDate.getTime() - Date.now();
      const safe = Math.max(0, diff);
      days.textContent = String(Math.floor(safe / 86400000)).padStart(2, "0");
      hours.textContent = String(Math.floor((safe / 3600000) % 24)).padStart(2, "0");
      minutes.textContent = String(Math.floor((safe / 60000) % 60)).padStart(2, "0");
      seconds.textContent = String(Math.floor((safe / 1000) % 60)).padStart(2, "0");
    }
    updateCountdown(); setInterval(updateCountdown, 1000);

    // Salin nomor rekening.
    const copyButton = byId("copyAccount");
    if (copyButton) copyButton.addEventListener("click", async () => {
      const account = (byId("accountNumber")?.textContent || "").trim();
      if (!account) return;
      try {
        await navigator.clipboard.writeText(account);
        copyButton.textContent = "Nomor Berhasil Disalin!";
      } catch (error) {
        window.prompt("Salin nomor rekening berikut:", account);
      }
      setTimeout(() => { copyButton.textContent = "Salin Nomor Rekening"; }, 2500);
    });

    // RSVP ke WhatsApp. Bila file Firebase juga mengelola formulir ini,
    // hindari menggandakan handler di firebase-guestbook.js.
    const rsvpForm = byId("rsvpForm");
    if (rsvpForm) rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = (byId("name")?.value || "").trim();
      const attendance = byId("attendance")?.value || "";
      const message = (byId("message")?.value || "").trim();
      if (!name || !attendance) { alert("Mohon isi nama dan konfirmasi kehadiran."); return; }
      const body = ["Assalamu'alaikum, saya ingin mengonfirmasi undangan pernikahan.", "", "Nama: " + name, "Konfirmasi: " + attendance, "Ucapan dan doa: " + (message || "-"), "", "Terima kasih."].join("\n");
      window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(body), "_blank", "noopener,noreferrer");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
