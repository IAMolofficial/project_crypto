const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  answers: [{
    question: {
      type: String,
      required: true
    },
    selectedOptions: {
      type: [String],
      required: true,
      default: []  // Ensure it's initialized as an empty array
    }
  }],
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Survey', surveySchema);