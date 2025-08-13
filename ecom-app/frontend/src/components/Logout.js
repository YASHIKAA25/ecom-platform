// frontend/src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@mui/material';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  }, [navigate]);

  return <Fade in={true}><div>Logging out...</div></Fade>;
};

export default Logout;
