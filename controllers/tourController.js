const fs = require('fs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')


const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8', (err, data) => {
    if (err) throw err;
    return data
}));

// exports.checkID = (req, res, next, val) => {
//     const { id } = req.params;

//     if(!tours[id]) {
//       return res.status(404).json({ status: "failed", message: "Invalid ID!" })
//     };
//     next();
// }

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({ status: "failed", message: "Missing part name or price!!'" })
    };
    next();
}

exports.getAllTours = (req, res) => {
    console.log(req.originalUrl);
    res.status(200).json({ 
        status: 'success', 
        results: tours.length, 
        data: { tours } 
    });
}

exports.getTour = catchAsync(async (req, res, next) => {
    const { id } = req.params;
        console.log("deneme:>>", id)

    if(!tours[id]) {
        console.log("aaaaaaaaaa")
       return next(new AppError('No tour found', 404))
    };

    res.status(200).json({ status: 'success', data: { tours: tours[id] } })
});

exports.createTour = catchAsync(async (req, res, next) => {
   
        const newId = tours[tours.length - 1].id + 1;
        const newTour = Object.assign({ id: newId }, req.body);
        tours.push(newTour);
        console.log(newTour)

        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tours: newTour
                }
            })
        })
});

exports.updateTour = (req, res) => {
    res.status(200).json({ status: 'success', data: { tour: '<Updated tour here...>' } })
}

exports.deleteTour = (req, res) => {
    res.status(204).json({ status: 'success', data: null })
}
