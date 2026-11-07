import db from '../db.js';

// Save a contact form submission
const createContact = async (name, email, subject, message) => {
    const result = await db.query(
        `INSERT INTO contact_form (name, email, subject, message)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, email, subject, message]
    );

    return result.rows[0];
};

// Get all contact form submissions
const getAllContacts = async () => {
    const result = await db.query(
        'SELECT * FROM contact_form ORDER BY created_at DESC'
    );

    return result.rows;
};

export { createContact, getAllContacts };