const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); //this is middleware (se aflta intre requesti si response)

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

console.log(typeof tours);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
  res.send(console.log('hau'));
});

app.get(`/api/v1/tours/:id`, (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log('App running');
});
