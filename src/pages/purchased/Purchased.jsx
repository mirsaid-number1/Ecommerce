import React,{useState,useEffect,useContext} from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import SNavbar from '../../components/setting_navbar/SNavbar';
import {useQuery} from 'react-query';
import {doc,collection,getDoc,getDocs,updateDoc} from 'firebase/firestore';
import {db} from '../../context/firebase';
import {DataContext} from '../../context/Context';
import { Icon } from '@iconify/react';
import './purchased.scss'

function Purchased({word,search}) {
    let {state} = useContext(DataContext);
    let [sidebarHide,setSidebarHide] = useState(false);
    let months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    let [hover, setHover] = useState({love:true,trolley:true});
    let [products_rows,setProducts_rows] = useState([]);
    let {data:users,error:usersError,isLoading:usersLoading,refetch:usersRefetch} = useQuery('users',() => {
        let usersCollection = collection(db,'users');
        return getDocs(usersCollection)
    },{
        select:(snapshot) => {
            let data = snapshot?.docs?.find((doc) => state.userId == doc?.id)
            return data?.data()[search];
        }
    })
    let {data:cards,error:cardsError,isLoading:cardsLoading,isFetching:cardsFetching,isFetched,refetch:cardsRefetch} = useQuery('cardsInCart',() => {
        let cardDoc = doc(db,'users',localStorage.getItem('userId'));
        return getDoc(cardDoc);
    },{
        select:(snapshot) => {
            return snapshot.data();
        }
    })

    useEffect(() => {
        let arr = [];
        
        users?.map((item) => {
            let productDoc;
            if(search == 'purchased') {
                productDoc = doc(db,'products',item?.link);
                getDoc(productDoc).then(doc => {
                    arr.push({...doc.data(),productID:item.link});
                })
            } else {
                productDoc = doc(db,'products',item);
                getDoc(productDoc).then(doc => {
                    arr.push({...doc.data(),productID:item});
                })
            }
        })
           
          setProducts_rows(arr)
          usersRefetch()
    },[usersLoading,users])

    function setSidebar(){
        setSidebarHide(pre => !pre);
        usersRefetch()
    }


    function deleteProductFromCard(id) {
        let cardDoc = doc(db,'users',localStorage.getItem('userId'));
        let newProduct = cards?.products.filter(({link,type}) => !(link === id && type === 'card'));
        let newCard = cards?.card.filter(item => item != id);
        updateDoc(cardDoc,{
            card:newCard,
            products:newProduct,
        })
        usersRefetch()
        cardsRefetch();
    }

    function deleteProductFromLiked(id) {
        let cardDoc = doc(db,'users',localStorage.getItem("userId"));
        let newProduct = cards?.products.filter(({link,type}) => !(link === id && type === 'liked'));
        let newLiked = cards?.liked.filter(item => item != id)
        updateDoc(cardDoc,{
            liked: newLiked,
            products: newProduct
        })
        usersRefetch()
        cardsRefetch();
    }

    function addLiked(image,name,productID) {
        let userDoc = doc(db,'users',localStorage.getItem('userId'));
    
        if(!cards?.liked.includes(productID)) {
            updateDoc(userDoc,{
                notification:{
                    cards:[...cards?.notification?.cards,{img:image,name,type:'liked'}],
                    type:'on',
                    number:cards?.notification?.number + 1,
                },
                products:[...cards?.products,{link:productID,type:'liked',timeStamp:[new Date().getDate(),new Date().getMonth(),new Date().getFullYear()]}],
                liked:[...cards?.liked,productID]
            })
        } else {
            alert('you have liked to this product already')
        }
        usersRefetch()
        cardsRefetch();
      }


      function addCard(image,name,productID) {
        let userDoc = doc(db,'users',localStorage.getItem('userId'));
    
          if(!cards?.card.includes(productID)) {
            updateDoc(userDoc,{
              notification:{
                cards:[...cards?.notification?.cards,{img:image,name,type:'card'}],
                type:'on',
                number:cards?.notification?.number + 1,
              },
              products:[...cards?.products,{link:productID,type:'card',timeStamp:[new Date().getDate(),new Date().getMonth(),new Date().getFullYear()]}],
              card:[
                ...cards?.card,productID
              ]
            })
          }else {
            alert('you have already added this product to card')
          } 
        usersRefetch()
        cardsRefetch()
      }

return (
    <div className='purchased'>
        <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={(e) => {e.stopPropagation();setSidebarHide(false)}}></div>
        <div className="static_sidebar">
            <div className='fixed_sidebar'>
                <Sidebar setSidebar={setSidebar}/>
            </div>
        </div>
        <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
            <Sidebar setSidebar={setSidebar}/>
        </div>
        <div className="purchasedContainer">
        <SNavbar setSidebar={setSidebar}/>
            <div className="listContainer">
                <div className={`listName ${search == 'purchased' ? null : search}`}>{word}</div>
                <div className="cardsCollection">
                    {products_rows?.map((card,index) => {
                    return (<div className="card" key={index}>
                    <div className="view" onMouseOver={(e) => {e.stopPropagation()}}>
                        {card.type == 'hot' ? <span className="new">Hot</span> : null}
                        <img src={card.main_img} alt="productImg" className="picture"/>
                        {search == 'card' ? <div className="choose">
                            <Icon icon="akar-icons:heart" 
                                color={hover.love ?  'black' : "#40bfff"} 
                                width="25" 
                                height="25" 
                                onMouseOver={(e) => setHover({...hover,love:false})} 
                                onMouseOut={(e) => setHover({...hover,love:true})} 
                                className='icon' 
                                onClick={(e) => {e.stopPropagation(); addLiked(card.main_img,card.name,card.productID)}}/>
                            <Icon icon="bi:x" 
                                color={hover.trolley ?  'black' : "red"} 
                                width="35" 
                                height="35" 
                                onMouseOver={(e) => setHover({...hover,trolley:false})} 
                                onMouseOut={(e) => setHover({...hover,trolley:true})} 
                                className='icon' 
                                onClick={(e) => {e.stopPropagation(); deleteProductFromCard(card.productID)}}/>
                            </div> : search == 'liked' ?
                            <div className="choose">
                                <Icon icon="bi:x" 
                                    color={hover.love ?  'black' : "red"} 
                                    width="35"
                                    height="35" 
                                    onMouseOver={(e) => setHover({...hover,love:false})} 
                                    onMouseOut={(e) => setHover({...hover,love:true})} 
                                    className='icon' 
                                    onClick={(e) => {e.stopPropagation(); deleteProductFromLiked(card.productID)}}/>
                                <Icon icon="wpf:luggage-trolley" 
                                    color={hover.trolley ?  'black' : "#40bfff"} 
                                    width="25" 
                                    height="25" 
                                    onMouseOver={(e) => setHover({...hover,trolley:false})} 
                                    onMouseOut={(e) => setHover({...hover,trolley:true})} 
                                    className='icon' 
                                    onClick={(e) => {e.stopPropagation(); addCard(card.main_img,card.name,card.productID)}}/>
                            </div> : null
                        }
                    </div>
                    <div className="info">
                        <p className="name">{card.name}</p>
                        <div className="stars_collection">
                        <Icon icon="ant-design:star-filled" color={Math.ceil(card.rating.stars / card.rating.users.length) >= 1 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                        <Icon icon="ant-design:star-filled" color={Math.ceil(card.rating.stars / card.rating.users.length) >= 2 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                        <Icon icon="ant-design:star-filled" color={Math.ceil(card.rating.stars / card.rating.users.length) >= 3 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                        <Icon icon="ant-design:star-filled" color={Math.ceil(card.rating.stars / card.rating.users.length) >= 4 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                        <Icon icon="ant-design:star-filled" color={Math.ceil(card.rating.stars / card.rating.users.length) >= 5 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                        </div>
                        <div className="costs">
                        <span className="r_cost">${card.price}</span>
                        <span className="prev_cost">${card.old_price}</span>
                        <span className="percent">{Math.floor(100 - (card.price * 100 / card.old_price))}% OFF</span>
                        </div>
                    </div>
                    </div>)
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Purchased