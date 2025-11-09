const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usertable');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already registered',
            });
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); 
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            message: 'User registered successfully',
            data: { name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for admin login with environment credentials
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Generate token for admin
            const token = jwt.sign(
                { id: 'admin', email: ADMIN_EMAIL, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '1h' }
            );

            return res.status(200).json({
                message: 'Admin login successful',
                token,
                user: { 
                    name: 'Admin', 
                    email: ADMIN_EMAIL,
                    role: 'admin'
                }
            });
        }

        // Regular user login (all other users are regular users, not employees)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token for regular user (role: 'user')
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { 
                name: user.name, 
                email: user.email,
                role: 'user'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        // Clear all cookies
        const cookies = req.cookies;
        if (cookies) {
            Object.keys(cookies).forEach(cookieName => {
                res.clearCookie(cookieName, {
                    httpOnly: true,
                    secure: process.env.COOKIE_SECURE === 'true',
                    sameSite: process.env.COOKIE_SAME_SITE || 'strict'
                });
            });
        }

        // Clear auth token cookie specifically if it exists
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'true',
            sameSite: process.env.COOKIE_SAME_SITE || 'strict'
        });

        res.status(200).json({
            message: 'Logout successful',
            clearLocalStorage: true, // Signal to frontend to clear localStorage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login, register, logout } 
