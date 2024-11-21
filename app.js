const express = require('express');                                     // Mengimpor modul Express untuk membuat aplikasi web.
const dthewanRoutes = require('./routes/dthewandb.js')                        // Mengimpor rute untuk operasi todo dari file 'tododb.js'.
const app = express();                                                  // Membuat instance dari aplikasi Express.

//untuk mengimport dotenv 
require('dotenv').config();                                             // Mengimpor dotenv untuk menggunakan variabel lingkungan dari file .env
const port = process.env.PORT;                                          // Mengambil nilai PORT dari file .env untuk digunakan di server.

// pertemuan ke 7
const session = require('express-session');                             // mengimpor session untuk mengatur sesi pengguna
const authRoutes = require('./routes/authRouters');                      // Mengimpor rute otentikasi dari 'authRoutes.js'.
const { isAuthenticated } = require('./middlewares/middleware.js');     // Mengimpor middleware untuk memeriksa autentikasi pengguna.


const expressLayout = require('express-ejs-layouts')                    // Menggunakan express-ejs-layouts untuk menyusun layout EJS
const db = require('./database/db');                                    // Mengimpor konfigurasi koneksi database.

app.use(expressLayout);                                                 // Menyeting middleware untuk layout EJS
app.use(express.json());                                                // Middleware untuk menangani data JSON.
app.use('/datahewan', dthewanRoutes);                                          // Menyambungkan rute '/todos' dengan file 'tododb.js'.
app.set('view engine', 'ejs');                                          // Menyeting template engine ke EJS.
app.use(express.urlencoded({ extended: true }));                        // Middleware untuk menangani data URL encoded.

// Konfigurasi express-session untuk pengelolaan sesi pengguna
app.use(session({
    secret: process.env.SESSION_SECRET,                                 // Menggunakan SESSION_SECRET dari file .env.
    resave: false,                                                      // Menentukan apakah sesi harus disimpan kembali jika tidak ada perubahan.
    saveUninitialized: false,                                           // Menentukan apakah sesi yang belum diinisialisasi harus disimpan.
    cookie: { secure: false }                                           // Set ke true jika menggunakan HTTPS (untuk keamanan cookie).
}));

app.use('/', authRoutes);                                               // Menyambungkan rute otentikasi ke root '/'.

app.get('/',isAuthenticated, (req,res) => {                             // Rute untuk halaman utama (home) dengan pengecekan autentikasi menggunakan middleware
    res.render('index',{
        layout: 'layouts/main_layouts'                                  // Menggunakan layout 'main_layouts' untuk halaman ini.
    });
});

// Rute untuk halaman kontak dengan pengecekan autentikasi
app.get('/contact',isAuthenticated, (req,res) => {
    res.render('contact', {
        layout: 'layouts/main_layouts'                                  // Menggunakan layout 'main_layouts' untuk halaman ini.
    });
});

// Rute untuk menampilkan daftar todo dengan pengecekan autentikasi
app.get('/todo-view',isAuthenticated, (req, res) => {
    // Query untuk mengambil semua data todos dari database
    db.query('SELECT * FROM datahewan', (err, datahewan) => {
        if (err) return res.status(500).send('Internal Server Error');   // Menangani error jika terjadi kesalahan.
        res.render('datahewan', {
            layout: 'layouts/main_layouts',
            datahewan: datahewan                                                 // Mengirimkan data todos ke view.
        });
    });
});

// Menjalankan server di port yang sudah didefinisikan dalam variabel lingkungan
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}/`);         // Menampilkan pesan saat server berhasil dijalankan.
});