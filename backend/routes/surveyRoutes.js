const express = require('express');
const router = express.Router();
const Survey = require('../models/surveyModel');
const { Parser } = require('json2csv');

// Admin-only CSV export with simplified format, sent as downloadable file
router.get('/export', async (req, res) => {
  try {
    const surveys = await Survey.find({});

    if (!surveys || surveys.length === 0) {
      return res.status(404).json({ message: 'No surveys found to export' });
    }

    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Email Address', value: 'email' },
      { label: 'Age Group', value: 'ageGroup' },
      { label: 'Section', value: 'section' }
    ];

    // Collect all unique questions across all surveys
    const allQuestions = [...new Set(surveys.flatMap(survey => 
      survey.answers.map(answer => answer.question)
    ))];

    // Add fields for each unique question, with a safeguard for undefined answers
    allQuestions.forEach(question => {
      fields.push({
        label: question,
        value: row => {
          if (!row.answers || !Array.isArray(row.answers)) {
            return '';
          }
          const surveyAnswer = row.answers.find(a => a.question === question);
          return surveyAnswer && surveyAnswer.selectedOptions 
            ? surveyAnswer.selectedOptions.join(', ') 
            : '';
        }
      });
    });

    const json2csvParser = new Parser({ fields });

    const csvData = surveys.map(survey => {
      const row = {
        name: survey.name || '',
        email: survey.email || '',
        ageGroup: survey.ageGroup || '',
        section: survey.section || '',
        ...survey.answers.reduce((acc, answer) => {
          acc[answer.question] = answer.selectedOptions ? answer.selectedOptions.join(', ') : '';
          return acc;
        }, {})
      };
      return row;
    });

    const csv = json2csvParser.parse(csvData);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=survey_data.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    // Check for duplicate submission
    const recentSurvey = await Survey.findOne({
      email: req.body.email,
      submissionDate: { $gte: new Date(Date.now() - 60000) } // Last minute
    });

    if (recentSurvey) {
      return res.status(400).json({ message: 'A survey was recently submitted with this email. Please wait before submitting again.' });
    }

    // Transform answers from frontend format (object) to backend schema (array of objects)
    const answers = Object.entries(req.body.answers).map(([question, selectedOptions]) => ({
      question,
      selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : []
    }));

    const surveyData = {
      name: req.body.name,
      email: req.body.email,
      ageGroup: req.body.ageGroup,
      section: req.body.section,
      answers
    };

    const survey = new Survey(surveyData);
    await survey.save();

    res.status(201).json({ message: 'Survey submitted successfully', id: survey._id });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ message: 'Error submitting survey', error: error.message });
  }
});

module.exports = router;