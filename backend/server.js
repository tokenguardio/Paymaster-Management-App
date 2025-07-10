const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { SiweMessage } = require('siwe');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(session({
    name: 'siwe-session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // set true if https on production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));


function requireAuth(req, res, next) {
    if (!req.session.siwe) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

app.post('/siwe/verify', async function (req, res) {
    const { message, signature } = req.body;
    const siweMessage = new SiweMessage(message);

    try {
        const { success, data } = await siweMessage.verify({ signature });

        if (!success) throw new Error('Verification failed');

        req.session.siwe = {
            address: data.address,
            chainId: data.chainId,
            issuedAt: data.issuedAt,
        };

        res.json({ address: data.address });
    } catch (error) {
        console.error('SIWE verify error:', error);
        res.status(401).json({ error: 'Invalid signature' });
    }
});

app.get('/me', (req, res) => {
    if (req.session.siwe) {
        res.json({ address: req.session.siwe.address });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.sendStatus(200);
    });
});

app.listen(3001, () => {
  console.log('🚀 SIWE backend listening on http://localhost:3001');
});
