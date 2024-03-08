/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [5, 'A tour must have more or equal then 5 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain charcaters'],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below or equal to 5.0'],
  },
  ratingsQuantity: { type: Number, default: 0 },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (value) {
        // this only points to current doc on NEW document creation
        return value < this.price;
      },
      message: 'Didcount price ({VALUE}) should be below regular price',
    },
  },
  summary: {
    type: String,
    trim: true, //cineva introduce "        This tour was cool    ", elimina spatiile de la inceput si sfarsit
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  },
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  //this points to the document(file being saved)
  this.slug = slugify(this.name, { lower: true });
  console.log(this);
  next();
});
// tourSchema.post('save', function (doc, next) {
//   //this points to the document(file saved)
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  //this points to the current query
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  //this points to the current aggregation object
  this.pipelin().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
