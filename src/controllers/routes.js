import { addDemoHeaders } from '../middleware/demo/headers.js';
import { Router } from 'express';

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

const router = Router();

// Static pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/demo', addDemoHeaders, demoPage);
router.get('/test-error', testErrorPage);

// Course catalog
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// Faculty directory
router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

export default router;