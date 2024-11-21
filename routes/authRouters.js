const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const router = express.Router();

// Route Signup
router.post('/signupUser', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');

        db.query('INSERT INTO datauser (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) return res.status(500).send('Error registering user');
            res.redirect('/loginuser');
        });
    });
});

// Route untuk menampilkan form signup
router.get('/signupUser', (req, res) => {
    res.render('signupUser', {
        layout: 'layouts/main_layouts'
    });
});

// Route Login
router.post('/loginuser', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM datauser WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Error fetching user');
        if (results.length === 0) return res.status(400).send('User not found');

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).send('Error checking password');
            if (!isMatch) return res.status(401).send('Incorrect password');

            // Simpan userId dalam sesi setelah login berhasil
            req.session.userId = results[0].id;
            res.redirect('/'); // Arahkan ke halaman utama setelah login
        });
    });
});

// Route untuk menampilkan form login
router.get('/loginuser', (req, res) => {
    res.render('loginuser', {
        layout: 'layouts/main_layouts'
    });
});

// Route Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/loginuser'); // Arahkan ke halaman login setelah logout
    });
});

module.exports = router;