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

// create schema for mongodb
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

// create model
const Tour = mongoose.model('Tour', tourSchema);

// create documents for model
const testTour = new Tour({
    name: 'The Park Hiker',
    // rating: 4.7,
    price: 499 
});
testTour.save().then(doc => {
    console.log("doc:>>", doc)
}).catch(err => {
    console.log('ERROR 💥', err)
});

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

