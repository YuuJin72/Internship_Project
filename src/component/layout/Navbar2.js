import './Navbar2.css'
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MoreIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { Modal } from '../modal/Modal';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { loginState } from '../../store/user';
import { nicknameState } from '../../store/getnickname'
import logo from '../../assets/images/Logo.png'

// 네비게이션 바

const Navbar2 = () => {
  const user = useSelector((state) => state.user.value)
  const nickname = useSelector((state) => state.getnickname.value)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const { Success } = Modal();
  
  const handleHome = () => {
    navigate('/')
    handleMobileMenuClose()
  }

  const handleStudy = () => {
    navigate('/study')
    handleMobileMenuClose()
  }

  const handleLogIn = () => {
    navigate('/signin')
    handleMenuClose()
  }

  const handleSignup = () => {
    navigate('/signup')
    handleMenuClose()
  }

  const handleMyPage = () => {
    navigate('/mypage')
    handleMenuClose()
  }

  const handleLogout = () => {
    axios.post("http://localhost:8080/signout")
    .then((res) => {
      handleMenuClose()
      Success('로그아웃 완료')
      dispatch(loginState(false))
      dispatch(nicknameState(''))
      navigate('/')
    })
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {!user && <MenuItem onClick={handleLogIn}>로그인</MenuItem>}
        {!user && <MenuItem onClick={handleSignup}>회원가입</MenuItem>}
        {user && <MenuItem onClick={handleLogout}>로그아웃</MenuItem>}
        {user && <MenuItem onClick={handleMyPage}>내 정보 보기</MenuItem>}
      </Menu>
    </>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleHome}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <HomeIcon />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem onClick={handleStudy}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <AutoStoriesIcon />
        </IconButton>
        <p>Study</p>
      </MenuItem>
      {!user &&  <MenuItem onClick={handleLogIn}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
          로그인
      </MenuItem>}
      {user && <MenuItem onClick={handleLogout}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        로그아웃
      </MenuItem>}
      {!user && <MenuItem onClick={handleSignup}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        회원가입
      </MenuItem>}
      {user && <MenuItem onClick={handleMyPage}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
          내 정보 보기
      </MenuItem>}
    </Menu>
  );

  return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color='darkblue'>
          <Toolbar>
            <img src= {logo} alt='logo' style={{height: '5rem', width: '8.5rem', cursor: 'pointer'}} onClick={handleHome}/> 
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {user ? 
              <Typography sx={{mr: 3}}>
                {nickname} 님, 환영합니다! 
              </Typography> 
              : 
              <Typography sx={{mr: 3}}> 
                로그인하여 서비스를 이용해보세요!
              </Typography>}
              <IconButton size="large" 
              color="inherit" 
              onClick={handleHome}>
                <HomeIcon  />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleStudy}
              >
                <AutoStoriesIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
  );
}

export default Navbar2;