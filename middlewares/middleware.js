// Middleware untuk memeriksa autentikasi pengguna
// Fungsi ini memeriksa apakah sesi memiliki properti `userId`.
// Jika `userId` ada, berarti pengguna sudah masuk (authenticated),
// dan middleware akan melanjutkan ke fungsi berikutnya menggunakan `next()`.
// Jika `userId` tidak ada, pengguna dianggap belum masuk,
// dan akan diarahkan ke halaman login menggunakan `res.redirect('/login')`.
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // Lanjutkan ke middleware atau handler berikutnya
    } else {
        res.redirect('/loginuser'); // Arahkan ke halaman login jika tidak autentikasi
    }
}

module.exports = { isAuthenticated };