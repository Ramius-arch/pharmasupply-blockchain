const authService = require('../../services/auth.service');
const User = require('../../models/user.model');
const { hashPassword, comparePassword } = require('../../utils/password.utils');
const jwt = require('jsonwebtoken');

// Mock external modules
jest.mock('../../models/user.model');
jest.mock('../../utils/password.utils');
jest.mock('jsonwebtoken');

// Mock env config
jest.mock('../../config/env', () => ({
  JWT_SECRET: 'testsecret'
}));

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should successfully register a new user with default role', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'password123',
                role: 'admin', // attempt to self-elevate
            };
            const hashedPassword = 'hashedPassword123';

            hashPassword.mockResolvedValue(hashedPassword);
            User.mockImplementation(function() {
                this.firstName = userData.firstName;
                this.lastName = userData.lastName;
                this.email = userData.email;
                this.password = hashedPassword;
                this.role = 'user';
                this.save = jest.fn().mockResolvedValue(this);
                this.toObject = jest.fn().mockReturnValue({ ...this });
            });

            const newUser = await authService.registerUser(userData);

            expect(hashPassword).toHaveBeenCalledWith(userData.password);
            expect(User).toHaveBeenCalledWith(expect.objectContaining({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: hashedPassword,
                role: 'user'
            }));
            expect(newUser.email).toBe(userData.email);
            expect(newUser.role).toBe('user');
            expect(newUser.save).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if registration fails', async () => {
            const userData = { /* ... */ };
            hashPassword.mockResolvedValue('hashedPassword123');
            User.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('DB error')),
                toObject: jest.fn().mockReturnValue({}),
            }));

            await expect(authService.registerUser(userData)).rejects.toThrow('Registration failed: DB error');
        });
    });

    describe('loginUser', () => {
        const credentials = { email: 'test@example.com', password: 'password123' };
        const userInDb = {
            _id: 'someId',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'hashedPassword123',
            role: 'user',
            toJSON: jest.fn().mockReturnValue({
                _id: 'someId',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                role: 'user',
            }),
        };
        const token = 'mockJwtToken';

        it('should successfully log in a user and not expose password', async () => {
            User.findOne.mockResolvedValue(userInDb);
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            const result = await authService.loginUser(credentials);

            expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
            expect(comparePassword).toHaveBeenCalledWith(credentials.password, userInDb.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: userInDb._id, role: userInDb.role },
                'testsecret',
                { expiresIn: '24h' }
            );
            expect(result).toEqual(expect.objectContaining({
                email: userInDb.email,
                token: token,
            }));
            expect(result.password).toBeUndefined();
            expect(userInDb.toJSON).toHaveBeenCalledTimes(1);
        });

        it('should throw an error for invalid email', async () => {
            User.findOne.mockResolvedValue(null);
            await expect(authService.loginUser(credentials)).rejects.toThrow('Login failed: Error: Invalid username or password');
        });

        it('should throw an error for invalid password', async () => {
            User.findOne.mockResolvedValue(userInDb);
            comparePassword.mockResolvedValue(false);
            await expect(authService.loginUser(credentials)).rejects.toThrow('Login failed: Error: Invalid username or password');
        });

        it('should throw an error if JWT signing fails', async () => {
            User.findOne.mockResolvedValue(userInDb);
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockImplementation(() => { throw new Error('JWT error'); });
            await expect(authService.loginUser(credentials)).rejects.toThrow('Login failed: Error: JWT error');
        });
    });
});
