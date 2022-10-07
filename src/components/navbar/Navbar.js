import React,{useState,useEffect,useContext} from "react";
import {Icon} from '@iconify/react';
import {useQuery} from 'react-query'
import {db} from '../../context/firebase';
import {getDoc,doc} from 'firebase/firestore'
import { useNavigate,useMatch,useResolvedPath } from "react-router-dom";
import Page_animation from "../animations/Page_animation";
import './navbar.scss';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SearchIcon from '@mui/icons-material/Search';
import {DataContext} from '../../context/Context'
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import logo from '../../images/logo.png';

function Navbar() {
  let {state,dispatch} = useContext(DataContext)
  let [animation, setAnimation] = useState(false);
  let navigate = useNavigate();
  let purchasedItems = 0;
  let {data:user,isLoading:userLoading,refetch:userRefetch} = useQuery('user-in-navbar',() => {
    let userDoc = doc(db,'users',localStorage.getItem('userId')); 
    return getDoc(userDoc);
  },{
    select:(snapshot) => {
      purchasedItems = snapshot.data()?.notification?.cards.filter(item => item.type == 'card');
      return snapshot.data();
    },refetchInterval:5000
    })


  useEffect(() => {
    userRefetch();
  },[])
  console.log(state.userToken);
  function moveToAnotherPage(page){
    setAnimation(prev => !prev);
    setTimeout(() => {
      navigate(page);
      setAnimation(prev => !prev);
    },1000)
    userRefetch();
  }  
  console.log(state.userImg)
  if(window.location.pathname == '/signup' || window.location.pathname == '/login' || window.location.pathname.includes('user')){
    return null
  }

  if(!localStorage.getItem('userToken')){
   return( <>
      {animation ? <Page_animation /> : null}
        <div className="signup_first">
        <button onClick={() => navigate('/login')}><LockOpenIcon className="icon" /> Log in</button>
        <button onClick={() => navigate('/signup')}><AssignmentIndIcon className="icon" /> Sign up</button>
        </div>
        <nav className="navbar">
      
        <div className="nav">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo_org" onClick={() => {moveToAnotherPage('/')}}/>
          </div>
          <div className="second_part">
            <span to="/" className="span home" onClick={() => {moveToAnotherPage('/')}}><PathName href='/' value='Home'/></span>
            <span to='bags' className="span bags" onClick={() => {moveToAnotherPage('/bags')}}><PathName href='/bags' value='Bags'/></span> 
            <span to='sneakers' className="span sneakers" onClick={() => {moveToAnotherPage('/sneakers')}}><PathName href='/sneakers' value='Sneakers'/> </span> 
            <span to='belt' className="span belt" onClick={() => {moveToAnotherPage('/belt')}}><PathName href='/belt' value='Belt'/></span>
            <span to='contact' className="span contact" onClick={() => {moveToAnotherPage('/contact')}}><PathName href='/contact' value='Contact'/></span>
          </div>
        </div>
        <div className="mobile_nav">
        <div className="logo">
            <img src={logo} alt="Logo" className="logo_org" />
          </div>
        <div className="input_search">
           <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1"><SearchIcon/></span>
              <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
        </div>
          <div className="kid2">
          <Icon icon="akar-icons:bell" color="gray" width={'30px'} height='30px'  className='mobile_icon'/>
          <img src={state.userImg} alt="personal" className="avatar"/>
          </div>
        </div>
        </nav>
     </> )
  }

  return (
    <>
    {animation ? <Page_animation /> : null}
    <>
      <div className="up_nav">
        <div className="selectors">
          <select name="language" id="language">
            <option value="RU">RU</option>
            <option value="UZ">UZ</option>
            <option value="EN">EN</option>
          </select>
          <select name="currency" id="currency">
            <option value="RUBL">RUBL</option>
            <option value="SO'M">SO'M</option>
            <option value="POUND">POUND</option>
          </select>
        </div>
        <div className="other_items">
          <span className="first_item" onClick={() => {navigate('/user');userRefetch()}} style={{cursor:'pointer'}}>
            <img src={state.userImg ? state.userImg : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="personal" className="avatar"/>
            {state.userName ?? 'User'}
          </span>
          <span className="second_item" onClick={() => {navigate('/user/notification'),userRefetch()}} style={{cursor:'pointer'}}>
           {user?.notification?.type == 'on' ? 
            <span className="notification_number">{user?.notification?.number}</span> : null} 
              <Icon icon="akar-icons:bell" color="gray" width={'25px'} height='25px'  className='mobile_icon'/>
          </span>
          <span className="third_item" style={{cursor:'pointer'}}>
           <span className="card_direction" onClick={() => {navigate('/cart'),userRefetch()}}>
              {purchasedItems?.length > 0 ? 
                <span className="notification_number">{purchasedItems?.length}</span> : null
              }
              <LocalGroceryStoreOutlinedIcon />
            </span>
            <span onClick={() => {navigate('/user/purchased'),userRefetch()}}>
              {user?.purchased?.length ? `${user?.purchased?.length} Purchased` : 'Item'}
            </span>
          </span>
          <span className="forth_item">
            ${user?.expenditure}
            <SearchIcon />
          </span>
        </div>
      </div>
      <nav className="navbar" >
      
        <div className="nav">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo_org" onClick={() => {moveToAnotherPage('/'),userRefetch()}}/>
          </div>
          <div className="second_part">
            <span to="/" className="span home" onClick={() => {moveToAnotherPage('/'),userRefetch()}}><PathName href='/' value='Home'/></span>
            <span to='bags' className="span bags" onClick={() => {moveToAnotherPage('/bags'),userRefetch()}}><PathName href='/bags' value='Bags'/></span> 
            <span to='sneakers' className="span sneakers" onClick={() => {moveToAnotherPage('/sneakers'),userRefetch()}}><PathName href='/sneakers' value='Sneakers'/> </span> 
            <span to='belt' className="span belt" onClick={() => {moveToAnotherPage('/belt'),userRefetch()}}><PathName href='/belt' value='Belt'/></span>
            <span to='contact' className="span contact" onClick={() => {moveToAnotherPage('/contact'),userRefetch()}}><PathName href='/contact' value='Contact'/></span>
          </div>
        </div>
        <div className="mobile_nav">
        <div className="logo">
            <img src={logo} alt="Logo" className="logo_org" />
          </div>
        <div className="input_search" id="search">
           <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1"><SearchIcon/></span>
              <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
        </div>
          <div className="kid2">
          <span className="second_item" onClick={() => {navigate('/user/notification'),userRefetch()}} style={{cursor:'pointer'}}>
           {user?.notification?.type == 'on' ? 
           <span className="notification_number">{user?.notification?.number}</span> : null} 
              <Icon icon="akar-icons:bell" color="gray" width={'30px'} height='30px'  className='mobile_icon'/>
          </span>
          <img src={state?.userImg ? state.userImg : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="personal" className="avatar"/>
          </div>
        </div>
      </nav>
    </>
    </>
  );
}

function PathName({href,value}){
  let resolvedPath = useResolvedPath(href);
  let isActive = useMatch({path:resolvedPath.pathname,end:true});
  console.log(resolvedPath)
  return (<div className={isActive ? 'active' : ''}>
    {value}
  </div>)

}

export default Navbar;
