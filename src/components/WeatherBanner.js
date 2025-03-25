import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const WeatherBanner = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        setWeatherData(res.data.current_weather);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#eaf4fc',
          borderRadius: '12px',
          padding: '15px 25px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <Spinner animation="border" size="sm" /> Loading weather...
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div
      style={{
        backgroundColor: '#eaf4fc',
        borderRadius: '12px',
        padding: '20px 25px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h5 style={{ fontWeight: '600' }}>🌤️ Outdoor Task Weather Update</h5>
        <p className="m-0">
          Current temp: <strong>{weatherData.temperature}°C</strong> | Wind: <strong>{weatherData.windspeed} km/h</strong>
        </p>
        <p className="text-muted small m-0">
          {weatherData.temperature > 30
            ? "It's quite hot outside — stay hydrated! 🥵"
            : weatherData.temperature < 15
            ? "Bit chilly outside — carry a jacket! 🧥"
            : "Perfect weather for your outdoor task! ✅"}
        </p>
      </div>
    </div>
  );
};

export default WeatherBanner;
