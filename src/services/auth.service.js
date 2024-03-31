import { Account } from "../models/account.model.js";
import crypto from 'crypto';

const getAccountByUsername = async (username) => {
    try {
        const account = await Account.findOne({ username });
        return account;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

const hashPassword = async (password) => {
	const salt = crypto.randomBytes(16).toString('hex');
	const buf = await crypto.scryptSync(password, salt, 64);
	return `${buf.toString('hex')}.${salt}`;
};

const comparePassword = async (password, storedPassword) => {
	const [hashedPassword, salt] = storedPassword.split('.');
	const buf = Buffer.from(hashedPassword, 'hex');
	const hashedPasswordBuf = await crypto.scryptSync(password, salt, 64);
	return crypto.timingSafeEqual(buf, hashedPasswordBuf);
}

export default { getAccountByUsername, hashPassword, comparePassword }
