import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
    connectionString: env.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000
});

export const query = (text, params = []) => pool.query(text, params);

export const transaction = async (callback) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
