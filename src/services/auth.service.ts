import { Account } from "@models"
import crypto from 'crypto';

const getAccountByUsername = async (username: string) => {
    try {
        const account = await Account.findOne({ username });
        return account;
    } catch (error) {
        const _error = error as Error;
        throw new Error(`${_error.message}`);
    }
}

const hashPassword = async (password: string) => {
	const salt = crypto.randomBytes(16).toString('hex');
	const buf = crypto.scryptSync(password, salt, 64);
	return `${buf.toString('hex')}.${salt}`;
};

const comparePassword = async (password: string, storedPassword: string) => {
	const [hashedPassword, salt] = storedPassword.split('.');
	const buf = Buffer.from(hashedPassword, 'hex');
	const hashedPasswordBuf = crypto.scryptSync(password, salt, 64);
	return crypto.timingSafeEqual(buf, hashedPasswordBuf);
}

export const authService = { getAccountByUsername, hashPassword, comparePassword };
