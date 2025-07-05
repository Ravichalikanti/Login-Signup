import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Link,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ 
    username: '', 
    password: '',
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/register', {
        username: form.username,
        password: form.password
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <Paper elevation={3} sx={{ 
        width: 350, 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          margin="normal"
        />
        
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          margin="normal"
        />
        
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          margin="normal"
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleRegister}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link href="/login" underline="hover">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;