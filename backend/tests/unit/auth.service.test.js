const authService = require('../../services/auth.service');
const User = require('../../models/user.model');
const { hashPassword, comparePassword } = require('../../utils/password.utils');
const jwt = require('jsonwebtoken');

// Mock external modules
jest.mock('../../models/user.model');
jest.mock('../../utils/password.utils');
jest.mock('jsonwebtoken');

// Mock process.env for JWT_SECRET
process.env.JWT_SECRET = 'testsecret';


describe('Auth Service', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should successfully register a new user', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'password123',
                role: 'user',
            };
            const hashedPassword = 'hashedPassword123';

            hashPassword.mockResolvedValue(hashedPassword);
            // Mock the User constructor and its save method
            User.mockImplementation(function() {
                this.firstName = userData.firstName;
                this.lastName = userData.lastName;
                this.email = userData.email;
                this.password = hashedPassword;
                this.role = userData.role;
                this.save = jest.fn().mockResolvedValue(this);
                this.toObject = jest.fn().mockReturnValue({ ...this }); // Mock toObject for Mongoose documents
            });


            const newUser = await authService.registerUser(userData);

            expect(hashPassword).toHaveBeenCalledWith(userData.password);
            expect(User).toHaveBeenCalledWith(expect.objectContaining({
                ...userData,
                password: hashedPassword,
            }));
            expect(newUser.email).toBe(userData.email);
            expect(newUser.password).toBe(hashedPassword);
            expect(newUser.save).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if registration fails', async () => {
            const userData = { /* ... */ };
            hashPassword.mockResolvedValue('hashedPassword123');
            User.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error('DB error')),
                toObject: jest.fn().mockReturnValue({}),
            }));

            await expect(authService.registerUser(userData)).rejects.toThrow('Registration failed: Error: DB error');
        });
    });

    describe('loginUser', () => {
        const credentials = { email: 'test@example.com', password: 'password123' };
        // Mock Mongoose document with toObject method
        const userInDb = {
            _id: 'someId',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'hashedPassword123',
            role: 'user',
            toJSON: jest.fn().mockReturnValue({ // Use toJSON as Mongoose does
                _id: 'someId',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'hashedPassword123',
                role: 'user',
            }),
        };
        const token = 'mockJwtToken';

        it('should successfully log in a user', async () => {
            User.findOne.mockResolvedValue(userInDb);
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            const result = await authService.loginUser(credentials);

            expect(User.findOne).toHaveBeenCalledWith({ email: credentials.email });
            expect(comparePassword).toHaveBeenCalledWith(credentials.password, userInDb.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: userInDb._id, role: userInDb.role },
                process.env.JWT_SECRET // Use process.env directly
            );
            expect(result).toEqual(expect.objectContaining({
                email: userInDb.email,
                token: token,
            }));
            expect(userInDb.toJSON).toHaveBeenCalledTimes(1);
        });

        it('should throw an error for invalid email', async () => {
            User.findOne.mockResolvedValue(null); // User not found
            await expect(authService.loginUser(credentials)).rejects.toThrow('Login failed: Error: Invalid username or password');
        });

        it('should throw an error for invalid password', async () => {
            User.findOne.mockResolvedValue(userInDb);
            comparePassword.mockResolvedValue(false); // Incorrect password
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
