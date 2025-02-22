// D:\MBA\project_crypto\backend\api\submit.js
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { Parser } from 'json2csv';

// In-memory storage for simplicity (not persistent across deployments)
let surveys = [];

// Load surveys from JSON file if it exists (for persistence within deployment)
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

    // Transform answers from frontend format (object) to array of objects
    const formattedAnswers = Object.entries(answers).map(([question, selectedOptions]) => ({
      question,
      selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : []
    }));

    const survey = {
      id: surveys.length + 1, // Simple increment for ID
      name,
      email,
      ageGroup,
      section,
      answers: formattedAnswers,
      submissionDate: new Date().toISOString()
    };

    surveys.push(survey);

    // Save to JSON file for persistence within deployment
    writeFileSync(surveysFile, JSON.stringify(surveys, null, 2));

    res.status(201).json({ message: 'Survey submitted successfully', id: survey.id });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ message: 'Error submitting survey', error: error.message });
  }
}