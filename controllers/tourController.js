const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

const checkID = (req, res, next, val) => {
  const { id } = req.params;
  // const id = req.params.id * 1;
  if (!tours[id])
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'fail',
      message: 'price and name not included',
    });
  next();
};

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
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours[+req.params.id],
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
    },
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update tour here...>',
    },
  });
  console.log(req.body);
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
  console.log('Success');
};

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  checkID,
  checkBody,
};
