import React,{useContext} from 'react';
import {useQuery} from 'react-query'
import {doc,getDoc} from 'firebase/firestore'
import {db} from '../../context/firebase'
import {Link} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ListIcon from '@mui/icons-material/List';
import './snavbar.scss';
import {DataContext} from '../../context/Context'

function SNavbar({setSidebar}) {
    let {state,dispatch} = useContext(DataContext);
    let avatar = state.userImg;

    let {data:user,error:userError,isLoading:userLoading,refetch} = useQuery('user',() => {
      let userDoc = doc(db,'users',localStorage.getItem('userId'));
      return getDoc(userDoc);
  },{
      select:(snapshot) => {
          return snapshot.data();
      }
  })

  return (
    <div className='snavbar'>
     <div className="snavbar_wrapper">
          <div className="item" onClick={() => {setSidebar();refetch()}}>
            <ListIcon className='icon'/>
          </div>
        <div className="snavbar_search">
         <input type="text" name="text" id="text" placeholder='search...' />
         <SearchIcon />
        </div>
        <div className='items'>
          <div className="item one">
          <LanguageIcon className='icon'/>
           English
          </div>
          <div className="item two">
            <Link to='/user/notification'>
              <NotificationsIcon className='icon'/>
              {user?.notification?.type == 'on' ? 
                <div className="counter">{user?.notification?.number}</div> : null
              }
            </Link>
          </div>
          <div className="item three">
            <Link to='/user/messenger'>
              <ModeCommentIcon className='icon'/>
              {user?.message.type == 'on' ? 
                <div className="counter">{user?.message.number}</div> : null
              }
            </Link>
          </div>
          <div className="item">
            <img src={avatar} alt="Avatar" className='avatar'/>
          </div>
        </div>
     </div> 
    </div>
  )
}

export default SNavbar