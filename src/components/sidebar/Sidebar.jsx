import React from 'react'
import './sidebar.scss';
import {auth} from '../../context/firebase';
import {signOut} from 'firebase/auth'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ViewStreamTwoToneIcon from '@mui/icons-material/ViewStreamTwoTone';
import QueryStatsTwoToneIcon from '@mui/icons-material/QueryStatsTwoTone';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { NavLink,useNavigate, } from 'react-router-dom';
import logo from '../../images/logo.png';

function Sidebar({setSidebar}) {
  let navigate = useNavigate();
  function navLinkStyles({isActive}) {
    return {
      color:isActive ? '#ece8ff' : 'white',
      // borderBottom:isActive ? '2px solid purple' : null,
      // padding:isActive ? '2px 10px' : null,
      // borderRadius:isActive ? '15px' : null,
      textDecoration:'none',
      zIndex:5,
    }
  }

  return (
    <div className='sidebar'>
      <div className="top">
          <div className="item" onClick={(e) => {e.stopPropagation();setSidebar()}}>
            <CloseIcon className='icon'/>
          </div>
        <NavLink to='/' style={{textDecoration:'none'}} onClick={(e) => e.stopPropagation()}>
          <img src={logo} alt="UserPanel" className='logo'/>
        </NavLink>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Main</p>
          <NavLink to='/user' style={navLinkStyles}>
          <li>
            <AccountBoxIcon className='icon'/>
            <span>Profile</span>
          </li>
          </NavLink>  
          <NavLink to='/user/dashboard' style={navLinkStyles}>
          <li>
            <DashboardIcon className='icon'/>
            <span>Dashboard</span>
          </li>
          </NavLink>
          <p className="title">List</p>
          <li style={{cursor:'not-allowed'}}>
          <span style={{textDecoration:'none',color:'grey',cursor:'not-allowed'}}>
            <PeopleIcon className='icon' style={{color:'grey'}}/>
            <span style={{color:'grey'}}>Users</span>
          </span>
          </li>
          <NavLink to='/user/list' style={navLinkStyles}>
          <li>
            <AddBusinessIcon className='icon'/>
            <span>Products</span>
          </li>
          </NavLink>
            <NavLink to='/user/card' style={navLinkStyles}> 
          <li>
              <ViewStreamTwoToneIcon className='icon'/>
              <span>Card</span>
          </li>
            </NavLink>
            <NavLink to='/user/purchased' style={navLinkStyles}> 
          <li>
              <StoreOutlinedIcon className='icon'/>
              <span>Purchased</span>
          </li>
            </NavLink>
            <NavLink to='/user/liked' style={navLinkStyles}> 
          <li>
              <FavoriteBorderOutlinedIcon className='icon'/>
              <span>Liked</span>
          </li>
            </NavLink>
          <p className="title">Userful</p>
          <NavLink to='/user/messenger' style={navLinkStyles}> 
          <li>
            <QueryStatsTwoToneIcon className='icon'/>
            <span>Contact Admin</span>
          </li>
          </NavLink>  
          <NavLink to='/user/notification' style={navLinkStyles}> 
          <li>
            <NotificationsActiveTwoToneIcon className='icon'/>
            <span>Notifications</span>
          </li>
          </NavLink>  
          <p className="title">User</p>
          <li onClick={() => navigate('/login')}>
            <LoginTwoToneIcon className='icon'/>
            <span>Logs</span>
          </li>
          <a href="/" style={{textDecoration:'none'}}>
            <li onClick={() => {signOut(auth).then(() => {
                localStorage.removeItem('userId');
                localStorage.removeItem('userToken');
              })}}>
              <LogoutIcon className='icon'/>
              <span>Logout</span>
            </li>
          </a> 
        </ul>
      </div>
    </div>
  )
}

export default Sidebar