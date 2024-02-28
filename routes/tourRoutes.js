const express = require('express');
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', (req, res, next, value) => {
  console.log(`Tours id is ${value}`);
  next();
});

router.route('/').get(getAllTours).post(createTour);
router.route(`/:id`).get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
