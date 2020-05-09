const cors = require('cors');

const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:9231',
        'https://test.hellochokchok.com', 
        'https://backoffice.hellochokchok.com',
        'https://www.hellochokchok.com' 
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
};

const enableCors = () => {
    return cors(corsOptions);
};

module.exports = {
    enableCors
}