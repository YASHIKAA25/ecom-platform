// frontend/src/components/PaymentCancel.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function PaymentCancel() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Payment Cancelled</Typography>
      <Typography>Your payment was cancelled. Please try again.</Typography>
      <Button variant="contained" color="primary" component={Link} to="/cart">
        Return to Cart
      </Button>
    </Container>
  );
}

export default PaymentCancel;
