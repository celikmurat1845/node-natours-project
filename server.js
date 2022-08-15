const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

const app = require('./app');

// connect mongodb to application
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => console.log('DB connection successful! 🤝'))


// catch the uncaught exception
process.on('uncaughtException', err => {
    console.log("UNCAUGHT EXCEPTION! 💥  Shutting down...", err.name, err.message);
    process.exit(1); 
});

// console.log(process.env)

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// catch the unhandled rejection
process.on('unhandledRejection', err => {
    console.log("UNHANDLED REJECTION! 💥  Shutting down...", err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});

