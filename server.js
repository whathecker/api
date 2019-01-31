const app = require('./app');

app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`server is running on port number: ${process.env.PORT}`);
    console.log(`current env is : ${process.env.NODE_ENV}`);
    console.log(`current log level is : ${process.env.LOG_LEVEL}`);
});

