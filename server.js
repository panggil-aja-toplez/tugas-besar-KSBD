const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Mengizinkan React.js mengakses backend ini
app.use(express.json()); // Agar backend bisa menerima data format JSON dari form React

// 1. KONEKSI KE MYSQL WORKBENCH
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sholat5waktu', // Sesuaikan password XAMPP/Workbench-mu
    database: 'db_karyawan'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database MySQL Terhubung Berhasil!');
});

// 2. API: TAMPILKAN SEMUA KARYAWAN & FITUR SEARCH
app.get('/api/karyawan', (req, res) => {
    const search = req.query.search || '';
    
    // Query dengan JOIN ke tabel jabatan agar nama jabatannya muncul
    const query = `
        SELECT k.id_karyawan, k.nama, k.email, j.nama_jabatan 
        FROM karyawan k
        JOIN jabatan j ON k.id_jabatan = j.id_jabatan
        WHERE k.nama LIKE ? OR k.id_karyawan LIKE ?
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Data dikirim ke React dalam bentuk JSON
    });
});

// 3. API: TAMPILKAN BIODATA LENGKAP SAAT ID DIKLIK
app.get('/api/karyawan/:id', (req, res) => {
    const idKaryawan = req.params.id;

    const query = `
        SELECT k.*, j.nama_jabatan, j.gaji_pokok 
        FROM karyawan k
        JOIN jabatan j ON k.id_jabatan = j.id_jabatan
        WHERE k.id_karyawan = ?
    `;

    db.query(query, [idKaryawan], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        res.json(results[0]); // Kirim 1 data biodata lengkap karyawan
    });
});

// Jalankan Server di Port 5000
app.listen(5000, () => {
    console.log('Backend berjalan di http://localhost:5000');
});

// 4. API LOGIN ADMIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; // Menerima input dari React

    const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            // Jika akun cocok, kirim status sukses ke React
            res.json({ success: true, message: "Login Berhasil!", admin: results[0].username });
        } else {
            // Jika salah
            res.status(401).json({ success: false, message: "Username atau Password salah!" });
        }
    });
});

// 5. API TAMBAH KARYAWAN (CREATE)
app.post('/api/karyawan', (req, res) => {
    const { nama, email, no_telp, alamat, id_jabatan, id_klien, id_penempatan} = req.body;

    const query = `
        INSERT INTO karyawan (nama, email, no_telp, alamat, id_jabatan, id_klien, id_penempatan) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nama, email, no_telp, alamat, id_jabatan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Data karyawan berhasil ditambahkan!", id: result.insertId });
    });
});

// 6. API HAPUS KARYAWAN (DELETE)
app.delete('/api/karyawan/:id', (req, res) => {
    const idKaryawan = req.params.id;

    const query = "DELETE FROM karyawan WHERE id_karyawan = ?";

    db.query(query, [idKaryawan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        res.json({ message: "Data karyawan berhasil dihapus!" });
    });
});

// JABATAN
app.get('/api/jabatan', (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT id_jabatan, nama_jabatan, gaji_pokok
        FROM jabatan
        WHERE nama_jabatan LIKE ? OR id_jabatan LIKE ?
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); 
    });
});

// KLIEN 
app.get('/api/klien', (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT id_klien, nama_klien
        FROM klien
        WHERE nama_klien LIKE ? OR id_klien LIKE ?
    `;

    db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// PENEMPATAN 
app.get('/api/penempatan', (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT id_kota, nama_kota
        FROM penempatan
        WHERE nama_kota LIKE ? OR id_kota LIKE ?
    `;

    db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
