// frontend/src/components/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider, Fade } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    axios.get('http://localhost:5000/api/orders/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching order history:', error));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4" sx={{ mb: 2 }}>Order History</Typography>
      </Fade>
      {orders.length === 0 ? (
        <Fade in={true}>
          <Typography>No orders found.</Typography>
        </Fade>
      ) : (
        orders.map(order => (
          <Accordion key={order.order_id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Order #{order.order_id} - Total: ${order.total}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1">Shipping Details:</Typography>
              <Typography>Name: {order.shipping_name}</Typography>
              <Typography>Address: {order.shipping_address}</Typography>
              <Typography>Email: {order.shipping_email}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1">Items:</Typography>
              <List>
                {order.items.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={`Product ID: ${item.product_id}`} secondary={`Quantity: ${item.quantity} | Price: $${item.price}`} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="caption" color="text.secondary">
                Order Date: {new Date(order.created_at).toLocaleString()}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default OrderHistory;
