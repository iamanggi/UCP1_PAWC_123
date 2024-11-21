const express = require('express');
const router = express.Router(); // Membuat router baru menggunakan Express
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    // Query untuk mengambil semua data dari tabel 'todos'
    db.query('SELECT * FROM datahewan', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error'); // Mengembalikan status 500 jika ada error
        res.json(results); // Mengembalikan hasil query dalam format JSON
    });
});

// Endpoint untuk mendapatkan data berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM datahewan WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Hewan tidak ditemukan');
        res.json(results[0]); // Mengembalikan hasil pertama dalam format JSON
    });
});

// Endpoint untuk menambahkan data hewan baru
router.post('/', (req, res) => {
    const { namahewan, kelas } = req.body; // Ambil namahewan dan kelas dari body request
    if (!namahewan || namahewan.trim() === '') {
        return res.status(400).send('Nama hewan tidak boleh kosong');
    }

    // Query untuk menyisipkan data baru ke tabel 'datahewan'
    db.query('INSERT INTO datahewan (namahewan, kelas) VALUES (?, ?)', [namahewan.trim(), kelas ? kelas.trim() : null], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Internal Server Error');
        }
        const newdthewan = { id: results.insertId, namahewan: namahewan.trim(), kelas: kelas ? kelas.trim() : null };
        res.status(201).json(newdthewan); // Mengembalikan data hewan baru dengan status 201
    });
    
});


// Endpoint untuk memperbarui data hewan
router.put('/:id', (req, res) => {
    const { namahewan, kelas } = req.body; // Mengambil data dari body request

    // Validasi inputan
    if (!namahewan || namahewan.trim() === '') {
        return res.status(400).send('Nama hewan tidak boleh kosong');
    }

    // Query untuk memperbarui data berdasarkan ID
    db.query('UPDATE datahewan SET namahewan = ?, kelas = ? WHERE id = ?', [namahewan, kelas, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Hewan tidak ditemukan');
        res.json({ id: req.params.id, namahewan, kelas }); // Mengembalikan data yang diperbarui
    });
});


// Endpoint untuk menghapus data hewan berdasarkan ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM datahewan WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Hewan tidak ditemukan');
        res.status(204).send(); // Status 204 (No Content) mengindikasikan penghapusan berhasil tanpa respon tambahan
    });
});


module.exports = router; // Mengekspor router agar bisa digunakan di file utama aplikasi