const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//1 middlewares
app.use(morgan('dev'));

app.use(express.json()); //this is middleware (se aflta intre requesti si response)

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2 route handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  //   console.log(req.params);
  const { id } = req.params;
  // const id = req.params.id * 1;
  const tour = tours[id];
  if (!tours[id])
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      //   tours: tours[+req.params.id],
      tours: tour,
    },
  });
  res.send(console.log('Scuccess'));
};

const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  //   const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (!tours[+req.params.id])
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update tour here...>',
    },
  });
  console.log(req.body);
};

const deleteTour = (req, res) => {
  if (!tours[+req.params.id])
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
  console.log('Success');
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not ye defined',
  });
};
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not ye defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not ye defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not ye defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is not ye defined',
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get(`/api/v1/tours/:id`, getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3 routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route(`/api/v1/tours/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//4 start server
const port = 3000;
app.listen(port, () => {
  console.log('App running');
});
