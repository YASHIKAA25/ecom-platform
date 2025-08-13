// frontend/src/components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button, Grid, Fade } from '@mui/material';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => {
        console.error('Error fetching product details:', error);
        setErrorMessage('Product not found or an error occurred.');
      });
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === product.id);
    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  const handleAddToWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Product added to wishlist!');
    } else {
      alert('Product is already in wishlist!');
    }
  };

  if (errorMessage) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">{errorMessage}</Typography>
      </Container>
    );
  }

  if (!product) return <div>Loading...</div>;

  const imageVariants = { hover: { scale: 1.05 } };

  return (
    <Container sx={{ mt: 4 }}>
      <Fade in={true} timeout={600}>
        <Box>
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </Box>
      </Fade>
      <Fade in={true} timeout={600}>
        <Typography variant="h4" sx={{ mt: 2 }}>{product.name}</Typography>
      </Fade>
      <Fade in={true} timeout={600}>
        <Typography variant="h6">${product.price}</Typography>
      </Fade>
      <Fade in={true} timeout={600}>
        <Typography variant="body1" sx={{ my: 2 }}>{product.description}</Typography>
      </Fade>
      <Fade in={true} timeout={600}>
        <Typography variant="body2" color="text.secondary">
          Category: {product.category}
        </Typography>
      </Fade>
      <Fade in={true} timeout={600}>
        <Typography variant="body2" color="text.secondary">
          In Stock: {product.in_stock}
        </Typography>
      </Fade>
      {product.trending && (
        <Fade in={true} timeout={600}>
          <Typography variant="body2" color="primary">
            Trending
          </Typography>
        </Fade>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button variant="outlined" color="primary" onClick={handleAddToWishlist}>
          Add to Wishlist
        </Button>
      </Box>
      {product.more_images && product.more_images.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Fade in={true} timeout={600}>
            <Typography variant="h6" sx={{ mb: 2 }}>More Images</Typography>
          </Fade>
          <Grid container spacing={2}>
            {product.more_images.map((img, idx) => (
              <Grid item xs={6} md={4} key={idx}>
                <Fade in={true} timeout={600} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <motion.img
                    src={img}
                    alt={`More ${product.name} ${idx + 1}`}
                    style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
                    whileHover="hover"
                    variants={imageVariants}
                  />
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetails;
