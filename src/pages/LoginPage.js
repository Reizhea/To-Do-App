import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, loadAuthFromStorage } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadAuthFromStorage());
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [auth.isAuthenticated, dispatch, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      dispatch(login({ username }));
      navigate('/dashboard');
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: '100vh', background: '#f7f8fa' }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <h2 className="text-center mb-4" style={{ fontWeight: '600' }}>
          Welcome to To-Do App
        </h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '500' }}>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #ced4da',
              }}
              required
            />
          </Form.Group>
          <Button
            type="submit"
            className="w-100"
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#4b7bec',
              border: 'none',
              fontWeight: '600',
            }}
          >
            Log In
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
