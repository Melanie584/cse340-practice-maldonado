import { addDemoHeaders } from '../middleware/demo/headers.js';

import {
    homePage,
    aboutPage,
    demoPage,
    testErrorPage
} from './index.js';

import {
    catalogPage,
    courseDetailPage
} from './catalog/catalog.js';

import {
    facultyListPage,
    facultyDetailPage
} from './faculty/faculty.js';

import registrationRouter from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import { Router } from 'express';

const router = Router();

// Static pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

// Add catalog-specific styles
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// Add faculty-specific styles
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
    next();
});

// Add registration-specific styles
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// Faculty routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

// Registration routes
router.use('/register', registrationRouter);

// Login routes
router.use('/login', loginRoutes);

// Authentication routes
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;