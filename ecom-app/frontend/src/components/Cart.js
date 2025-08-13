// frontend/src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton, TextField, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items);
  }, []);
  
  const updateQuantity = (id, newQty) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4">Shopping Cart</Typography>
      </Fade>
      {cartItems.length === 0 ? (
        <Fade in={true}>
          <Typography>Your cart is empty.</Typography>
        </Fade>
      ) : (
        <List>
          {cartItems.map((item, index) => (
            <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }} key={item.id}>
              <ListItem divider>
                <ListItemText 
                  primary={item.name} 
                  secondary={`Price: $${item.price} | Quantity: ${item.quantity}`} 
                />
                <TextField 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} 
                  inputProps={{ min: 1 }}
                  sx={{ width: '80px', mr: 2 }}
                />
                <IconButton edge="end" onClick={() => removeItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </Fade>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" component={Link} to="/checkout" disabled={cartItems.length === 0}>
        Proceed to Checkout
      </Button>
    </Container>
  );
}

export default Cart;
