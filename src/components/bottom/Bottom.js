import React,{useState,useContext} from 'react';
import { Icon } from '@iconify/react';
import {useNavigate} from 'react-router-dom'
import {DataContext} from '../../context/Context'
import './bottom.scss'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
function Bottom() {
    let {state} = useContext(DataContext)
    let [mobile_bottom, setMobile_bottom] = useState({home:'#40bfff',explore:'grey',cart:'grey',account:'grey',offer:'grey'})
    let navigate = useNavigate();

    function changeColorOfMobile_bottom(name) {
        setMobile_bottom({home:'grey',explore:'grey',cart:'grey',account:'grey',offer:'grey',[name]:'#40bfff'})
    }

        
    if( window.location.pathname == '/login' || window.location.pathname == '/signup') {
      return null;
    }

    if(!localStorage.getItem('userToken') && window.location.pathname != '/login' || !localStorage.getItem('userToken') && window.location.pathname != '/signup'){
      return <div className='login_first'>
        <button onClick={() => navigate('/login')}><LockOpenIcon className='icon'/>Log in</button>
        <button onClick={() => navigate('/signup')}><AssignmentIndIcon className='icon'/> Sign up</button>
      </div>
    }
    console.log(window.location.pathname)

    function lightUp(path) {
      return window.location.pathname == path ? {color:'#40bfff'} : path.includes('car') && window.location.pathname.includes('car') ? {color:'#40bfff'} : {color:'grey'};
    }
  return (
    <div className="mobile_bottom" style={{transition:'200ms'}}>
    <div className="options home" onClick={ () => {changeColorOfMobile_bottom('home'); navigate('/')}} style={lightUp('/')}>
        <Icon icon="ant-design:home-outlined" width="27" height="27" />
        <p className="text" style={lightUp('/')}>Home</p>
    </div>
    
    <div className="options explore" onClick={ () => {changeColorOfMobile_bottom('explore')}} style={lightUp('s#')}>
      <a href='#'>
        <Icon icon="akar-icons:search" style={lightUp('s#')} width="27" height="27" />
        <p className="text" style={lightUp('s#')}>Explore</p>
      </a>
    </div>
    <div className="options cart" onClick={ () => {changeColorOfMobile_bottom('cart');navigate('/cart')}} style={lightUp('/user/card')}>
     <span className="trolley"> <Icon icon="wpf:luggage-trolley"  width="27" height="27" /></span>
      <p className="text" style={lightUp('/user/card')}>Cart</p>
    </div>
    <div className="options offer" onClick={ () => {changeColorOfMobile_bottom('offer'); navigate('/user/liked')}} style={lightUp('/user/liked')}>
      <Icon icon="ic:outline-local-offer" width="27" height="27" />
      <p className="text" style={lightUp('/user/liked')}>Offer</p>
    </div>
    <div className="options account" onClick={ () => {changeColorOfMobile_bottom('account'); navigate('/user')}}>
      <Icon icon="mdi:account" style={lightUp('/user')}  width="27" height="27" />
      <p className="text" style={lightUp('/user')}>Account</p>
    </div>
    </div>)
}

export default Bottom