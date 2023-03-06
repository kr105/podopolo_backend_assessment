const crypto = require('crypto');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db'); // required to connect to the db

// Login data for testing users
let randomUsername1 = crypto.randomBytes(16).toString('hex');
let randomUsername2 = crypto.randomBytes(16).toString('hex');
let randomPassword = crypto.randomBytes(16).toString('hex');
let randomEmail1 = crypto.randomBytes(16).toString('hex') + '@example.com';
let randomEmail2 = crypto.randomBytes(16).toString('hex') + '@example.com';

// Tokens for logged-in testing users
let loginToken1 = '';
let loginToken2 = '';

let userId1 = '';
let userId2 = '';

let noteId1 = '';
let noteId2 = '';

beforeAll(async () => {
    // Two users are created and logged in, for use in testing
    await request(app)
        .post('/api/auth/signup')
        .send({ username: randomUsername1, password: randomPassword, email: randomEmail1 })
        .then((response) => {
            userId1 = response.body.id;
        });

    await request(app)
        .post('/api/auth/signup')
        .send({ username: randomUsername2, password: randomPassword, email: randomEmail2 })
        .then((response) => {
            userId2 = response.body.id;
        });

    await request(app)
        .post('/api/auth/login')
        .send({ username: randomUsername1, password: randomPassword })
        .then(response => {
            loginToken1 = response.body.token;
        });

    await request(app)
        .post('/api/auth/login')
        .send({ username: randomUsername2, password: randomPassword })
        .then(response => {
            loginToken2 = response.body.token;
        });
});

describe('Test endpoints without authentication', () => {
    test('GET /notes should return 401 code', () => {
        return request(app)
            .get('/api/notes')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
    test('GET /notes/:id should return 401 code', () => {
        return request(app)
            .get('/api/notes/123456')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
    test('POST /notes should return 401 code', () => {
        return request(app)
            .post('/api/notes')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
    test('PUT /notes/:id should return 401 code', () => {
        return request(app)
            .put('/api/notes/123456')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
    test('DELETE /notes/:id should return 401 code', () => {
        return request(app)
            .delete('/api/notes/123456')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
    test('POST /notes/:id/share should return 401 code', () => {
        return request(app)
            .post('/api/notes/123456/share')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
    test('GET /search should return 401 code', () => {
        return request(app)
            .get('/api/search?q=hello')
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });
});

describe('Test note creation', () => {
    test('It should respond a 201 code when note created successfully from user 1', () => {
        return request(app)
            .post('/api/notes')
            .set('Authorization', 'bearer ' + loginToken1)
            .send({ title: 'This is a testing note 01', contents: 'Hello from Jest!' })
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(response.headers['content-type']).toContain('application/json');

                noteId1 = response.body.id;
            });
    });

    test('It should respond a 201 code when note created successfully from user 2', () => {
        return request(app)
            .post('/api/notes')
            .set('Authorization', 'bearer ' + loginToken2)
            .send({ title: 'This is a testing note 02', contents: 'Hello from Jest!' })
            .then(response => {
                expect(response.statusCode).toBe(201);
                expect(response.headers['content-type']).toContain('application/json');

                noteId2 = response.body.id;
            });
    });
});

describe('Test note reading', () => {
    test('It should respond the note contents from user 1 when listing', () => {
        return request(app)
            .get('/api/notes')
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is a testing note 01');
            });
    });

    test('It should respond the note contents from user 2 when listing', () => {
        return request(app)
            .get('/api/notes')
            .set('Authorization', 'bearer ' + loginToken2)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is a testing note 02');
            });
    });

    test('It should respond the note contents from user 1 when asking by id', () => {
        return request(app)
            .get(`/api/notes/${noteId1}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is a testing note 01');
            });
    });

    test('It should respond the note contents from user 2 when asking by id', () => {
        return request(app)
            .get(`/api/notes/${noteId2}`)
            .set('Authorization', 'bearer ' + loginToken2)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is a testing note 02');
            });
    });

    test('Trying to access a note from another user should return code 403', () => {
        return request(app)
            .get(`/api/notes/${noteId2}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(403);
                expect(response.headers['content-type']).toContain('application/problem+json');

                // It should not return actual note contents
                expect(response.text).not.toContain('This is an updated note 02');
            });
    });
});

describe('Test note updating', () => {
    test('It should update the note successfully from user 1', () => {
        return request(app)
            .put(`/api/notes/${noteId1}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .send({ title: 'This is an updated note 01', contents: 'Hello from Jest again!' })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
            });
    });

    test('It should update the note successfully from user 2', () => {
        return request(app)
            .put(`/api/notes/${noteId2}`)
            .set('Authorization', 'bearer ' + loginToken2)
            .send({ title: 'This is an updated note 02', contents: 'Hello from Jest again!' })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
            });
    });

    test('The note from user 1 should contain the updated data', () => {
        return request(app)
            .get(`/api/notes/${noteId1}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is an updated note 01');
            });
    });

    test('The note from user 2 should contain the updated data', () => {
        return request(app)
            .get(`/api/notes/${noteId2}`)
            .set('Authorization', 'bearer ' + loginToken2)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is an updated note 02');
            });
    });
});

describe('Test note search', () => {
    test('It should get a note based on query string', () => {
        return request(app)
            .get(`/api/search?q=jest`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('Hello from Jest again!'); // It is the updated text
            });
    });

    test('It should not get any note based on query string', () => {
        return request(app)
            .get(`/api/search?q=hellothisisalongquerystring`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.body).toHaveLength(0);
            });
    });
});

describe('Test note sharing', () => {
    test('It should share note from user 1 to user 2 successfully', () => {
        return request(app)
            .post(`/api/notes/${noteId1}/share`)
            .set('Authorization', 'bearer ' + loginToken1)
            .send({ shareWith: userId2})
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('Note shared OK');
            });
    });

    test('User 2 should be able to access note 1', () => {
        return request(app)
            .get(`/api/notes/${noteId1}`)
            .set('Authorization', 'bearer ' + loginToken2)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('This is an updated note 01');
            });
    });
});

describe('Test note deletion', () => {
    test('It should delete note from user 1', () => {
        return request(app)
            .delete(`/api/notes/${noteId1}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(response.text).toContain('Note deleted successfully');
            });
    });

    test('It should fail on deleting non-existing note', () => {
        return request(app)
            .delete(`/api/notes/${noteId1}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('Note not found');
            });
    });

    test('It should fail on deleting note from another user', () => {
        return request(app)
            .delete(`/api/notes/${noteId2}`)
            .set('Authorization', 'bearer ' + loginToken1)
            .then(response => {
                expect(response.statusCode).toBe(404);
                expect(response.headers['content-type']).toContain('application/problem+json');
                expect(response.text).toContain('Note not found');
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