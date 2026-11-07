import { Router } from 'express';
import { validationResult } from 'express-validator';
import { registrationValidation } from '../../middleware/validation/forms.js';
import bcrypt from 'bcrypt';
import {
    emailExists,
    saveUser,
    getAllUsers
} from '../../models/forms/registration.js';

const router = Router();

/**
 * Display the registration form
 */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

/**
 * Process a registration submission
 */
const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const existingEmail = await emailExists(email);

        if (existingEmail) {
            console.log('Email already registered');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await saveUser(name, email, hashedPassword);

        console.log('User registered successfully');
        res.redirect('/register/list');
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/register');
    }
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error('Error retrieving users:', error);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users',
        users: users
    });
};

// Registration routes
router.get('/', showRegistrationForm);

router.post('/', registrationValidation, processRegistration);

router.get('/list', showAllUsers);

export default router;