import React,{useEffect, useState,useContext} from "react";
import { Icon } from '@iconify/react';
import {useQuery,useInfiniteQuery} from 'react-query'
import Carousel from 'react-elastic-carousel';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {DataContext} from '../../context/Context'
import Page_animation from "../../components/animations/Page_animation";
import {db} from '../../context/firebase'
import Loading from "../../components/animations/Loading";
import './home.scss';
import {collectionProducts} from '../../context/firebase';
import {getDocs,query, orderBy, startAt, endAt,doc,getDoc,updateDoc} from 'firebase/firestore'
import Time from "../../components/Time";

function Home({bgImage,productPng}) {
  let navigate = useNavigate();
  let {dispatch,state} = useContext(DataContext);
  let inner_nav = ['All', 'Bags', 'Sneakers', 'Belt', 'Sunglass'];
  let [slide_style, setSlide_style] = useState({left:0});
  let [activated_nav,setActivated_nav] = useState(0);
  let [width,setWidth] = useState(window.innerWidth);
  let [hover, setHover] = useState({love:true,trolley:true});
  let [loading,setLoading] = useState(true);
  let breakPoints = [
    {width:1, itemsToShow:1},
    {width:650, itemsToShow:2},
    {width:950, itemsToShow:3},
  ];
  let {data:user,isLoading:userLoading,refetch:userRefetch} = useQuery('user',() => {
    let userDoc = doc(db,'users',localStorage.getItem('userId'));
    return getDoc(userDoc);
  },{
    select:(snapshot) => {
      return snapshot.data();
    }
  })

  let {data:products,isError:isMistake,error:mistake,hasNextPage,isLoading:productsLoading,fetchNextPage} = useInfiniteQuery('products',({pageParam=1}) => {
    let sorter = query(collectionProducts,orderBy('id'),startAt(pageParam == 1 ? 1 : pageParam == 2 ? 9 : 17 ),endAt(pageParam * 8));
    return getDocs(sorter) 
  },{
    getNextPageParam:(_lastpage,pages) => {
      if(pages.length < 3){
        return pages.length + 1;
      }
      return undefined
    },
    select:(snapshot) => {
      console.log(snapshot);
      let arr = [];
      snapshot.pages.map((groupPages) => {
        groupPages.docs.map((doc) => {
          arr.push({...doc.data(),productID:doc.id});
        })
      })
      return arr;
    }
  });

  useEffect(() => { 
    setTimeout(()=>{setLoading(false)},2000)

    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize)
    };
  }, []);

  function slide(num) {
      setSlide_style({
        left: num * 100 + 'px',
      }); 
      setActivated_nav(num);
  
  };

  const goToProduct = (productID) => {
   navigate(`/product/${productID}`);
  }

  function addLiked(image,name,productID) {
    let userDoc = doc(db,'users',localStorage.getItem('userId'));

    if(!user?.liked.includes(productID)) {
        updateDoc(userDoc,{
            notification:{
                cards:[...user?.notification?.cards,{img:image,name,type:'liked'}],
                type:'on',
                number:user?.notification?.number + 1,
            },
            products:[...user?.products,{link:productID,type:'liked',timeStamp:[new Date().getDate(),new Date().getMonth(),new Date().getFullYear()]}],
            liked:[...user?.liked,productID]
        })
    }else {
      alert('You have already like to this product');
    }  
        userRefetch()
  }

  
  function addCard(image,name,productID) {
    let userDoc = doc(db,'users',localStorage.getItem('userId'));

      if(!user?.card.includes(productID)) {
        updateDoc(userDoc,{
          notification:{
            cards:[...user?.notification?.cards,{img:image,name,type:'card'}],
            type:'on',
            number:user?.notification?.number + 1,
          },
          products:[...user?.products,{link:productID,type:'card',timeStamp:[new Date().getDate(),new Date().getMonth(),new Date().getFullYear()]}],
          card:[
            ...user?.card,productID
          ]
        })
      }else {
        alert('This product has added to your card already');
      }
        userRefetch()
  }

  return (<>
  { loading ?
  <>
  <Loading />
  </>
  :
        // window.location.pathname == '/' ? {backgroundImage:`url(${homeBgImage})`} :
        // window.location.pathname == '/bags' ? {backgroundImage:`url(${bagBgImage})`} :
        // window.location.pathname == '/sneakers' ? {backgroundImage:`url(${sneakersBgImage})`} :
        // {backgroundImage:`url(${beltBgImage})`} 
  <>
      <div className="big_wrapper">
        <div className="banner" style={{backgroundImage:`url(${bgImage})`}}>
          <div className="text">
            <b>Super Flash Sale <br/> 
               50% OFF</b>
          </div>
        </div> 
        <Carousel itemPadding={[0,0]}  initialActiveIndex={width < 570 ? 3 : 0} enableAutoPlay autoPlaySpeed={15000} breakPoints={breakPoints} className="carusel">
          <Item maxWidth="100%" className="carusel_card bag" onClick={() => {moveToAnotherPage('/hot_deals')}}>
            
            <p className="name">FS - QUILTED MAXI CROSS BAG</p>
            <img src="./assets/wallet (1).jpg" alt="wallet" className="img" />
            <span className="tog">
              <span className="old_price">$533,34</span>
              <span className="promo">24%</span>
            </span>
            <span className="p cost">$234,43</span>   
            
          </Item>
          <Item maxWidth="100%" className="carusel_card k1" onClick={() => {moveToAnotherPage('/hot_deals')}}>
           
            <p className="name">FS - QUILTED MAXI CROSS BAG</p>
            <img src="./assets/k1.jpg" alt="wallet" className="img" />
            <span className="tog">
              <span className="old_price">$533,34</span>
              <span className="promo">24%</span>
            </span>
            <span className="p cost">$234,43</span>
            
          </Item>
          <Item maxWidth="100%" className="carusel_card k2" onClick={() => {moveToAnotherPage('/hot_deals')}}>
            <p className="name">FS - QUILTED MAXI CROSS BAG</p>
            <img src="./assets/k2.jpg" alt="wallet" className="img" />
            <span className="tog">
              <span className="old_price">$533,34</span>
              <span className="promo">24%</span>
            </span>
            <span className="p cost">$234,43</span>

          </Item>
          <Item maxWidth="100%" className="carusel_card bag" onClick={() => {moveToAnotherPage('/hot_deals')}}>
            
            <p className="name">FS - QUILTED MAXI CROSS BAG</p>
            <img src="./assets/wallet (1).jpg" alt="wallet" className="img" />
            <span className="tog">
              <span className="old_price">$533,34</span>
              <span className="promo">24%</span>
            </span>
            <span className="p cost">$234,43</span>   
            
          </Item>
          {width < 570 ? 
            <Time />
          : null}
          
        </Carousel>
      </div>
      <h2 align="center" style={{marginTop:'10px'}}>The Best Items</h2>
           
      <nav className="items_nav">
        <ul className="items">
          {inner_nav.map( (item,index) => (
            <li className={index == 4 ? 'item item0' : 'item' } key={index} onClick={() => { slide(index) }}  ><a className="a" style={ activated_nav == index ? {color:'#40bfff'} : {color:'black'}}>{item}</a></li>
            ))}
          
        </ul>
        <span className="slider" style={slide_style}></span>
      </nav>
      <nav className="mobile_items_nav">
        <section className="up_nav">
            <h2 className="text_name">Category</h2>
            <h2 className="text_expand">More Category</h2>            
        </section>
        <section className="down_nav">
          <div className="icon_wrap">
        <Icon icon="ri:shirt-line" color="#40bfff" width="25" height="25" className="icon"/>
          </div>
          <div className="icon_wrap">
        <Icon icon="pepicons:dress" color="#40bfff" width="25" height="25" className="icon"/>
          </div>
          <div className="icon_wrap">
        <Icon icon="ic:outline-shopping-bag" color="#40bfff" width="25" height="25" className="icon"/>
          </div>
          <div className="icon_wrap">
          <Icon icon="icon-park-outline:high-heeled-shoes" color="#40bfff" width="25" height="25" className="icon"/>
          </div>
        </section>
      </nav>
            
            {productsLoading ?
              <Page_animation /> : 
              <div className="sale_cards">
                {products.map((card,index) => {
                return (<div className="card" key={card.id} onClick={(e) => {e.stopPropagation();goToProduct(card.productID)}}>
                  <div className="view" onClick={(e) => {e.stopPropagation()}}>
                    {card.type == 'hot' ? <span className="new">Hot</span> : null}
                    <img src={card.main_img} alt="productImg" className="picture"/>
                      <div className="choose">
                        <Icon icon="akar-icons:heart" color={hover.love ?  'black' : "#40bfff"} width="25" height="25" onMouseOver={(e) => setHover({...hover,love:false})} onMouseOut={(e) => setHover({...hover,love:true})} className='icon' onClick={(e) => {e.stopPropagation(),addLiked(card?.main_img,card?.name,card.productID)}}/>
                        <Icon icon="wpf:luggage-trolley" color={hover.trolley ?  'black' : "#40bfff"} width="25" height="25" onMouseOver={(e) => setHover({...hover,trolley:false})} onMouseOut={(e) => setHover({...hover,trolley:true})} className='icon' onClick={(e) => {e.stopPropagation(),addCard(card?.main_img,card?.name,card.productID)}}/>
                      </div>
                  </div>
                  <div className="info">
                    <p className="name">{card.name}</p>
                    <div className="stars_collection">
                      <Icon icon="ant-design:star-filled" color={Math.floor(card.rating.stars / card.rating.users.length) >= 1 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                      <Icon icon="ant-design:star-filled" color={Math.floor(card.rating.stars / card.rating.users.length) >= 2 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                      <Icon icon="ant-design:star-filled" color={Math.floor(card.rating.stars / card.rating.users.length) >= 3 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                      <Icon icon="ant-design:star-filled" color={Math.floor(card.rating.stars / card.rating.users.length) >= 4 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                      <Icon icon="ant-design:star-filled" color={Math.floor(card.rating.stars / card.rating.users.length) >= 5 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
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
              
            } 


        <div className="load_more" onClick={fetchNextPage}>
          <h2 className="Link">Load More</h2>
          <span className="link_under"></span>
          </div>
          <div className="home_banner">
            <div className="text_side">
              <p className="main_text">Adidas Man runing sneakers</p>
              <p className="mini_text">performace and design. Taken right to the edge</p>
             <div className="wrap_them"> <p className="shop_now" onClick={() => navigate('/hot_deals')}>Shop now </p>
              <span className="under_it" style={{width:'100px',height:'5px',backgroundColor:'white'}}></span>
              </div>
            </div>
            <div className="image_side">

             <img src={productPng} alt={'productNotShowingOn'} className="image" /> 

            </div>
          </div>
          <div className='additional_info'>
            <div className="info info_1">
              <img src="./assets/shipping.png" alt='shipping' className="logo1"/>
              <p className="name">Free Shipping</p>
              <p>For our customers we have free shipping system, we are so happy to be in touch with you.Thanks for your purchase. </p>
            </div>
            <div className="info info_2">
              <img src="./assets/refund.png" alt="refund"  className="logo2"/>
              <p className="name">100% Refund</p>
              <p>No cheating, we are loyal to our customers. Therefore we have 100% refund,we are so glad working with you .</p>
            </div>
            
            <div className="info info_3">
              <img src="./assets/support.png" alt="support"  className="logo3"/>
              <p className="name">Support 24/7</p>
              <p>our call center is available 24 hours in a day 7 days for a week. You may ask any question related to product</p>
            </div>
          </div>
          <h2 className="News" align='center'>Latest News</h2>
          <div className="latest_news">
            <div className="info">
              <div className="logo"><img src="./assets/nike.png" alt="nike" /></div>
              <div className="text">
                <p className="date">01 Jan 2015</p>
                <p className="name">Fashion Industry</p>
                <p className="text">Nike is the best company at providing high quality sneakers, and all kind of food wears </p>
              </div>
            </div>
            <div className="info">
              <div className="logo"><img src="./assets/figma.png" alt="nike" /></div>
              <div className="text">
                <p className="date">01 Jan 2015</p>
                <p className="name">Best design tool</p>
                <p className="text">Figma is very popular program between web-developers and designers,because it is easy to use. </p>
              </div>
          </div>
          <div className="info">
              <div className="logo"><img src="./assets/kronos.png" alt="kronos" /></div>
              <div className="text">
                <p className="date">01 Jan 2015</p>
                <p className="name">HR community</p>
                <p className="text">For Hr community support supplied by Kronos company</p>
              </div>
            </div>
          </div>
          <h2 className="News" align='center'>Featured Items</h2>
          <div className="featured_items">
          <div className="info">
              <div className="logo"><img src="./assets/vector.png" alt="nike" /></div>
              <div className="text">
                <p className="name">Blue Swade Nike Sneakers</p>
                <img src="./assets/stars.svg" alt="five_star" className="stars" />
                <p className="cost"><span className="r_cost">$450</span> <span className="d_cost">$550</span></p>
              </div>
            </div>
            <div className="info">
              <div className="logo"><img src="./assets/vector.png" alt="nike" /></div>
              <div className="text">
                <p className="name">Blue Swade Nike Sneakers</p>
                <img src="./assets/stars.svg" alt="five_star" className="stars" />
                <p className="cost"><span className="r_cost">$450</span> <span className="d_cost">$550</span></p>
              </div>
            </div>
            <div className="info">
              <div className="logo"><img src="./assets/vector.png" alt="nike" /></div>
              <div className="text">
                <p className="name">Blue Swade Nike Sneakers</p>
                <img src="./assets/stars.svg" alt="five_star" className="stars" />
                <p className="cost"><span className="r_cost">$450</span> <span className="d_cost">$550</span></p>
              </div>
            </div>
          </div>

          <div className="search">
            <input type="text" className="input" placeholder="Search..." aria-label="Search..." aria-describedby="Search..." />
            <button className="btn btn-outline-secondary submit" type="button" id="button-addon2">Button</button>
          </div>
          

  </>}
    </> );

}



const Item = styled.div`
  position:relative;
`



export default Home;
