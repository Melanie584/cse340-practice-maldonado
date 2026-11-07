
import db from '../db.js';

// Find an account by ID
const getUserById = async (id) => {
    const result = await db.query(
        'SELECT id, name, email, role_id FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

// Update a user's account information
const updateUser = async (id, name, email) => {
    const result = await db.query(
        `UPDATE users
         SET name = $1, email = $2
         WHERE id = $3
         RETURNING id, name, email, role_id`,
        [name, email, id]
    );
    return result.rows[0] || null;
};

// Get all users for admin management
const getAllAccounts = async () => {
    const result = await db.query(
        'SELECT id, name, email, role_id FROM users ORDER BY id'
    );
    return result.rows;
};

// Delete an account
const deleteUser = async (id) => {
    const result = await db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
    );
    return result.rows[0] || null;
};

export { getUserById, updateUser, getAllAccounts, deleteUser };
