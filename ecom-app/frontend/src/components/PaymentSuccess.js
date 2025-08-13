// frontend/src/components/PaymentSuccess.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PaymentSuccess() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Payment Successful!</Typography>
      <Typography>Your payment was successful and your order is confirmed.</Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Continue Shopping
      </Button>
    </Container>
  );
}

export default PaymentSuccess;
