const fs = require('fs');
const express = require('express');
const morgan = require('morgan')

const app = express();

// middleware's
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log("Hello from middleware 👋");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// read the file
const tours =JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8', (err, data) => {
    if (err) throw err;
    return data
}));

// tours route's handlers
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({ 
        status: 'success', 
        results: tours.length, 
        data: { tours } 
    });
}

const getTour = (req, res) => {
    const { id } = req.params;

    if(!tours[id]) {
        res.status(404).json({ status: "failed", message: "Invalid ID!" })
    } else {
        res.status(200).json({ status: 'success', data: { tours: tours[id] } })
    }
}

const createTour = (req, res) => {
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
}

const updateTour = (req, res) => {
    const { id } = req.params;

    if(!tours[id]) {
        res.status(404).json({ status: "failed", message: "Invalid ID!" })
    }else {
        res.status(200).json({ status: 'success', data: { tour: '<Updated tour here...>' } })
    }
}

const deleteTour = (req, res) => {
    const { id } = req.params;

    if(!tours[id]) {
        res.status(404).json({ status: "failed", message: "Invalid ID!" })
    }else {
        res.status(204).json({ status: 'success', data: null })
    }
}

// user's routes handlers
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined!'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined!'
    })
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined!'
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined!'
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route is not yet defined!'
    })
};

// tours route's
app
.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app
.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

// user's routes
app
.route('/api/v1/users')
.get(getAllUsers)
.post(createUser);

app
.route('/api/v1/users/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser)

// start server
const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})