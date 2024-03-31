import authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const account = await authService.getAccountByUsername(username);
        if (!account || !await authService.comparePassword(password, account.password)) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: account.username, role: account.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const hashPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await authService.hashPassword(password);
        return res.status(200).json({ hashedPassword });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default { login, hashPassword }
