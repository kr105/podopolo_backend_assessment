const app = require('./app');
require('dotenv').config();

const LISTEN_PORT = process.env.LISTEN_PORT || 3000;

app.listen(LISTEN_PORT, () => {
    console.log(`Podopolo app listening on port ${LISTEN_PORT}`);
});



