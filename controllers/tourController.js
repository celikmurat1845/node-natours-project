const Tour = require('./../models/tourModel')
// const fs = require('fs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')


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

exports.getAllTours = catchAsync(async (req, res, next) => {
    // const { duration, difficulty } = req.query;

    // build query
    // 1. Filtering
    const queryObj = { ...req.query };
    console.log("obj:>>", queryObj)
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el])

    // 2. Advanced Filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log("str:>>", JSON.parse(queryStr))

    let query = Tour.find(JSON.parse(queryStr));
    // console.log("4-----", query)
    // const query = await Tour.find()
    // .where('duration')
    // .equals(duration)
    // .where('difficulty')
    // .equals(difficulty)

    // 3. Sorting
    if(req.query.sort) {
        query = query.sort(req.query.sort)
        console.log("qqqq:>>", query)
    }

    // execute query
    const tours = await query;
    // send response
    res.status(200).json({ 
        status: 'success', 
        results: tours.length, 
        data: { tours } 
    });
})

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
})
