const request = require('supertest');
const app = require('../app'); // Your Express app
const User = require('../models/userModel');

let token;

beforeAll(async () => {
    // Create a super user for testing
    await User.deleteMany({});
    const response = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Super User',
            email: 'superuser@test.com',
            password: 'password123',
            role: 'super_user',
            phone: '1234567890',
            address: {
                city: 'Test City',
                street: 'Test Street',
                neighborhood: 'Test Neighborhood',
                buildingNumber: '123',
                houseNumber: '456'
            }
        });
    token = response.body.token;
});

describe('Auth API', () => {
    test('Register new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'New User',
                email: 'newuser@test.com',
                password: 'password123',
                role: 'buyer',
                phone: '0987654321',
                address: {
                    city: 'New City',
                    street: 'New Street',
                    neighborhood: 'New Neighborhood',
                    buildingNumber: '789',
                    houseNumber: '101'
                }
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    test('Login user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'superuser@test.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('Get user profile', async () => {
        const response = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('address');
    });

    // Add more tests for other functionalities
});
