const express = require('express');
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes') 
const app = express();

// middleware's
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    console.log("Hello from middleware 👋");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// error handling
app.all('*', (req, res, next) => {
    // res.status(404).json({ status: 'failed', message: `Can not find ${req.originalUrl} route!!!` })

    const err = new Error(`Can not find ${req.originalUrl} route!!!`)
    err.statusCode = 404;
    err.status = 'fail';
    next(err);
});

// error handling
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    res.status(err.statusCode).json({ status: err.status, message: err.message })
})


module.exports = app;