import { Router } from 'express';
import { validationResult } from 'express-validator';
import { accountValidation } from '../../middleware/validation/forms.js';
import { requireLogin, requireRole } from '../../middleware/auth.js';
import {
    getUserById,
    updateUser,
    getAllAccounts,
    deleteUser
} from '../../models/forms/account.js';

const router = Router();

// Show account edit form
const showEditAccount = async (req, res, next) => {
    try {
        const user = await getUserById(req.session.user.id);

        if (!user) {
            return res.status(404).send('Account not found');
        }

        res.render('forms/account/edit', {
            title: 'Edit Account',
            user,
            errors: []
        });
    } catch (error) {
        next(error);
    }
};

// Save account changes
const processEditAccount = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('forms/account/edit', {
            title: 'Edit Account',
            user: {
                name: req.body.name,
                email: req.body.email
            },
            errors: errors.array()
        });
    }

    try {
        const { name, email } = req.body;
        const user = await updateUser(req.session.user.id, name, email);

        if (!user) {
            return res.status(404).send('Account not found');
        }

        req.session.user = {
            ...req.session.user,
            ...user
        };

        res.redirect('/account/edit');
    } catch (error) {
        next(error);
    }
};

// Show all accounts (admin only)
const showAccounts = async (req, res, next) => {
    try {
        const users = await getAllAccounts();

        res.render('forms/account/list', {
            title: 'Manage Accounts',
            users
        });
    } catch (error) {
        next(error);
    }
};

// Delete an account (admin only)
const processDeleteAccount = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).send('Invalid account ID');
        }

        if (id === req.session.user.id) {
            return res.status(400).send('You cannot delete your own account');
        }

        const deleted = await deleteUser(id);

        if (!deleted) {
            return res.status(404).send('Account not found');
        }

        res.redirect('/account/manage');
    } catch (error) {
        next(error);
    }
};

// Account routes
router.get('/edit', requireLogin, showEditAccount);
router.post('/edit', requireLogin, accountValidation, processEditAccount);

router.get('/manage', requireRole(2), showAccounts);
router.post('/delete/:id', requireRole(2), processDeleteAccount);

export default router;
