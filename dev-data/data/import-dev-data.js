const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel')
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

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

// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into db
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfuly loaded! 😎');
    } catch (err) {
        console.log(err)
    }
        process.exit();
};

// delete all data from db
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfuly deleted!!!')
    } catch (err) {
        console.log(err)
    }
        process.exit();
};

if(process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
};