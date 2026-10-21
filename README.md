# Smart Grocery & Budget Safety Tracker (PWA)

Aplikasi Web Mobile (Progressive Web App) bergaya Native App yang dirancang khusus untuk **siswa/anak rantau** saat berbelanja kebutuhan bulanan di supermarket sambil mendorong troli.

---

## 📱 Arsitektur & Antarmuka Mobile

1. **Format Layar Khusus Smartphone (`max-width: 430px`)**:
   - Tampilan dioptimalkan khusus viewport smartphone (setara layar iPhone Pro Max).
   - Di browser desktop, aplikasi otomatis terpusat (*centered*) dengan siluet bingkai *smartphone frame* modern.
2. **Navigasi Bawah Melayang (*Floating Bottom Navigation Bar*)**:
   - Menu navigasi ramah jempol di bagian bawah dengan ikon **Lucide**:
     - 🛒 **Belanja** (Troli aktif berjalan & kontrol kuantitas realtime)
     - 📋 **Riwayat** (Arsip struk belanja bulanan & basis data pembanding)
     - 🛡️ **Anggaran** (Pusat proteksi limit anggaran & grafik alokasi)
3. **Ergonomi Sentuh Ramah Jempol (*Touch-Friendly Ergonomics*)**:
   - Tidak menggunakan tabel horizontal desktop yang melebar ke samping. Seluruh item disajikan dalam format **Mobile Card** bertumpuk.
   - Stepper kuantitas besar (`+` / `-`) dengan hit-target minimal 48px.
   - Chip penambah nominal harga cepat (+5rb, +10rb, +25rb, +50rb).
   - *Haptic vibration feedback* pada interaksi sentuhan.
4. **Dukungan PWA & Standalone Mode**:
   - Memiliki `manifest.json`, icon high-res vector, dan `sw.js` (Service Worker).
   - Dapat dipasang langsung ke layar utama smartphone (*Add to Home Screen / PWA Standalone*).

---

## ✅ Implementasi Kebutuhan Fungsional (SRS Checklist)

| Kode | Kebutuhan SRS | Implementasi pada Aplikasi |
|---|---|---|
| **F-01** | **Pencatatan Item Belanja** | Form input modal bottom-sheet mencatat nama produk (dengan *autocomplete* riwayat), kategori (Bahan Pokok, Lauk & Protein, Sayur/Buah, Bumbu/Instan, Camilan, Mandi/Cuci, Lainnya), pilihan satuan (`pcs`, `pack`, `kg`, `liter`), kuantitas, dan harga satuan. |
| **F-02** | **Perhitungan Kuantitas Otomatis** | Realtime subtotal: $\text{Total Item} = (\text{Harga Bersih}) \times \text{Kuantitas}$. Update otomatis ketika kuantitas diubah langsung di troli melalui tombol stepper (`+` / `-`). |
| **F-03** | **Kalkulator Diskon Bertingkat** | Menghitung diskon berurutan sesuai kaidah matematika retail: $P_1 = P \times (1 - d_1/100)$, $P_2 = P_1 \times (1 - d_2/100)$. Terdapat preset promo supermarket (50%+20%, 30%+10%, dll.) serta rincian hemat transparan (*Diskon Efektif* & nominal hemat). |
| **F-04** | **Komparator Harga Realtime** | Membandingkan harga satuan yang sedang diinput/dalam troli terhadap harga belanja bulan sebelumnya: <br>• **$\uparrow$ Panah Merah**: Harga naik (beserta nominal selisih & % kenaikan)<br>• **$\downarrow$ Panah Hijau**: Harga turun / lebih murah<br>• **$=$ Abu-abu**: Harga stabil sama dengan bulan lalu<br>• **$\star$ Ungu**: Item baru (belum ada riwayat) |
| **F-05** | **Pengendali Anggaran (Budget Safety)** | Input batas maksimal uang belanja (budget). Kartu pemantau di bagian atas terus memperbarui rasio pengeluaran: <br>• **Aman (Hijau)**: < 75% budget<br>• **Waspada (Kuning)**: 75% - 90% budget<br>• **Kritis (Merah)**: 90% - 100% budget<br>• **Over Budget (Merah Berkedip & Haptic)**: Melebihi anggaran dengan peringatan cerdas dompet anak rantau. |
| **F-06** | **Riwayat & Database Belanja** | Penyimpanan terstruktur di `localStorage`. Saat belanja selesai, transaksi diarsip per tanggal & bulan. Sesi riwayat dapat dimuat kembali sebagai *template* atau ditetapkan sebagai basis komparasi harga (F-04) untuk bulan berikutnya. Terdapat fitur ekspor cadangan JSON. |

## ☁️ Integrasi Firebase Cloud (Firestore)

Aplikasi telah terhubung ke **Firebase Cloud Firestore** dengan arsitektur **Hybrid Sync (Cloud + Offline Cache)**:
- **`cart`**: Menyimpan daftar barang troli yang sedang aktif secara realtime.
- **`budgetLimit`**: Batas maksimal anggaran belanja bulanan.
- **`catalog`**: Database harga acuan bulan lalu untuk fitur Komparator Harga Realtime (F-04).
- **`history`**: Riwayat transaksi struk belanja bulanan (F-06).
- **Offline Resilience**: Jika koneksi terputus saat berada di dalam supermarket, data tetap tersimpan di `localStorage` dan otomatis disinkronkan ke Firebase begitu online.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi telah dilengkapi server lokal bawaan Node.js tanpa dependensi eksternal:

```bash
# Jalankan server lokal
node server.js
```

Buka browser di smartphone atau laptop pada URL:
```
http://localhost:3000
```

> **Tips Menguji Langsung Fitur**:
> Pada layar awal saat troli masih kosong, klik tombol **"Muat Template Belanja Kost"**. Sistem akan otomatis memuat 6 item kebutuhan khas anak rantau yang mendemonstrasikan seluruh kombinasi: harga naik ($\uparrow$), harga turun ($\downarrow$), harga stabil ($=$), item baru ($\star$), serta diskon bertingkat 50% + 20% dan 20% + 10%.