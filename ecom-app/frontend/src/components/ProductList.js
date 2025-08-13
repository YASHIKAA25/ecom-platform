// frontend/src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Fade,
  TextField,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch products based on filters
  const fetchProducts = (params = {}) => {
    axios
      .get('http://localhost:5000/api/products', { params })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  // On mount, fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  // When search term changes, refetch products
  useEffect(() => {
    fetchProducts({ q: searchTerm });
  }, [searchTerm]);

  // When filter option or price range changes, build query parameters
  useEffect(() => {
    let params = { q: searchTerm };

    switch (filterOption) {
      case 'trending':
        params.trending = 'true';
        break;
      case 'in-stock':
        params.in_stock = 'true';
        break;
      case 'price-low-high':
        params.sort_by = 'price';
        params.order = 'asc';
        break;
      case 'price-high-low':
        params.sort_by = 'price';
        params.order = 'desc';
        break;
      case 'price-range':
        if (minPrice !== '' && maxPrice !== '') {
          params.min_price = minPrice;
          params.max_price = maxPrice;
        }
        break;
      default:
        break;
    }
    fetchProducts(params);
  }, [filterOption, minPrice, maxPrice, searchTerm]);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex((item) => item.id === product.id);
    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  const handleAddToWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!wishlist.find((item) => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Product added to wishlist!');
    } else {
      alert('Product is already in wishlist!');
    }
  };

  const cardVariants = {
    hover: { scale: 1.05, boxShadow: '0px 5px 15px rgba(0,0,0,0.3)' }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        Products
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '90%', sm: '400px' } }}
        />
      </Box>

      {/* Filters Dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <FormControl sx={{ width: { xs: '90%', sm: '300px' } }} variant="outlined">
          <InputLabel id="filter-label">Filters</InputLabel>
          <Select
            labelId="filter-label"
            value={filterOption}
            label="Filters"
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="trending">Trending</MenuItem>
            <MenuItem value="in-stock">In Stock</MenuItem>
            <MenuItem value="price-low-high">Price (Low to High)</MenuItem>
            <MenuItem value="price-high-low">Price (High to Low)</MenuItem>
            <MenuItem value="price-range">Price Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* If Price Range filter is selected, show inputs */}
      {filterOption === 'price-range' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <TextField
            label="Min Price"
            type="number"
            variant="outlined"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: { xs: '45%', sm: '140px' } }}
          />
          <TextField
            label="Max Price"
            type="number"
            variant="outlined"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: { xs: '45%', sm: '140px' } }}
          />
          <Button variant="contained" onClick={() => fetchProducts({ q: searchTerm, filter: 'price-range', min_price: minPrice, max_price: maxPrice })}>
            Apply
          </Button>
        </Box>
      )}

      {/* Products Grid */}
      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <motion.div whileHover="hover" variants={cardVariants}>
                <Card sx={{ transition: 'transform 0.3s, box-shadow 0.3s' }}>
                  <CardActionArea component={Link} to={`/product/${product.id}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {product.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        In Stock: {product.in_stock}
                      </Typography>
                      {product.trending && (
                        <Typography variant="body2" color="primary">
                          Trending
                        </Typography>
                      )}
                      {/* Add Cart & Wishlist Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" size="small" onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => handleAddToWishlist(product)}>
                          Add to Wishlist
                        </Button>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
