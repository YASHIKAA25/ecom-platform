// frontend/src/components/Checkout.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Fade } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to place your order.');
      navigate('/login');
      return;
    }
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (!shippingName || !shippingAddress || !shippingEmail) {
      alert('Please fill in all shipping details.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderPayload = {
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_email: shippingEmail,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };

    axios.post('http://localhost:5000/api/orders', orderPayload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        localStorage.removeItem('cart');
        navigate('/order-confirmation', { state: response.data.order });
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('Error placing order. Please check your shipping details and try again.');
      });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4">Checkout</Typography>
      </Fade>
      <Box component="form" sx={{ mt: 2 }}>
        <Fade in={true}>
          <TextField
            fullWidth
            label="Shipping Name"
            margin="normal"
            value={shippingName}
            onChange={(e) => setShippingName(e.target.value)}
          />
        </Fade>
        <Fade in={true}>
          <TextField
            fullWidth
            label="Shipping Address"
            margin="normal"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </Fade>
        <Fade in={true}>
          <TextField
            fullWidth
            label="Shipping Email"
            margin="normal"
            value={shippingEmail}
            onChange={(e) => setShippingEmail(e.target.value)}
          />
        </Fade>
        <Fade in={true}>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCheckout}>
            Place Order
          </Button>
        </Fade>
      </Box>
    </Container>
  );
};

export default Checkout;
