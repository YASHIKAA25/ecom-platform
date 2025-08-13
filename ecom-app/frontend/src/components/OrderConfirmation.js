// frontend/src/components/OrderConfirmation.js
import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, Box, Fade } from '@mui/material';
import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Fade in={true}>
          <Typography variant="h4">No Order Found</Typography>
        </Fade>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4" sx={{ mb: 2 }}>Order Confirmation</Typography>
      </Fade>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Order ID: {order.order_id}</Typography>
        <Typography variant="subtitle1">Total: ${order.total}</Typography>
        <Typography variant="subtitle1">Shipping Name: {order.shipping_name}</Typography>
        <Typography variant="subtitle1">Shipping Address: {order.shipping_address}</Typography>
        <Typography variant="subtitle1">Shipping Email: {order.shipping_email}</Typography>
        <Typography variant="caption" color="text.secondary">
          Order Date: {new Date(order.created_at).toLocaleString()}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6"></Typography>
      <List>
        {order.items && order.items.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={`Product ID: ${item.product_id}`} secondary={`Quantity: ${item.quantity} | Price: $${item.price}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default OrderConfirmation;
