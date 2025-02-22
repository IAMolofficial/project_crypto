import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Parser } from 'json2csv';

const surveysFile = resolve('surveys.json');
let surveys = [];

try {
  const data = readFileSync(surveysFile, 'utf8');
  surveys = JSON.parse(data);
} catch (error) {
  console.warn('No surveys.json file found or error reading it, returning empty.');
  surveys = [];
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!surveys || surveys.length === 0) {
      return res.status(404).json({ message: 'No surveys found to export' });
    }

    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Email Address', value: 'email' },
      { label: 'Age Group', value: 'ageGroup' },
      { label: 'Section', value: 'section' }
    ];

    const allQuestions = [...new Set(surveys.flatMap(survey => 
      survey.answers.map(answer => answer.question)
    ))];

    allQuestions.forEach(question => {
      fields.push({
        label: question,
        value: row => {
          const surveyAnswer = row.answers.find(a => a.question === question);
          return surveyAnswer ? surveyAnswer.selectedOptions.join(', ') : '';
        }
      });
    });

    const json2csvParser = new Parser({ fields });

    const csvData = surveys.map(survey => {
      const row = {
        name: survey.name,
        email: survey.email,
        ageGroup: survey.ageGroup,
        section: survey.section,
        ...survey.answers.reduce((acc, answer) => {
          acc[answer.question] = answer.selectedOptions.join(', ');
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
}