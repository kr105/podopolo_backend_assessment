const app = require('./app');
const db = require('./db');

require('dotenv').config();

const LISTEN_PORT = process.env.LISTEN_PORT || 3000;

app.listen(LISTEN_PORT, () => {
    console.log(`Podopolo app listening on port ${LISTEN_PORT}`);
});
