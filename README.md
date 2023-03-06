# podopolo_backend_assessment

You have been asked to build a secure and scalable RESTful API that allows users to create, read, update, and delete notes. The application should also allow users to share their notes with other users and search for notes based on keywords.

## Design decisions
### Software used
- Node.js has been selected because it is super easy to implement RESTful APIs with all its features and environment (packages, documentation, etc).
- Express is what I have been using the most over the years. Nest seems to be worth taking a look into.
- MongoDB is easy to use and better suited for horizontal scalability (vs PostgreSQL or others).
- Jest has more resources available online (vs Mocha) and I have written way more tests on Jest than on Mocha.
- Passport was selected because it is a mature software with support for the kind of authentication needed for this project: token.
- JWT is being used as a token mechanism since it is an open standard (RFC 7519), it is easy to use and it is compact.

### Notes
- Note sharing feature allows the "destination" user to read the note, but it won't be able to modify/delete/share it.
- Some tests are repeated for testing user 1 and testing user 2, this is done because if a mistake is made the MongoDB collection might get issues with indexes and allow only a single row, so these tests would catch this issue.
- Tests create random users and dummy notes, they are not deleted at the end of the testing because tests are not meant to be run on production databases :)
- With more time or in real projects I would have implemented more types of rate limiting, like limiting the incorrect user/password tries and limiting the API requests based on user/token to avoid proxy abuse (and avoid problems for legitimate users with shared IP addresses).

## How to run the code
This project needs a running instance of MongoDB, please copy the `.env.example` file to `.env` and modify the variables to point to your instance.

To start the server, simply run

	npm init
	node index.js

It will connect to the MongoDB instance and start listening for requests.

## How to run the tests
Run

	npm test

If you want to see test names and details, run

	npm test -- --verbose

There is also support for Github Actions tests, it will automatically check if all tests are passing on each commit. It doesn't need an external MongoDB instance since it will create a temporary container and run tests on it.

> Tip: You can install [Act](https://github.com/nektos/act "Act") to run Github Actions locally before commiting to the repo.

## API Reference

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`   | `/api/auth/signup`                                              | Create new account|
| `POST`   | `/api/auth/login`                                         | Login and get auth token|
| `GET`    | `/api/notes`                    | Get a list of all notes for the authenticated user|
| `GET`    | `/api/notes/:id`                       | Get a note by ID for the authenticated user|
| `POST`   | `/api/notes`                          | Create a new note for the authenticated user|
| `PUT`    | `/api/notes/:id`          | Update an existing note by ID for the authenticated user|
| `DELETE` | `/api/notes/:id`                    | Delete a note by ID for the authenticated user|
| `POST`   | `/api/notes/:id/share`   | Share a note with another user for the authenticated user|
| `GET`    | `/api/search?q=:query`|Search for notes based on keywords for the authenticated user|
