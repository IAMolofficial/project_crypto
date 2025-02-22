import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

let surveys = [];

const surveysFile = resolve('surveys.json');

try {
  const data = readFileSync(surveysFile, 'utf8');
  surveys = JSON.parse(data);
} catch (error) {
  console.warn('No surveys.json file found or error reading it, starting fresh.');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, ageGroup, section, answers } = req.body;

    const formattedAnswers = Object.entries(answers).map(([question, selectedOptions]) => ({
      question,
      selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : []
    }));

    const survey = {
      id: surveys.length + 1,
      name,
      email,
      ageGroup,
      section,
      answers: formattedAnswers,
      submissionDate: new Date().toISOString()
    };

    surveys.push(survey);

    writeFileSync(surveysFile, JSON.stringify(surveys, null, 2));

    res.status(201).json({ message: 'Survey submitted successfully', id: survey.id });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ message: 'Error submitting survey', error: error.message });
  }
}