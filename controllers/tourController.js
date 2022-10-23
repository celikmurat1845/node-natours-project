const Tour = require('./../models/tourModel')
// const fs = require('fs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures');


// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8', (err, data) => {
//     if (err) throw err;
//     return data
// }));

// exports.checkID = (req, res, next, val) => {
//     const { id } = req.params;

//     if(!tours[id]) {
//       return res.status(404).json({ status: "failed", message: "Invalid ID!" })
//     };
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if(!req.body.name || !req.body.price) {
//         return res.status(400).json({ status: "failed", message: "Missing part name or price!!'" })
//     };
//     next();
// }

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
    // const { duration, difficulty } = req.query;

    // execute query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitField()
        .paginate();

    const tours = await features.query;
    // send response
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // console.log("deneme:>>", id)

    // if(!tours[id]) {
    //     console.log("aaaaaaaaaa")
    //    return next(new AppError('No tour found', 404))
    // };

    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({ status: 'success', data: { tour } })
});

exports.createTour = catchAsync(async (req, res, next) => {

    const newTour = await Tour.create(req.body)
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
    // tours.push(newTour);
    // console.log(newTour)

    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err => {
    res.status(201).json({
        status: 'success',
        data: { tours: newTour }
    })
    // })
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: { tour }
    })
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id)
    res.status(204).json({ status: 'success', data: null })
});

exports.getTourStats = async (req, res) => {
    try {

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    };
}
