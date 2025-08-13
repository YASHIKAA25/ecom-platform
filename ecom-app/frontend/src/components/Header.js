// frontend/src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const accessToken = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Products', path: '/' },
    { text: 'Cart', path: '/cart' },
    { text: 'Wishlist', path: '/wishlist' }
  ];
  if (accessToken) {
    menuItems.push({ text: 'Orders', path: '/orders' });
  }

  const drawer = (
    <div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      <List>
        {menuItems.map((item, index) => (
          <ListItem button component={Link} to={item.path} key={index}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {accessToken ? (
          <ListItem button component={Link} to="/logout">
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <>
            <ListItem button component={Link} to="/signup">
              <ListItemText primary="Sign Up" />
            </ListItem>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              E-Commerce
            </Typography>
            {accessToken && (
              <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            )}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              E-Commerce
            </Typography>
            {menuItems.map((item, index) => (
              <Button key={index} color="inherit" component={Link} to={item.path}>
                {item.text}
              </Button>
            ))}
            {accessToken ? (
              <>
                <Avatar sx={{ bgcolor: 'primary.main', ml: 2, width: { xs: 32, sm: 40, md: 48 }, height: { xs: 32, sm: 40, md: 48 } }}>
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Button color="inherit" component={Link} to="/logout" sx={{ ml: 1 }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
