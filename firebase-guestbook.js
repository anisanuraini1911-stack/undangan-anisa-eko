import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsEZKFm3cnnXehPgTqV4PpRFz9Whie3M0",
  authDomain: "undangan-98d0f.firebaseapp.com",
  projectId: "undangan-98d0f",
  storageBucket: "undangan-98d0f.firebasestorage.app",
  messagingSenderId: "332240729195",
  appId: "1:332240729195:web:9e707707ffbd76a8bbad2e",
  measurementId: "G-ZC718ZQZTC"
};

const statusEl = document.getElementById("rsvpStatus");
const guestbookList = document.getElementById("guestbookList");
const form = document.getElementById("rsvpForm");

function showStatus(message) { if (statusEl) statusEl.textContent = message; }

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const ucapanCollection = collection(db, "ucapan");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const attendance = document.getElementById("attendance").value;
    const message = document.getElementById("message").value.trim();
    if (!name || !attendance) { showStatus("Mohon isi nama dan konfirmasi kehadiran."); return; }
    if (name.length > 100 || message.length > 1000) { showStatus("Nama maksimal 100 karakter dan ucapan maksimal 1.000 karakter."); return; }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = "Mengirim..."; showStatus("");
    try {
      await addDoc(ucapanCollection, { nama: name, kehadiran: attendance, ucapan: message, waktu: serverTimestamp() });
      showStatus("Terima kasih! Konfirmasi dan ucapan berhasil dikirim.");
      form.reset();
    } catch (error) {
      console.error("Gagal menyimpan RSVP ke Firebase:", error);
      showStatus("Belum berhasil dikirim. Periksa koneksi atau aturan keamanan Firebase.");
    } finally { button.disabled = false; button.textContent = "Kirim Konfirmasi & Ucapan"; }
  });

  if (guestbookList) {
    const q = query(ucapanCollection, orderBy("waktu", "desc"));
    onSnapshot(q, (snapshot) => {
      guestbookList.replaceChildren();
      if (snapshot.empty) { const p = document.createElement("p"); p.textContent = "Belum ada ucapan. Jadilah yang pertama memberikan doa!"; guestbookList.appendChild(p); return; }
      snapshot.forEach((item) => {
        const data = item.data(); const card = document.createElement("article"); card.className = "guestbook-card";
        const heading = document.createElement("div"); heading.className = "guestbook-card-heading";
        const name = document.createElement("strong"); name.textContent = data.nama || "Tamu";
        const attendance = document.createElement("span"); attendance.className = "guestbook-attendance"; attendance.textContent = data.kehadiran || "";
        heading.append(name, attendance); card.appendChild(heading);
        if (data.ucapan) { const p = document.createElement("p"); p.className = "guestbook-message"; p.textContent = data.ucapan; card.appendChild(p); }
        guestbookList.appendChild(card);
      });
    }, (error) => { console.error("Gagal memuat buku tamu:", error); guestbookList.textContent = "Ucapan belum dapat dimuat. Coba muat ulang halaman."; });
  }
} catch (error) {
  console.error("Firebase tidak berhasil dimuat:", error);
  showStatus("Fitur buku tamu belum tersambung, tetapi undangan tetap bisa dibuka.");
  if (guestbookList) guestbookList.textContent = "Buku tamu sementara tidak tersedia.";
}
