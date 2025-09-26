// server.js
require('dotenv').config(); // Load .env first

const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Strategy: GitHubStrategy } = require('passport-github2');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger');
const errorHandler = require('./middleware/errorHandler');

// API routes
const contactsRoutes = require('./routes/contacts');
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');

require('./config/passport')(passport); // your custom passport config

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(bodyParser.json()); // if you want body-parser explicitly
app.use(cookieParser());
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));

// Sessions (store sessions in Mongo)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ---------- Swagger Docs ----------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------- ROUTES ----------
app.get('/', (req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/notes', notesRoutes);

// ---------- GitHub OAuth Strategy ----------
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // TODO: Find or create user in database
    // For now just return the GitHub profile
    return done(null, profile);
  }
));

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

// ---------- START SERVER ----------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set. Create .env from .env.example');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
// ---------- GRACEFUL SHUTDOWN ----------
