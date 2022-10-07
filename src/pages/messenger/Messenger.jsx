import React,{useState,useContext,useRef, Fragment} from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import SNavbar from '../../components/setting_navbar/SNavbar';
import {useQuery} from 'react-query';
import {collection, doc,getDoc,getDocs,updateDoc} from 'firebase/firestore';
import {db} from '../../context/firebase';
import {DataContext} from '../../context/Context';
import { Icon } from '@iconify/react';
import './messenger.scss';
import { useEffect } from 'react';

//https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/wallpaperflare.com_wallpaper-min.webp?alt=media&token=020fbdde-c9d9-42db-a1e1-3828701370dd

function Messenger() {
    let [sidebarHide,setSidebarHide] = useState(false);
    let [selected,setSelected] = useState('');
    let message = useRef();
    let [userId,setUserId] = useState('');
    let [text,setText] = useState('');
    let {state} = useContext(DataContext);
    let date = new Date();
    let months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    let {data:messenger,error:messengerError,isLoading:messengerLoading,refetch:messageRefetch,isFetched} = useQuery('messenger',() => {
        let userDoc = doc(db,'users',localStorage.getItem('userId'));
        return getDoc(userDoc);
    },{
        select:(snapshot) => {
            return snapshot.data();
        }
    })

    let {data:entireUsers,refetch:usersRefetch} = useQuery('entireUsers',() => {
        let usersCollection = collection(db,'users');
        return getDocs(usersCollection)
    },{
        select:(snapshot) => {
            let arr = [];
            snapshot?.docs.map(item => {
                arr.push({...item.data(),userId:item.id})
            })
            return arr;
        }
    })

    useEffect(() => {
        if(messenger){ 
            let userDoc = doc(db,'users',localStorage.getItem('userId'));
            updateDoc(userDoc,{
                message:{
                    messages:messenger?.message?.messages,
                    type:'off',
                    number:0
                }
            })
        }
    },[isFetched])

    function choosePeople(id) {
        let chosen = entireUsers.find(item => item.userId == id);
        setSelected(chosen);
        usersRefetch();
    }

    function setSidebar(){
        setSidebarHide(pre => !pre);
        messageRefetch()
    }

    function submitMessage(e) {
        e.preventDefault();
        let useDoc = doc(db,'users',localStorage.getItem('userId'));
        updateDoc(useDoc,{
            message:{
                type:'on',
                number:1,
                messages:[...messenger?.message?.messages,{
                    img:state.userImg,
                    text,
                    timeStamp:`${date.toLocaleTimeString()}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
                    who:'user'
                }]
            }  
        })
        messageRefetch();
        setText('')
    }

    function adminSubmitMessage(e) {
       e.preventDefault(); 
       let userDoc = doc(db,'users',selected?.userId);
       updateDoc(userDoc,{
        message:{
            type:'on',
            number:1,
            messages:[...selected?.message.messages,{
                img:'https://lh3.googleusercontent.com/a-/AFdZucrvDJfQvyEljUJpwoECrQaehsFqdeO7et033ezn=s96-c',
                text,
                timeStamp:`${date.toLocaleTimeString()}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
                who:'admin'
            }]
        } 
       })
       messageRefetch();
       usersRefetch();
    }
  return (<>
        {localStorage.getItem('userId') == '3ghIjUitrfPW3S6Kq5KF9ByZyQo2' ? <div className='messenger'>
        <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={(e) => {e.stopPropagation();setSidebarHide(false)}}></div>
        <div className="static_sidebar">
            <div className='fixed_sidebar'>
                <Sidebar setSidebar={setSidebar}/>
            </div>
        </div>
        <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
            <Sidebar setSidebar={setSidebar}/>
        </div>
        <div className="messengerContainer">
            <SNavbar setSidebar={setSidebar} />
            <div className="communication">
                <div className="communicationName">Messaging With Admin...</div>
                    <div className='allUsers'>
                        {entireUsers?.map((item,index) => <div key={index} className="user" onClick={() => choosePeople(item.userId)}>
                            <div className='img'>
                                <img src={item.img} alt="img" className='picture'/>
                            </div>
                            <div className='name'>
                                {item.user}
                            </div>
                        </div>)}
                    </div>
                    {selected ? <div className="messagingSection">
                    <div className="messages" ref={message}>{
                        selected.message?.messages?.map((item,index) => {
                            return <div className={`message ${item.who}`} key={index}>
                                        <img src={item.img} alt='user' className='imgPart'/>
                                        <div className="textPart" id={String(index)}>
                                            <div className="textPlace">{item.text}</div>
                                            <div className="date">{item.timeStamp}</div>
                                        </div>
                                    </div>
                        })
                    }</div>
                    <div className='edition'>
                        <form onSubmit={(e) => adminSubmitMessage(e)}>
                            <input type="text" name="submition" id="submition" className='submition' onChange={(e) => setText(e.target.value)}/>
                            <button type="submit" ><a href={'#' + String(messenger?.message?.messages?.length - 1)} style={{textDecoration:'none',color:'white'}}>Submit</a></button>
                        </form>
                    </div>
                </div> : null}
            </div>
        </div>
        </div>
        : <div className='messenger'>
        <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={(e) => {e.stopPropagation();setSidebarHide(false)}}></div>
        <div className="static_sidebar">
            <div className='fixed_sidebar'>
                <Sidebar setSidebar={setSidebar}/>
            </div>
        </div>
        <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
            <Sidebar setSidebar={setSidebar}/>
        </div>
        <div className="messengerContainer">
            <SNavbar setSidebar={setSidebar} />
            <div className="communication">
                <div className="communicationName">Messaging With Admin...</div>
                <div className="messagingSection">
                    <div className="messages" ref={message}>{
                        messenger?.message?.messages?.map((item,index) => {
                            return <div className={`message ${item.who}`} key={index}>
                                        <img src={item.img} alt='user' className='imgPart'/>
                                        <div className="textPart" id={String(index)}>
                                            <div className="textPlace">{item.text}</div>
                                            <div className="date">{item.timeStamp}</div>
                                        </div>
                                    </div>
                        })
                    }</div>
                    <div className='edition'>
                        <form onSubmit={submitMessage}>
                            <input type="text" name="submition" id="submition" className='submition' onChange={(e) => setText(e.target.value)}/>
                            <button type="submit" ><a href={'#' + String(messenger?.message?.messages?.length - 1)} style={{textDecoration:'none',color:'white'}}>Submit</a></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
        }
  </>)
}

export default Messenger