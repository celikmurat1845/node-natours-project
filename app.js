const express = require('express');
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

// middleware's
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
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
app.all('*', (err, req, res, next) => {
    // res.status(404).json({
    //  status: 'failed', 
    //  message: `Can not find ${req.originalUrl} route!!!` 
    // })

    // const err = new Error(`Can not find ${req.originalUrl} route!!!`)
    // err.statusCode = 404;
    // err.status = 'fail';

    next(new AppError(`Can not find ${req.originalUrl} route!!!`, 404));
});

// error handling
app.use(globalErrorHandler);


module.exports = app;