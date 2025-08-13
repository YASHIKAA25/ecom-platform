// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Fade } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:5000/api/login', { username, password })
      .then(response => {
        setMessage(response.data.message);
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('username', username);
      })
      .catch(error => setMessage(error.response.data.error || 'Error logging in'));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4">Login</Typography>
      </Fade>
      <Box component="form" sx={{ mt: 2 }}>
        <Fade in={true}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" />
        </Fade>
        <Fade in={true}>
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
        </Fade>
        <Fade in={true}>
          <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
            Login
          </Button>
        </Fade>
      </Box>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Container>
  );
};

export default Login;
