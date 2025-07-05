import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Link } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      localStorage.setItem('auth', JSON.stringify({ token: res.data.token }));
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ width: 350, p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={form.username}
          onChange={(e) => setForm({...form, username: e.target.value})}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link href="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;