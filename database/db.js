// Mengimpor library mysql2 untuk mengelola koneksi database MySQL
const mysql = require('mysql2');
// Mengimpor dan mengaktifkan dotenv untuk membaca variabel lingkungan dari file .env
require('dotenv').config();

// Membuat koneksi ke database MySQL menggunakan parameter dari variabel lingkungan
const connection = mysql.createConnection({
    host: process.env.DB_HOST, // Nama host atau alamat IP server database
    user: process.env.DB_USER, // Nama pengguna untuk autentikasi database
    password: process.env.DB_PASSWORD, // Kata sandi untuk autentikasi database
    database: process.env.DB_NAME // Nama database yang akan digunakan
});

//memvalidasi hasil koneksinya
connection.connect((err) => {
    if (err) {
        // Menampilkan pesan error jika koneksi gagal
        console.error('Error connecting to the database:', err);
        return; // Menghentikan eksekusi jika terjadi kesalahan
    }
    // Menampilkan pesan sukses jika koneksi berhasil
    console.log('Connected to the MySQL database.');
});

// Mengekspor objek koneksi agar dapat digunakan di file lain
module.exports = connection;