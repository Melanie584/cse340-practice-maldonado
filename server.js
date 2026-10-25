import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

// Import MVC components
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import { setupDatabase, testConnection } from './src/models/setup.js';
import db from './src/models/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Session Configuration
 */
const PostgreSQLStore = pgSession(session);

app.use(
    session({
        store: new PostgreSQLStore({
            pool: db,
            tableName: 'session',
            createTableIfMissing: true
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax'
        }
    })
);

/**
 * Global Middleware
 */
app.use(addLocalVariables);

/**
 * Routes
 */
app.use('/', routes);

/**
 * Error Handling
 */

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    if (res.headersSent || res.finished) {
        return next(err);
    }

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV
    };

    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        if (!res.headersSent) {
            res.status(status).send(
                `<h1>Error ${status}</h1><p>An error occurred.</p>`
            );
        }
    }
});

/**
 * Start Server
 */
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();

    startSessionCleanup();

    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});