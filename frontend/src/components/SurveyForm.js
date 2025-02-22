import React, { useState } from 'react';
import axios from 'axios';

const surveyQuestions = {
  student: [
    { question: "What is the most significant global regulatory challenge for cryptocurrencies?", options: ["Tax compliance", "Money laundering prevention", "Consumer protection", "Market manipulation"] },
    { question: "What motivates most people to use cryptocurrencies?", options: ["Lower transaction fees", "Investment potential", "Global accessibility", "Anonymity"] },
    { question: "Most reliable cryptocurrency information source?", options: ["Government reports", "Crypto exchanges", "Independent research", "Social media"] },
    { question: "What ensures cryptocurrency transaction security?", options: ["Cryptographic algorithms", "Bank verification", "Government oversight", "Manual checks"] },
    { question: "How often do you send international remittances?", options: ["Never", "Quarterly", "Monthly", "Weekly"] },
    { question: "What is the primary advantage of using cryptocurrency for international remittances?", options: ["Lower fees", "Faster transfer", "Anonymity", "Global accessibility"] },
    { question: "How important is regulatory compliance to you?", options: ["Very important", "Somewhat important", "Neutral", "Not important"] },
    { question: "What is the biggest challenge in using cryptocurrency for remittances?", options: ["Price volatility", "Complex technology", "Regulatory uncertainties", "Limited acceptance"] },
    { question: "Which cryptocurrency is most commonly used for international remittances?", options: ["Bitcoin", "Ethereum", "Ripple", "Stablecoin"] },
    { question: "What is your preferred verification method for transactions?", options: ["Email confirmation", "SMS", "Biometric", "Two-factor authentication"] }
  ],
  trader: [
    { question: "What is the most significant global regulatory challenge for cryptocurrencies?", options: ["Tax compliance", "Money laundering prevention", "Consumer protection", "Market manipulation"] },
    { question: "What motivates most people to use cryptocurrencies?", options: ["Lower transaction fees", "Investment potential", "Global accessibility", "Anonymity"] },
    { question: "Most reliable cryptocurrency information source?", options: ["Government reports", "Crypto exchanges", "Independent research", "Social media"] },
    { question: "What ensures cryptocurrency transaction security?", options: ["Cryptographic algorithms", "Bank verification", "Government oversight", "Manual checks"] },
    { question: "Which factor most influences your decision to use crypto for remittances?", options: ["Transfer speed", "Transaction costs", "Exchange rate", "Regulatory compliance"] },
    { question: "How do you stay updated on cryptocurrency market trends?", options: ["Daily news", "Specialized platforms", "Social media", "Professional networks"] },
    { question: "How important is regulatory compliance in your trading?", options: ["Extremely important", "Very important", "Somewhat important", "Not important"] },
    { question: "How do you perceive the risk of cryptocurrency in international money transfers?", options: ["High risk", "Moderate risk", "Low risk", "No risk"] },
    { question: "What is your preferred verification method for transactions?", options: ["Two-factor authentication", "Biometric", "Email confirmation", "SMS"] },
    { question: "What is your preferred blockchain technology for remittances?", options: ["Bitcoin", "Ethereum", "Ripple", "Stellar"] }
  ],
  bankEmployee: [
    { question: "What is the most significant global regulatory challenge for cryptocurrencies?", options: ["Tax compliance", "Money laundering prevention", "Consumer protection", "Market manipulation"] },
    { question: "What motivates most people to use cryptocurrencies?", options: ["Lower transaction fees", "Investment potential", "Global accessibility", "Anonymity"] },
    { question: "Most reliable cryptocurrency information source?", options: ["Government reports", "Crypto exchanges", "Independent research", "Social media"] },
    { question: "What ensures cryptocurrency transaction security?", options: ["Cryptographic algorithms", "Bank verification", "Government oversight", "Manual checks"] },
    { question: "How do banks currently handle international money transfers?", options: ["Traditional SWIFT", "Correspondent banking", "Emerging fintech solutions", "Multiple methods"] },
    { question: "How do banks stay updated on cryptocurrency developments?", options: ["Dedicated research teams", "Industry conferences", "External consultants", "Minimal tracking"] },
    { question: "What motivates banks to explore cryptocurrency remittances?", options: ["Cost efficiency", "Customer expectations", "Technological innovation", "Competitive positioning"] },
    { question: "How important is regulatory compliance in cryptocurrency adoption?", options: ["Extremely important", "Very important", "Somewhat important", "Not important"] },
    { question: "What is the primary concern for banks regarding crypto remittances?", options: ["Security risks", "Regulatory compliance", "Loss of market share", "Technology complexity"] },
    { question: "How do banks manage cryptocurrency transaction risks?", options: ["Risk assessment teams", "Insurance", "Hedging strategies", "Minimal strategies"] },
    { question: "How do banks prioritize transaction security?", options: ["Highest priority", "High priority", "Moderate priority", "Low priority"] },
    { question: "What additional support would help banks adopt crypto remittances?", options: ["Regulatory clarity", "Technology partnerships", "Customer education", "Risk management tools"] },
    { question: "What is the preferred verification method for international transactions?", options: ["Multi-factor authentication", "Biometric", "Email confirmation", "SMS"] }
  ]
};

function SurveyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ageGroup: '',
    section: '',
    answers: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axios.post('https://project-crypto-ecru.vercel.app/api/submit', formData);
      alert('Survey submitted successfully!');
      setFormData({
        name: '',
        email: '',
        ageGroup: '',
        section: '',
        answers: {}
      });
    } catch (error) {
      if (error.response && error.response.status !== 201) {
        console.error('Error submitting survey:', error);
        alert('There was an error submitting your survey. Please try again.');
      } else {
        alert('Survey submitted, but there was an issue processing the response.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (question, option) => {
    let newAnswers = { ...formData.answers };
    if (!newAnswers[question]) {
      newAnswers[question] = [];
    }
    if (newAnswers[question].includes(option)) {
      newAnswers[question] = newAnswers[question].filter(opt => opt !== option);
    } else {
      newAnswers[question].push(option);
    }
    setFormData({ ...formData, answers: newAnswers });
  };

  const allQuestionsAnswered = () => {
    if (!formData.section || !surveyQuestions[formData.section]) return false;
    return surveyQuestions[formData.section].every(q => 
      formData.answers[q.question] && formData.answers[q.question].length > 0
    );
  };

  const renderQuestions = () => {
    if (!formData.section) return null;
    return surveyQuestions[formData.section].map((q, index) => (
      <div key={index}>
        <h4>{q.question}</h4>
        {q.options.map(option => (
          <label key={option}>
            <input 
              type="checkbox" 
              onChange={() => handleMultiSelect(q.question, option)}
              checked={formData.answers[q.question]?.includes(option) || false}
            /> <span>{option}</span>
          </label>
        ))}
      </div>
    ));
  };

  return (
    <div className="survey-container">
      <h1 className="survey-title">"Study On Role Of Cryptocurrency As A Cost-Effective Alternatives For International Remittances"</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} required disabled={isSubmitting} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required disabled={isSubmitting} />
        <select name="ageGroup" onChange={handleChange} value={formData.ageGroup} required disabled={isSubmitting}>
          <option value="">Select Age Group</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="50+">50+</option>
        </select>
        <select name="section" onChange={handleChange} value={formData.section} required disabled={isSubmitting}>
          <option value="">Select Section</option>
          <option value="student">Student</option>
          <option value="trader">Trader</option>
          <option value="bankEmployee">Bank Employee</option>
        </select>
        {renderQuestions()}
        <button type="submit" disabled={isSubmitting || !allQuestionsAnswered()}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <footer className="survey-footer">A Project by Nibedita Chakraborty</footer>
    </div>
  );
}

export default SurveyForm;