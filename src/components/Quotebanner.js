import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const QuoteBanner = () => {
  const [quote, setQuote] = useState('Stay positive and keep pushing forward!');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://zenquotes.io/api/random');
        setQuote(response.data[0].q);
      } catch (err) {
        console.error('Quote fetch failed, showing fallback quote.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#fdf6e3',
          borderRadius: '12px',
          padding: '15px 25px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <Spinner animation="border" size="sm" /> Loading motivation...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#fdf6e3',
        borderRadius: '12px',
        padding: '20px 25px',
        marginBottom: '20px',
      }}
    >
      <h5 style={{ fontWeight: '600' }}>✨ Daily Motivation</h5>
      <p className="m-0" style={{ fontStyle: 'italic' }}>
        "{quote}"
      </p>
    </div>
  );
};

export default QuoteBanner;
