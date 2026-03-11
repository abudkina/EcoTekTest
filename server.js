require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/request', function (req, res) {
    const { name, phone, message } = req.body || {};
    if (!name || !phone) {
        return res.status(400).json({ ok: false, error: 'name and phone required' });
    }
    const text = [
        'Новая заявка с сайта',
        '',
        'Имя: ' + name,
        'Телефон: ' + phone,
        message ? 'Сообщение: ' + message : ''
    ].join('\n');

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Заявка с сайта ЭКОТЭК АС',
        text: text
    }, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ ok: false });
        }
        res.json({ ok: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Server at http://localhost:' + PORT);
});
