
import { Router } from 'express';
import { validationResult } from 'express-validator';
import { contactValidation } from '../../middleware/validation/forms.js';
import { createContact, getAllContacts } from '../../models/forms/contact.js';
import { requireRole } from '../../middleware/auth.js';

const router = Router();

// Display contact form
router.get('/', (req, res) => {
    res.render('forms/contact', {
        title: 'Contact Us',
        errors: [],
        formData: {}
    });
});

// Process contact form
router.post('/', contactValidation, async (req, res, next) => {
    const errors = validationResult(req);
    const { name, email, subject, message } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).render('forms/contact', {
            title: 'Contact Us',
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        await createContact(name, email, subject, message);
        res.render('forms/contact-success', {
            title: 'Message Sent'
        });
    } catch (error) {
        next(error);
    }
});

// Admin-only contact submissions
router.get('/responses', requireRole(2), async (req, res, next) => {
    try {
        const contacts = await getAllContacts();

        res.render('forms/contact-responses', {
            title: 'Contact Submissions',
            contacts
        });
    } catch (error) {
        next(error);
    }
});

export default router;
