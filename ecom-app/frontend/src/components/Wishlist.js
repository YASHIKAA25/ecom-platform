// frontend/src/components/Wishlist.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, IconButton, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlistItems(items);
  }, []);

  const removeItem = (id) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.find(item => item.id === product.id)) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart!');
    } else {
      alert('This product is already in your cart!');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true}>
        <Typography variant="h4">Wishlist</Typography>
      </Fade>
      {wishlistItems.length === 0 ? (
        <Fade in={true}>
          <Typography>Your wishlist is empty.</Typography>
        </Fade>
      ) : (
        <List>
          {wishlistItems.map((item, index) => (
            <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }} key={item.id}>
              <ListItem divider>
                <ListItemText
                  primary={item.name}
                  secondary={`Price: $${item.price} | Category: ${item.category}`}
                />
                <Button variant="outlined" color="primary" onClick={() => addToCart(item)}>
                  Add to Cart
                </Button>
                <IconButton edge="end" onClick={() => removeItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </Fade>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" component={Link} to="/cart" sx={{ mt: 2 }}>
        Go to Cart
      </Button>
    </Container>
  );
};

export default Wishlist;
