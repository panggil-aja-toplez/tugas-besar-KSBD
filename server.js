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
        SELECT k.id_karyawan, k.nama, k.email, j.nama_jabatan, c.nama_klien, p.nama_kota 
        FROM karyawan k
        INNER JOIN jabatan j ON k.id_jabatan = j.id_jabatan
        INNER JOIN klien c ON k.id_klien = c.id_klien
        INNER JOIN penempatan p ON k.id_penempatan = p.id_kota
        WHERE k.nama LIKE ? OR k.id_karyawan LIKE ?
    `;

    db.query(query, [%${search}%, %${search}%], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results); // Data dikirim ke React dalam bentuk JSON
    });
});

// 3. API: TAMPILKAN BIODATA LENGKAP SAAT ID DIKLIK
app.get('/api/karyawan/:id', (req, res) => {
    const idKaryawan = req.params.id;

    const query = `
        SELECT k.*, j.nama_jabatan, j.gaji_pokok, c.nama_klien, p.nama_kota
        FROM karyawan k
        INNER JOIN jabatan j ON k.id_jabatan = j.id_jabatan
        INNER JOIN klien c ON k.id_klien = c.id_klien
        INNER JOIN penempatan p ON k.id_penempatan = p.id_kota
        WHERE k.id_karyawan = ?
    `;

    db.query(query, [idKaryawan], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
        res.json(results[0]); // Kirim 1 data biodata lengkap karyawan
    });
});

// 5. API TAMBAH KARYAWAN (CREATE)
app.post('/api/karyawan', (req, res) => {
    const { id_karyawan, nama, email, no_telp, alamat, id_jabatan, id_klien, id_penempatan } = req.body;

    const query = `
        INSERT INTO karyawan (id_karyawan,nama, email, no_telp, alamat, id_jabatan, id_klien, id_penempatan) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [id_karyawan, nama, email, no_telp, alamat, id_jabatan, id_klien, id_penempatan], (err, result) => {
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

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
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

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
