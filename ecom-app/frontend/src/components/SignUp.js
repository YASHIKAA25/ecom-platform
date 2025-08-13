// frontend/src/components/SignUp.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Fade } from '@mui/material';
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = () => {
    axios.post('http://localhost:5000/api/register', { username, password })
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage(error.response.data.error || 'Error registering user'));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4">Sign Up</Typography>
      </Fade>
      <Box component="form" sx={{ mt: 2 }}>
        <Fade in={true}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" />
        </Fade>
        <Fade in={true}>
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
        </Fade>
        <Fade in={true}>
          <Button variant="contained" color="primary" onClick={handleSignUp} sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </Fade>
      </Box>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Container>
  );
};

export default SignUp;
