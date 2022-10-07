import React,{useState,useEffect} from 'react'
import { Icon } from '@iconify/react';
import {db} from '../../context/firebase';
import {Link, useNavigate} from 'react-router-dom'
import {DataContext} from '../../context/Context';
import {doc,query,getDoc,getDocs,where,startAfter,orderBy,limit, collection, startAt, endAt, updateDoc} from 'firebase/firestore';
import { useQuery } from 'react-query';
import UpdateIcon from '@mui/icons-material/Update';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import './hot_deals.scss';
function Hot_Deals() {
  let navigate = useNavigate();
  let [hover, setHover] = useState({love:true,trolley:true});
  let [cardsType, setCardsType] = useState(false);
  let [rangeInputs,setRangeInputs] = useState({range1:10,range2:200});
  let [mobileSidebar, setMobileSidebar] = useState(false);
  let [pageNumber,setPageNumber] = useState(null);
  let [sortingByName,setSortingByName] = useState('')
  let documentSnapshotNext;
  let documentSnapshotPrev;
  let {data:sortedData,refetch,isFetching} = useQuery(['sortedData',pageNumber],async() => {
    let queryData;
    if(sortingByName) {
      queryData = query(collection(db,'products'),where('brand','==',sortingByName));
    } else if(pageNumber){
      queryData = query(collection(db,'products'),
                        orderBy("price"),
                        startAt(+rangeInputs.range1),
                        endAt(+rangeInputs.range2),
                        limit(6),
                        startAfter(pageNumber),
                        );
    } else {
      queryData = query(collection(db,'products'),
                        orderBy("price"),
                        startAt(+rangeInputs.range1),
                        endAt(+rangeInputs.range2),
                        limit(6),
                        
    );
    }  
    
    return await getDocs(queryData) 
  },{select:(snapshot) => {
      let arr = [];
      documentSnapshotNext = snapshot?.docs[snapshot?.docs.length - 1];
      documentSnapshotPrev = snapshot?.docs[0];
      snapshot?.docs?.map((doc) => {
        arr.push({...doc.data(),productID:doc.id})
      })
      return arr;
    },keepPreviousData:true,
  })
  let {data:user,isLoading:userLoading,refetch:userRefetch} = useQuery('user',() => {
    let userDoc = doc(db,'users',localStorage.getItem('userId'));
    return getDoc(userDoc);
  },{
    select:(snapshot) => {
      return snapshot.data();
    }
  })

  let mobile_sidebar = {
          position:'fixed',
          transition:'500ms ease',
          top:0,
          bottom:0,
          left:mobileSidebar ? 0 : '-800px'
  };

  useEffect(() => {
    if(rangeInputs.range1 <= 10 && rangeInputs.range2 < 10){
      setRangeInputs({range1:0,range2:+rangeInputs.range1+1})
    }
    if(rangeInputs.range1 >= 190 && rangeInputs.range1 > rangeInputs.range2){
      setRangeInputs({range1:+rangeInputs.range1,range2:200})
    }
    if(rangeInputs.range1 > 10 && rangeInputs.range2 < 190 && rangeInputs.range1 > rangeInputs.range2) {
      setRangeInputs({range1:+rangeInputs.range2 - 10,range2:+rangeInputs.range1 + 10})
    }
    setSortingByName('')
    refetch();
  },[rangeInputs])

  useEffect(() => {
    refetch();
  },[sortingByName])

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
  <main className="main" >
      <div className="sidebar">
       <Icon icon="akar-icons:arrow-right" color="black" width="25" height="25" className='arrow_open'/>
       <Icon icon="akar-icons:arrow-left" color="black" width="25" height="25" className='arrow_close'/>
       
       <div className="info">
          <ul className="block1">
            <li className="head">Hot Deals</li>
            <li className="item item1" onTouchEnd={refetch} onClick={() => setSortingByName('nike')} 
              style={sortingByName == 'nike' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Nike</span>
              <span className="number">2</span>
            </li>
            <li className="item item2" onTouchEnd={refetch} onClick={() => setSortingByName('adidas')} 
              style={sortingByName == 'adidas' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Adidas</span>
              <span className="number">48</span>
            </li>
            <li className="item item3" onTouchEnd={refetch} onClick={() => setSortingByName('under armour')} 
              style={sortingByName == 'under armour' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Under Armour</span>
              <span className="number">34</span>
            </li>
            <li className="item item4" onTouchEnd={refetch} onClick={() => setSortingByName('karrimor')} 
              style={sortingByName == 'karrimor' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Karrimor</span>
              <span className="number">15</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('skechers')} 
              style={sortingByName == 'skechers' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Skechers</span>
              <span className="number">23</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('asics')} 
              style={sortingByName == 'asics' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Asics</span>
              <span className="number">23</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('puma')} 
              style={sortingByName == 'puma' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Puma</span>
              <span className="number">23</span>
            </li>
            <li className="item item7" onTouchEnd={refetch} onClick={() => setSortingByName('slazenger')} 
              style={sortingByName == 'slazenger' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Slazenger</span>
              <span className="number">95</span>
            </li>
            <li className="item item6" onTouchEnd={refetch} onClick={() => setSortingByName('')} 
              style={sortingByName == '' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">All stars</span>
              <span className="number">1</span>
            </li>
          
          </ul>
          <div className="block2">
            <div className="head">Prices</div>
            <div className="range">
              <span className="range1">Range:</span>
              <span className="sum">{`$${rangeInputs.range1} - $${rangeInputs.range2}`}</span>
            </div>
            <div className="rangeInputs">
            <div className="slider-track"></div>
              <input type="range" name="slider1" id="slider1" className='slider-1' min={0} max={200} value={rangeInputs.range1} onChange={(e) => setRangeInputs({...rangeInputs,range1:e.target.value})}/>
              <input type="range" name="slider2" id="slider2" className='slider-2' min={0} max={200} value={rangeInputs.range2} onChange={(e) => setRangeInputs({...rangeInputs,range2:e.target.value})}/>
            </div>
          </div>
        </div>
      </div>
      <div className='open_settings' onClick={() => setMobileSidebar(prev => !prev)}>
      {!mobileSidebar ? <Icon icon="akar-icons:arrow-right" color="white" width="25" height="25" className='arrow_open'/>
       : <Icon icon="akar-icons:arrow-left" color="white" width="25" height="25" className='arrow_close'/>
      }
      </div>
      <div className='mobile_sidebar' style={mobile_sidebar}>   
       <div className="info">
          <ul className="block1">
            <li className="head">Hot Deals</li>
            <li className="item item1" onTouchEnd={refetch} onClick={() => setSortingByName('nike')}
            style={sortingByName == 'nike' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Nike</span>
              <span className="number">2</span>
            </li>
            <li className="item item2" onTouchEnd={refetch} onClick={() => setSortingByName('adidas')}
            style={sortingByName == 'adidas' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Adidas</span>
              <span className="number">48</span>
            </li>
            <li className="item item3" onTouchEnd={refetch} onClick={() => setSortingByName('under armour')}
            style={sortingByName == 'under armour' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Under Armour</span>
              <span className="number">34</span>
            </li>
            <li className="item item4" onTouchEnd={refetch} onClick={() => setSortingByName('karrimor')}
            style={sortingByName == 'karrimor' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Karrimor</span>
              <span className="number">15</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('skechers')}
            style={sortingByName == 'skechers' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Skechers</span>
              <span className="number">23</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('asics')}
            style={sortingByName == 'asics' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Asics</span>
              <span className="number">23</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('puma')}
            style={sortingByName == 'puma' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Puma</span>
              <span className="number">23</span>
            </li>
            <li className="item item7" onTouchEnd={refetch} onClick={() => setSortingByName('slazenger')}
            style={sortingByName == 'slazenger' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Slazenger</span>
              <span className="number">95</span>
            </li>
            <li className="item item6" onTouchEnd={refetch} onClick={() => setSortingByName('')}
            style={sortingByName == '' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">All stars</span>
              <span className="number">1</span>
            </li>
          
          </ul>
          <div className="block2">
            <div className="head">Prices</div>
            <div className="range">
              <span className="range1">Range:</span>
              <span className="sum">{`$${rangeInputs.range1} - $${rangeInputs.range2}`}</span>
            </div>
            <div className="rangeInputs">
              <div className="slider-track"></div>
              <input type="range" name="slider1" id="slider1" className='slider-1' min={0} max={200} value={rangeInputs.range1} onChange={(e) => setRangeInputs({...rangeInputs,range1:e.target.value})}/>
              <input type="range" name="slider2" id="slider2" className='slider-2' min={0} max={200} value={rangeInputs.range2} onChange={(e) => setRangeInputs({...rangeInputs,range2:e.target.value})}/>
            </div>
 
          </div>
       </div>
      </div>
      <div className='centure'>
        <div className="info">
          <ul className="block1">
            <li className="head">Hot Deals</li>
            <li className="item item1" onTouchEnd={refetch} onClick={() => setSortingByName('nike')} 
              style={sortingByName == 'nike' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Nike</span>
              <span className="number">2</span>
            </li>
            <li className="item item2" onTouchEnd={refetch} onClick={() => setSortingByName('adidas')} 
              style={sortingByName == 'adidas' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Adidas</span>
              <span className="number">48</span>
            </li>
            <li className="item item3" onTouchEnd={refetch} onClick={() => setSortingByName('under armour')} 
              style={sortingByName == 'under armour' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Under Armour</span>
              <span className="number">34</span>
            </li>
            <li className="item item4" onTouchEnd={refetch} onClick={() => setSortingByName('karrimor')} 
              style={sortingByName == 'karrimor' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Karrimor</span>
              <span className="number">15</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('skechers')} 
              style={sortingByName == 'skechers' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Skechers</span>
              <span className="number">23</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('asics')} 
              style={sortingByName == 'asics' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Asics</span>
              <span className="number">23</span>
            </li>
            <li className="item item5" onTouchEnd={refetch} onClick={() => setSortingByName('puma')} 
              style={sortingByName == 'puma' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Puma</span>
              <span className="number">23</span>
            </li>
            <li className="item item7" onTouchEnd={refetch} onClick={() => setSortingByName('slazenger')} 
              style={sortingByName == 'slazenger' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">Slazenger</span>
              <span className="number">95</span>
            </li>
            <li className="item item6" onTouchEnd={refetch} onClick={() => setSortingByName('')} 
              style={sortingByName == '' ? {color:'#33a0ff'} : {color:'grey'}}>
              <span className="name">All stars</span>
              <span className="number">1</span>
            </li>
          
          </ul>
          <div className="block2">
            <div className="head">Prices</div>
            <div className="range">
              <span className="range1">Range:</span>
              <span className="sum">{`$${rangeInputs.range1} - $${rangeInputs.range2}`}</span>
            </div>
            <div className="rangeInputs">
            <div className="slider-track"></div>
              <input type="range" name="slider1" id="slider1" className='slider-1' min={0} max={200} value={rangeInputs.range1} onChange={(e) => setRangeInputs({...rangeInputs,range1:e.target.value})}/>
              <input type="range" name="slider2" id="slider2" className='slider-2' min={0} max={200} value={rangeInputs.range2} onChange={(e) => setRangeInputs({...rangeInputs,range2:e.target.value})}/>
            </div>
          </div>
        </div>
        <div className="view">
          <div className="banner">
            <div className="text">
              <h2>Adidas Men Running Sneakers</h2>
              Perfomance and design. Taken right to the edge
              <div className="wrap_them"> <p className="shop_now">Shop now </p>
              <span className="under_it" style={{width:'100px',height:'5px',backgroundColor:'white'}} ></span>
              </div>
            </div>
            <img src="./assets/view_b.png" alt="trainer #one" className="image"/>
          </div>
          <div className="nav">
          <ul className="nav1">
            <li className="elem">13 Items</li>
            <li  className="elem">
              Sort By
              <select className="pro-select" name="currency" id="currency" onTouchEnd={refetch} onChange={(e) => setSortingByName(e.target.value)}>
                          <option className="name_option" value="">ALL</option>
                          <option className="name_option" value="nike">Nike</option>
                          <option className="name_option" value="under armour" >Under Armour</option>
                          <option className="name_option" value="karrimor" >Karrimor</option>
                          <option className="name_option" value="skechers" >Skechers</option>
                          <option className="name_option" value="asics" >Asics</option>
                          <option className="name_option" value="puma">Puma</option>
                          <option className="name_option" value="slazenger">Slazenger</option>
              </select>
            </li>
          </ul>
          <div className="menu">
                  <Icon icon="fe:app-menu" color={cardsType ? "black" : '#40bfff'} width="25" height="25" onClick={() => setCardsType(prev => !prev)}/>
                  <Icon icon="eva:menu-outline" color={cardsType ? '#40bfff' : 'black'} width="25" height="25" onClick={() => setCardsType(prev => !prev)}/>
          </div>
          </div>
            
              <div className="product_cards" style={{display: cardsType ? 'none' : 'grid'}}>
                {!sortingByName ? 
                  <div className="controllers">
                    <span onClick={() => {setPageNumber(0)}}> 
                    <UpdateIcon /> Return
                    </span>
                    <span onClick={() => {setPageNumber(documentSnapshotNext)}}>
                    <RedoRoundedIcon /> Next
                    </span>
                  </div>
                : null}
                {sortedData?.map((item,index) => {
                  return <div className="cards" key={index} onClick={(e) => {e.stopPropagation();navigate(`/product/${item.productID}`)}}>
                          <div className="view">
                          <img src={item.main_img} alt="krasofka" className="main_image" />
                            {item.type == 'hot' ? <span className="new">Hot</span> : null}
                          <div className="buy">
                            <div className="choose">
                              <Icon icon="akar-icons:heart" color={hover.love ?  'black' : "#40bfff"} width="25" height="25" onMouseOver={(e) => setHover({...hover,love:false})} onMouseOut={(e) => setHover({...hover,love:true})} onClick={(e) => {e.stopPropagation(); addLiked(item.main_img,item.name,item.productID)}} className='icon'/>
                              <Icon icon="wpf:luggage-trolley" color={hover.trolley ?  'black' : "#40bfff"} width="25" height="25" onMouseOver={(e) => setHover({...hover,trolley:false})} onMouseOut={(e) => setHover({...hover,trolley:true})} onClick={(e) => {e.stopPropagation(); addCard(item.main_img,item.name,item.productID)}} className='icon'/>
                            </div>
                          </div>
                          </div>
                          <div className="text">
                            <h3 className='name'>{item.name}</h3>
                            <div className="stars_collection">
                              <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 1 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                              <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 2 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                              <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 3 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                              <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 4 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                              <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 5 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                            </div>
                            <div className="add">
                              <span className="cost">${item.price}</span>
                              <span className="rcost">${item.old_price}</span>
                              <span className="dis">{Math.round(100 - (item.price * 100) / item.old_price)}%</span>
                            </div>
                          </div>
                        </div>
                })}
              </div>
             
              <div className="product_cards2" style={{display: cardsType ? 'flex' : 'none'}}>
                {!sortingByName ? 
                    <div className="controllers">
                      <span onClick={() => {setPageNumber(0)}}> 
                      <UpdateIcon /> Return
                      </span>
                      <span onClick={() => {setPageNumber(documentSnapshotNext)}}>
                      <RedoRoundedIcon /> Next
                      </span>
                    </div>
                  : null}
                {sortedData?.map((item,index) => {
                  return <div className="cards" key={index}>
                            <div className="view">
                              <img src={item.main_img} alt="krasofka" className="main_image" />
                              {item.type == 'hot' ? <span className="new">Hot</span> : null}
                            </div>
                            <div className="text">
                              <h3 className='name'>{item.name}</h3>
                              <div className="mark">
                                <div className="stars_collection">
                                  <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 1 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                                  <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 2 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                                  <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 3 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                                  <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 4 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                                  <Icon icon="ant-design:star-filled" color={Math.floor(item.rating.stars / item.rating.users.length) >= 5 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                                </div>
                                <span className="reviews">{item.comments.length}</span>
                                <span className="submit_re"><Link to={`/product/${item.productID}`}>Submit a review</Link></span>
                              </div>
                              <div className="cost">
                                <span className="r_cost">${item.price}</span>
                                <span className="d_cost">${item.old_price}</span>
                                <span className="dis_per">{Math.round(100 - (item.price * 100) / item.old_price)}%</span>
                              </div>
                              <div className="inner_text">
                                {item.description}
                              </div>
                              <div className="final">
                                <div className='buy' onClick={() => addCard(item.main_img,item.name,item.productID)}>  <Icon icon="wpf:luggage-trolley" color={"#40bfff"} width="25" height="25" className='icon' /> Add to card</div>
                                <div className='like' onClick={() => addLiked(item.main_img,item.name,item.productID)}><Icon icon="akar-icons:heart" color={"#40bfff"} width="25" height="25"  className='icon' /></div>
                              </div>
                            </div>
                        </div>
                })}
              </div>
          
          </div>
      </div>
    </main>
  </>)
};
export default Hot_Deals;