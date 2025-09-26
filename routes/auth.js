// routes/auth.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

// callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/fail' }),
  (req, res) => {
    // user is req.user (from passport)
    const user = req.user;
    // create JWT payload
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    // return token as JSON OR redirect to client with token in query param
    // Option A: JSON (useful if you hit this endpoint via Postman)
    // res.json({ token });

    // Option B: Redirect to frontend or Swagger UI page with token in query (practical)
    // Example: redirect to your Render UI with token in hash or query
    //const redirectTo = (process.env.RENDER_URL || 'http://localhost:8080') + `/auth/success?token=${token}`;
    //res.redirect(redirectTo);
    const redirectBase = process.env.NODE_ENV === 'production'
    ? process.env.RENDER_URL
    : 'http://localhost:8080';

    const redirectTo = `${redirectBase}/auth/success?token=${token}`;
    res.redirect(redirectTo);

  }
);


router.get('/fail', (req, res) => res.status(401).send('Authentication Failed'));

router.get('/logout', (req, res) => {
  req.logout?.();
  res.send({ message: 'Logged out' });
});

// ✅ ADD THIS SUCCESS ROUTE RIGHT HERE
router.get('/success', (req, res) => {
  const token = req.query.token;
  res.json({ message: 'Login successful', token });
});

// Optional endpoint to test current user from JWT (if client sends token)
router.get('/me', (req, res) => {
  // expect Bearer token in Authorization header
  // middleware verifyToken recommended (shared with protected routes)
  res.send({ message: 'Use /protected with Authorization Bearer token' });
});

module.exports = router;
