import React,{useState,useEffect,useContext} from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import SNavbar from '../../components/setting_navbar/SNavbar';
import {useQuery} from 'react-query';
import {doc,getDoc,updateDoc} from 'firebase/firestore';
import {db} from '../../context/firebase';
import {DataContext} from '../../context/Context';
import { Icon } from '@iconify/react';
import './notification.scss';
import { Link } from 'react-router-dom';
function Notification() {
    let {state} = useContext(DataContext);
    let [sidebarHide,setSidebarHide] = useState(false);
    let {data:notification,isLoading:notificationLoading,error:notificationError,refetch} = useQuery('notification',() => {
        let notificationDoc = doc(db,'users',localStorage.getItem('userId'));
        return getDoc(notificationDoc);
    },{
        select:(snapshot) => {
            return snapshot?.data()
        }
    });

    function setSidebar(){
        setSidebarHide(pre => !pre);
        refetch()
    }


    function updateNotification() {
        let userDoc = doc(db,'users',localStorage.getItem('userId'));
        updateDoc(userDoc,{
            notification:{
                cards:[],
                type:'off',
                number:0,
            }
        })
        refetch()
    }
  return (
    <div className='notification'>
        <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={(e) => {e.stopPropagation();setSidebarHide(false)}}></div>
        <div className="static_sidebar">
            <div className='fixed_sidebar'>
                <Sidebar setSidebar={setSidebar}/>
            </div>
        </div>
        <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
            <Sidebar setSidebar={setSidebar}/>
        </div>
        <div className="notificationContainer">
            <SNavbar setSidebar={setSidebar}/>
            
            {notification?.notification?.type == 'on' ?
              <div className="notifiedCardsContainer">
                <div className="notificationName">New Notifications</div>
                <div className="cardsListNotified">
                    {notification?.notification?.cards?.map((item,index) => {
                        if(item.type == 'message'){
                            return <div className={`notificationCard ${item.type}`} key={index}>
                                <div className='notificationOrder'>{index + 1}</div>
                                <div className={`header ${item.type}`}>New message came from Admin</div>
                                <div className="letter">
                                    {item.letter}
                                </div>
                                <div className="link">
                                    <Link to='/user/messenger'>
                                        Go to messenger.
                                    </Link>
                                </div>
                            </div>
                        } else {
                            return <div className={`notificationCard ${item.type}`} key={index}>
                                <div className='notificationOrder'>{index + 1}</div>
                                <div className={`header ${item.type}o`}>
                                    {item.type == 'card' ? 'New product added to the card':
                                        item.type == 'purchased' ? 'Congrats, you have purchased new Product':
                                        'You have liked new product'
                                    }
                                </div>
                                <div className="notificationDetail">
                                    <img src={item.img} alt='ProductImg' className='notifiedImg'/>
                                    <div className="text">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="link">
                                    <Link to={`/user/${item.type}`}>
                                        {`Go to ${item.type} ${item.type != 'card' ? `products` : '.' }`}
                                    </Link>
                                </div>
                            </div>
                        } 
                        
                    })}
                </div>
                <div className='clearNotification' onClick={updateNotification}>Clear Notifications.</div>
              </div>:
              <div className="unnotifiedContainer">
                No Notifications
              </div>  
            }           
        </div>
    </div>
  )
}

export default Notification