const crypto = require('crypto');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

let randomUsername = crypto.randomBytes(16).toString('hex');
let randomPassword = crypto.randomBytes(16).toString('hex');
let randomEmail = crypto.randomBytes(16).toString('hex') + '@example.com';
let loginToken = '';

describe('Test 404 handling', () => {
    test('It should respond a 404 code with json message', () => {
        return request(app)
            .get('/invalid-route-test')
            .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.body).toStrictEqual({ "message": "Not Found" });
            });
    });
});

describe('Test Register', () => {
    test('It should respond a 400 code when no username is provided', () => {
        return request(app)
            .post('/api/auth/signup')
            .send({ password: randomPassword, email: randomEmail })
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('No username was given');
            });
    });

    test('It should respond a 400 code when no password is provided', () => {
        return request(app)
            .post('/api/auth/signup')
            .send({ username: randomUsername, email: randomEmail })
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('No password was given');
            });
    });

    test('It should respond a 400 code when no email is provided', () => {
        return request(app)
            .post('/api/auth/signup')
            .send({ username: randomUsername, password: randomPassword })
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('email: is required');
            });
    });

    test('It should respond a 201 code when register is OK', () => {
        return request(app)
            .post('/api/auth/signup')
            .send({ username: randomUsername, password: randomPassword, email: randomEmail })
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('Registration successful');
            });
    });
});

describe('Test Login', () => {
    test('It should respond a 401 code when invalid login is provided', () => {
        return request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: randomPassword })
            .then(response => {
                expect(response.statusCode).toBe(401);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('Password or username is incorrect');
            });
    });

    test('It should respond a 400 code when no username was provided', () => {
        return request(app)
            .post('/api/auth/login')
            .send({ password: randomPassword })
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('Missing credentials');
            });
    });

    test('It should respond a 400 code when no password was provided', () => {
        return request(app)
            .post('/api/auth/login')
            .send({ username: 'admin' })
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('Missing credentials');
            });
    });

    test('It should login a 200 code and return token when login is OK', () => {
        return request(app)
            .post('/api/auth/login')
            .send({ username: randomUsername, password: randomPassword })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.body.token).toBeDefined();
                loginToken = response.body.token;
            });
    });
});

afterAll(async () => {
    try {
        await mongoose.connection.close()
    } catch (err) {
        console.log(err)
    }
});