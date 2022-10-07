import React,{useState,useEffect,useContext,useRef} from 'react';
import Carousel from 'react-elastic-carousel';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import {useParams,useNavigate} from 'react-router-dom'
import {doc,getDoc,getDocs,updateDoc,query,orderBy,startAt,endAt} from 'firebase/firestore';
import {useQuery} from 'react-query'
import {db,collectionProducts} from '../../context/firebase'
import './product.scss';
import Page_animation from '../../components/animations/Page_animation';
import '../../components/animations/animation.scss';
import {DataContext} from '../../context/Context';

function Product() {
  let {state} = useContext(DataContext);
  let navigate = useNavigate();
  let [qty,setQty] = useState(0);
  let caruselRef = useRef();
  let [chosenPhoto,setChosenPhoto] = useState(0);
  let inner_nav = ['Product Information', 'Reviews 0','Another Tab']
  let [activated_nav,setActivated_nav] = useState(0);
  let {productID} = useParams();
  let [hover, setHover] = useState({love:true,trolley:true});
  let [slide_style, setSlide_style] = useState({left:0});
  let [animation,setAnimation] = useState(true);
  let [selectedColor,setSelectedColor] = useState(0);
  let [editingReview,setEditingReview] = useState('');
  let [ratedProduct,setRatedProduct] = useState(0);
  let [productInfo,setProductionInfo] = useState('description');
  let [seeMore,setSeeMore] = useState(true);
  let months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

  let [starsOfProduct,setStarsOfProduct] = useState(0);
  let [lightning,setLightning] = useState(0);

  let {data:user,isLoading:userLoading,refetch:userRefetch} = useQuery('user',() => {
    let userDoc = doc(db,'users',localStorage.getItem('userId'));
    return getDoc(userDoc);
  },{
    select:(snapshot) => {
      return snapshot.data();
    }
  })
  let {data:product,error:productError,refetch:productFetchAgain} = useQuery(['product',productID],() => {
    let productDoc = doc(db,'products',productID);
    return getDoc(productDoc)
  },{
    select:(snapshot) => {
      return {...snapshot.data()};
    }
  })
  let {data:relatedProducts,error:relatedError} = useQuery(['related'],() => {
    let random = Math.floor((Math.random() * 13));
    let relatedPros = query(collectionProducts,orderBy('id'),startAt(random),endAt(random + 3));
    return getDocs(relatedPros)
  },{
    select:(snapshot) => {
      let related_products = [];
            snapshot.docs.forEach((doc) => {
                related_products.push({...doc.data(),productID:doc.id})
              })
      return related_products
    }
  })
  let {data:bestSeller,error:bestError} = useQuery('bestseller',() => {
    return getDocs(collectionProducts)
  },{
    select:(snapshot) => {
      let arr = [];
      let max = 0;
      let id = 0;
      snapshot.docs.forEach((item,index) => {
        if(item.data().rating.stars > max) {
          max = item.data().rating.stars;
          id = index
        }
        arr.push({...item.data(),productID:item.id})
      })
      return arr[id];
    }
  })

  let breakPoints = [
    {width:1,itemsToShow:1}
  ]
  let [stars,setStars] = useState([{s:'true'},{s:'false'},{s:'false'},{s:'false'},{s:'false'}])
  let [block, setBlock] = useState(false);
  
  // let starsOfProduct = product?.rating?.stars / product?.rating?.users.length;
  // let lightning = product?.rating?.users.find((item,index) => {return item.uid == state.userId ? setRatedProduct(item.mark) : index});
 
  function highlightStar(id) {
      
      if(block){
          return
      }

      let arr = stars.map((item,index) => index <= id ? item = {s:'true'} : {s:'false'}
      );

      setStars(arr);
  }

  function setStar(id){
    let arr = stars.map((item,index) => index <= id ? item = {s:'true'} : {s:'false'});
    
    let test = product?.rating?.users.find(obj => obj.uid == state.userId);

    if(!test) {
      let rating = doc(db,'products',productID);
      updateDoc(rating,{
        rating:{
          stars:product?.rating.stars + id + 1,
          users:[
            ...product?.rating.users,
            {
              mark: id + 1,
              uid: state.userId,
            }
          ]
        }
      })
    }
      setRatedProduct(id+1);
      setStars(arr);
      setBlock(true)
  }


  useEffect(() => {

   let animTime = setTimeout(() => setAnimation(false),2000);
   let productStars = +product?.rating?.stars / +product?.rating?.users?.length;
   console.log(product?.rating?.stars)
   setStarsOfProduct(productStars);
   setLightning(product?.rating?.users.find((item,index) => {return item.uid == state.userId ? setRatedProduct(item.mark) : index}));

    return () => {
     clearTimeout(animTime);
    }
  },[product])

  function slide(num) {
    setSlide_style({
      left: num * 190 + 'px',
    }); 
    setActivated_nav(num);

};

const goToProduct = (productID) => {
  navigate(`/product/${productID}`);
 }


function insertReview() {
  let arr = [];
  let dir = product.img[selectedColor].imgs;
  let date = new Date();
  for(let i = 0; i < 3; i++){
    let generatedNum = Math.floor((Math.random() * dir.length));
    if(arr.length != 0 && arr[i - 1] == dir[generatedNum] && generatedNum == 0){
      arr.push(dir[generatedNum - 1])
    }
    arr.push(dir[generatedNum])
  }
  let rating = doc(db,'products',productID);
  updateDoc(rating,{
    comments:[
      ...product.comments,
      {
        comment:editingReview,
        name:state.userName,
        productImgs:arr,
        rating: ratedProduct,
        timeStamp: months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear(),
        userImg: state.userImg, 
      }
    ]
  })
  productFetchAgain();
  setSeeMore(false);
}

function insertLike() {
  let likee = doc(db,'products',productID);

  if(!product?.likee.users.includes(state.userId)){
    updateDoc(likee,{
      likee:{
        likes:product?.likee.likes + 1,
        users:[
          ...product?.likee.users,
          state.userId,
        ]
      }
    })
  }
  productFetchAgain();
}

function insertStar() {
  let star = doc(db,'products',productID);
  if(!product?.rating?.users.includes(state.userId)) {
    updateDoc(star,{
      rating: {
        stars: product?.rating?.stars + 1,
        users: [
          ...product?.rating?.users,
          {
            mark:ratedProduct,
            uid:state.userId,
          }
        ]
      }
    })
  }
  productFetchAgain();
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
    alert('You have already liked this product')
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
      alert('This product has added to your card already.')
    } 
      userRefetch()
}

function choosePhoto(index) {
  setChosenPhoto(index);
  caruselRef.current.goTo(index);
}
  return (<>
    {animation ? <Page_animation /> : null}

    <div className='product_page'>
        <div className='product'>
          <section className='product_section1'>
            <div className='img_part'>
                {product ? 
                  <Carousel enableAutoPlay initialActiveIndex={0} autoPlaySpeed={15000} breakPoints={breakPoints} className="carusel" ref={caruselRef}>
                    {product?.img?.[selectedColor]?.imgs?.map((image,index) => (
                      <Item maxWidth="100%" className="carusel_card bag" key={index}>
                        <img src={image} alt="img" key={index} className='img'/>
                      </Item>) 
                    )}
                  </Carousel> : null
                } 
            
            <div className='hot_deal_collection'>     
                {product?.img?.[selectedColor].imgs.map((image,index) => (
                  <div className={'case'} key={index} onClick={() => choosePhoto(index)} style={chosenPhoto == index ? {border:'3px solid #40bfff',transition:'300ms ease'} : {border:'1px solid black'}}>
                    <img src={image} alt={"product " + index + 1} className={'case_img'} />
                  </div>
                ))} 
            </div>
            </div>
      
            
            <div className='info_part'>
              <header className='heading'>{product?.name}</header>
              <div className='markings'>
                <div className='star_rating'>
                  <span className='star' style={{color:'yellow'}}>
                  <Icon icon="ant-design:star-filled" color={starsOfProduct >= 1 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                  </span>  
                  <span className='star' style={{color:'yellow'}}>
                  <Icon icon="ant-design:star-filled" color={starsOfProduct >= 2 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                  </span>
                  <span className='star' style={{color:'yellow'}}>
                  <Icon icon="ant-design:star-filled" color={starsOfProduct >= 3 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                  </span>
                  <span className='star' style={{color:'yellow'}}>
                  <Icon icon="ant-design:star-filled" color={starsOfProduct >= 4 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                  </span>
                  <span className='star star1' style={{color:'yellow'}}>
                  <Icon icon="ant-design:star-filled" color={starsOfProduct >= 5 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                  </span>
                </div>
                <span className='rated'> {Math.round(starsOfProduct)} ({product?.rating?.users.length} reviews)</span>
                <span className='submit_review'>
                  <a href="#reviews" onClick={() => setProductionInfo('reviews')}>Submit review</a> 
                </span>
              </div>
              <span className='border'></span>
              <div className='prices'>
                <span className='real_price'>${product?.price}</span>
                <span className='old_price'>${product?.old_price}</span>
                <span className='percent'>{Math.round(100 - (product?.price * 100) / product?.old_price)}%</span>
              </div>
              <div className='info_text'>
                <ul className='col'>
                  {product?.productInfo?.map((obj,index) => (
                    <li key={index} className='key'>{obj.key}</li>
                  ))}
                </ul>
                <ul className='col'>
                  {product?.productInfo?.map((obj,index) => (
                    <li key={index} className='value'>{obj.value}</li>
                  ))}
                </ul>
              </div>
              <span className='border'></span>
              <div className='product_settings'>
                <ul className='col'>
                  <li className='key'>Select color:</li>
                  <li className='key'>Size</li>
                </ul>
                <ul className='col'>
                  <li className='colors'>
                    {product?.img?.map((image,index) => {
                      let first = '';
                      let second = '';
                      let third = '';
                      let check = !image.colorName.includes('/');
                      if(check){
                        first = image.colorName;
                        second = image.colorName;
                        third = image.colorName;
                      }else{
                        let arr = image.colorName.split('/');
                        first = arr[0];
                        second = arr[1];
                        arr.length == 3 ? third = arr[2] : third = arr[0];
                      }
                      
                      return <button className={selectedColor == index ? 'color selected' : 'color'}
                                key={index}
                                onClick={() => setSelectedColor(index)}
                                style={{backgroundImage:`linear-gradient(${first},${second},${third})`}}>
                        </button>
                      
                    })} 
                  </li>

                  <li className='size_container'>
                    <select name="size" id="size" className='size_options'>
                      <option value="2x">2x</option>
                      <option value="3x">3x</option>
                      <option value="5x">5x</option>
                    </select>
                  </li>
                </ul>
              </div>
              <span className='border'></span>
              <div className='product_buying'>
                <div className='incrementor'>
                  <button className='minus' onClick={() => setQty(prev => prev > 0 ? prev - 1 : prev)}>-</button>
                  <span className='qty'>{qty}</span>
                  <button className='plus' onClick={() => setQty(prev => prev + 1)}>+</button>
                </div>
                <div className='reactions'>
                <button className='buy' onClick={() => addCard(product?.main_img,product?.name,productID)}><Icon icon="wpf:luggage-trolley" color={"#40bfff"} width="25" height="25" className='icon'/> Add to card</button>
                <button className='like' onClick={() => {insertLike();addLiked(product?.main_img,product?.name,productID)}}>{user?.liked.includes(productID) ? <Icon icon="bi:heart-fill"  className='icon' color="red" width="25" height="25" /> : <Icon icon="akar-icons:heart" width="25" height="25" className='icon' color={"#40bfff"}/>}</button>
                </div>
              </div>
              <span className='border'></span>
              <div className='product_sharings'>
                <button className='facebook'>
              <Icon icon="eva:facebook-fill" color="white" width="25" height="25" />
                <span>Share on Facebook</span>
                </button>
                <button className='twitter'>
                <Icon icon="bi:twitter" color="white" width="25" height="25" />
                  <span>Share on Twitter</span>
                </button>
              </div>
            </div>
          </section>
          <section className='product_section2'>
          <nav className="items_nav">
            <ul className="items">
              {inner_nav.map( (item,index) => (
                <li className={index == 2 ? 'item item0' : 'item' } key={index} onClick={() => { slide(index) }}  ><a className="a" style={ activated_nav == index ? {color:'#40bfff'} : {color:'black'}} onClick={() => setProductionInfo(index == 0 ? 'description' : index == 1 ? 'reviews' : 'another_tab')}>{item}</a></li>
              ))}
              
            </ul>
            <span className="slider" style={slide_style}></span>
          </nav>
                {productInfo == 'description' ? 
                  <div className='product_info_text'>
                    {product?.description}
                  </div>
                  : productInfo == 'reviews' ?
                  <div className="reviews" >
                    <div className='key'><span>Rate our product <span className='finger'>👇</span></span><span style={{cursor:'pointer'}} onClick={() => setSeeMore(prev => !prev)}>See more</span></div>
                    <div className='star_rating'>   
                      <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(0)} onClick={() => {setStar(0); insertStar}}>
                      <Icon icon="ant-design:star-filled" color={lightning ? 'gold' : stars[0].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
                      </button>  
                      <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(1)} onClick={() => {setStar(1); insertStar}}>
                      <Icon icon="ant-design:star-filled" color={lightning ? 'gold' : stars[1].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
                      </button>
                      <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(2)} onClick={() => {setStar(2); insertStar}}>
                      <Icon icon="ant-design:star-filled" color={lightning ? 'gold' : stars[2].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
                      </button>
                      <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(3)} onClick={() => {setStar(3); insertStar}}>
                      <Icon icon="ant-design:star-filled" color={lightning ? 'gold' : stars[3].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
                      </button>
                      <button className='star star1' style={{color:'silver'}} onMouseOver={() => highlightStar(4)} onClick={() => {setStar(4); insertStar}}>
                      <Icon icon="ant-design:star-filled" color={lightning ? 'gold' : stars[4].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
                      </button>
                    </div>
                     {
                    product?.comments.map((comment,index) => {
                      return <div className="people_review" key={index} style={index > 0 && seeMore ? {display:"none"} : {display:'flex'}}>
                                <div className="from">
                                  <img src={comment.userImg} alt="avatar" className='image'/>
                                  <div className='name_star'>
                                    <span className='name'>{comment.name}</span>
                                    <span className='marked'>
                                      <div className='star_rating'>
                                        <span className='star' style={{color:'yellow'}} >
                                        <Icon icon="ant-design:star-filled" color={comment.rating >= 1 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                        </span>  
                                        <span className='star' style={{color:'yellow'}} >
                                        <Icon icon="ant-design:star-filled" color={comment.rating >= 2 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                        </span>
                                        <span className='star' style={{color:'yellow'}} >
                                        <Icon icon="ant-design:star-filled" color={comment.rating >= 3 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                        </span>
                                        <span className='star' style={{color:'yellow'}} >
                                        <Icon icon="ant-design:star-filled" color={comment.rating >= 4 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                        </span>
                                        <span className='star star1' style={{color:'yellow'}}>
                                        <Icon icon="ant-design:star-filled" color={comment.rating >= 5 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                        </span>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                                <div className="message">
                                  {comment.comment}
                                </div>
                                <div className="related_photo">
                                  <img src={comment.productImgs[0]} alt="product_photo" className='product_based_photo'/>
                                  <img src={comment.productImgs[1]} alt="product_photo" className='product_based_photo'/>
                                  <img src={comment.productImgs[2]} alt="product_photo" className='product_based_photo'/>
                                </div>
                                <div className='time_posted'>
                                  {comment.timeStamp}
                                </div>
                            </div>
                    })
                  }
               
                            <div className='leave_review' id='reviews'>
                              <textarea className='review_write' placeholder='leave a review' onChange={(e) => setEditingReview(e.target.value)}>

                              </textarea>
                              <button className='send_review' onClick={insertReview}>Submit</button>
                            </div>
                  </div>
                  : <div className="another_tab">
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro rerum itaque reiciendis necessitatibus. Facere at in eius adipisci mollitia, qui ea commodi numquam sint incidunt distinctio? Libero obcaecati eius doloremque?</p>
                  </div>
              
                }
                

          </section>
        </div>
        <div className='best_seller'>
          <h2 className='bs_header'>Best Seller</h2>
        <div className='bs_card' onClick={() => goToProduct(bestSeller?.productID)}>
          <img src={bestSeller?.main_img} alt='add_photo' className='bs_img'/>
          <div className='bs_cost'>
            <div className="stars_collection">
                <Icon icon="ant-design:star-filled" color={Math.floor(bestSeller?.rating?.stars / bestSeller?.rating?.users.length) >= 1 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                <Icon icon="ant-design:star-filled" color={Math.floor(bestSeller?.rating?.stars / bestSeller?.rating?.users.length) >= 2 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                <Icon icon="ant-design:star-filled" color={Math.floor(bestSeller?.rating?.stars / bestSeller?.rating?.users.length) >= 3 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                <Icon icon="ant-design:star-filled" color={Math.floor(bestSeller?.rating?.stars / bestSeller?.rating?.users.length) >= 4 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
                <Icon icon="ant-design:star-filled" color={Math.floor(bestSeller?.rating?.stars / bestSeller?.rating?.users.length) >= 5 ? 'gold' : "#c1c8ce"} width="20" height="20" className="star" />
            </div>
            <div style={{display:'flex',alignItems:"center",width:'100px',justifyContent:'space-between'}}>
              <span className='bs_real_price'>${bestSeller?.price}</span>
              <span className='bs_old_price'>${bestSeller?.old_price}</span>
            </div>
          </div>
          </div>
        
        </div>
    </div>
    <div className='mobile_product_page'>
       {product ? 
          <Carousel enableAutoPlay autoPlaySpeed={15000} breakPoints={breakPoints} className="carusel" >
          {product?.img?.[selectedColor].imgs.map((image,index) => (
            <Item maxWidth="100%" className="carusel_card bag" key={index}>
              <img src={image} alt="img" key={index} className='img'/>
            </Item>) 
          )}
        </Carousel> : null
        } 
        
        <div className='wrap_infos'>
        <div className='product_informations'>
          <div className='name_and_liked'>
            <span className='header'>
              {product?.name}
            </span>
            <span style={{width:'25px',height:'25px',cursor:'pointer'}}>
              {user?.liked.includes(productID) ? <Icon icon="bi:heart-fill"  className='icon' color="red" width="25" height="25"  onClick={() => {insertLike(); addLiked(product?.main_img,product?.name,productID)}}/> : <Icon icon="akar-icons:heart" width="25" height="25" className='icon' color={"#40bfff"}  onClick={() => {insertLike(); addLiked(product?.main_img,product?.name,productID)}}/>}
            </span>
          </div>
          <div className='star_rating'>   
            <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(0)} onClick={() => {setStar(0); insertStar}}>
            <Icon icon="ant-design:star-filled" color={lightning ? 'gold' :stars[0].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </button>  
            <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(1)} onClick={() => {setStar(1); insertStar}}>
            <Icon icon="ant-design:star-filled" color={lightning ? 'gold' :stars[1].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </button>
            <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(2)} onClick={() => {setStar(2); insertStar}}>
            <Icon icon="ant-design:star-filled" color={lightning ? 'gold' :stars[2].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </button>
            <button className='star' style={{color:'silver'}} onMouseOver={() => highlightStar(3)} onClick={() => {setStar(3); insertStar}}>
            <Icon icon="ant-design:star-filled" color={lightning ? 'gold' :stars[3].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </button>
            <button className='star star1' style={{color:'silver'}} onMouseOver={() => highlightStar(4)} onClick={() => {setStar(4); insertStar}}>
            <Icon icon="ant-design:star-filled" color={lightning ? 'gold' :stars[4].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </button>
          </div>

          <span className='price'>
            ${product?.price}
          </span>

        </div>

        <div className='size_part'>
          <span className='header'>Select size</span>
          <div className='sizes'>
            <button className='size'>6.5</button>
            <button className='size selected'>7.0</button>
            <button className='size'>7.5</button>
            <button className='size'>8.0</button>
            <button className='size'>8.5</button>
          </div>
        </div>
        <div className='color_part'>
          <span className='header'>Select color</span>
          <div className='sizes'>
            {product?.img?.map((image,index) => {
              let first = '';
              let second = '';
              let third = '';
              let check = !image.colorName.includes('/');
              if(check){
                first = image.colorName;
                second = image.colorName;
                third = image.colorName;
              }else{
                let arr = image.colorName.split('/');
                first = arr[0];
                second = arr[1];
                arr.length == 3 ? third = arr[2] : third = arr[0];
              }
              
              return <button className={selectedColor == index ? 'size selected' : 'size'}
                        key={index}
                        onClick={() => setSelectedColor(index)}
                        style={{backgroundImage:`linear-gradient(${first},${second},${third})`}}>
                </button>
               
            })} 
          {/* <button className='size blue '></button>
          <button className='size red'></button>
          <button className='size green selected'></button>
          <button className='size ink'></button>
          <button className='size dblue'></button> */}
          </div>
        </div>
        <div className='about_product'>
          <span className='header'>
            Specification
          </span>
          <div style={{gap:'10px'}}>{product?.productInfo?.map((obj,index) => (
              <div className='part1' key={index}>
                <span className='title'>{obj.key}</span>
                <span>{obj.value}</span>
              </div>
          ))}
          </div>
          <div className='part3' style={{marginTop:'10px'}}> 
            {product?.description}
          </div>
        </div>
        <button className='add_to_cart' onClick={() => addCard(product?.main_img,product?.name,productID)}>
          Add To Cart
        </button>
        <div className='reviews'>
          <div className='review_nav'>
            <span className='header'>Review Product</span>
            <span className='more' style={{cursor:'pointer'}} onClick={() => setSeeMore(pre => !pre)}>See more</span>
          </div>
          <div className='rating'>
          <div className='star_rating'>
            <span className='star' style={{color:'yellow'}}>
            <Icon icon="ant-design:star-filled" color={starsOfProduct >= 1 ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </span>  
            <span className='star' style={{color:'yellow'}}>
            <Icon icon="ant-design:star-filled" color={starsOfProduct >= 2 ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </span>
            <span className='star' style={{color:'yellow'}}>
            <Icon icon="ant-design:star-filled" color={starsOfProduct >= 3 ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </span>
            <span className='star' style={{color:'yellow'}}>
            <Icon icon="ant-design:star-filled" color={starsOfProduct >= 4 ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </span>
            <span className='star star1' style={{color:'yellow'}}>
            <Icon icon="ant-design:star-filled" color={starsOfProduct >= 5 ? 'gold' : "#c1c8ce"} width="25" height="25" />
            </span>
          </div>
          <span className='rated'> {Math.round(starsOfProduct)} ({product?.rating?.users.length} reviews)</span>
          </div>

          {
            product?.comments.map((comment,index) => {
              return <div className="people_review" key={index} style={index > 0 && seeMore ? {display:"none"} : {display:'flex'}}>
                        <div className="from">
                          <img src={comment.userImg} alt="avatar" className='image'/>
                          <div className='name_star'>
                            <span className='name'>{comment.name}</span>
                            <span className='marked'>
                              <div className='star_rating'>
                                <span className='star' style={{color:'yellow'}} >
                                <Icon icon="ant-design:star-filled" color={comment.rating >= 1 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                </span>  
                                <span className='star' style={{color:'yellow'}} >
                                <Icon icon="ant-design:star-filled" color={comment.rating >= 2 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                </span>
                                <span className='star' style={{color:'yellow'}} >
                                <Icon icon="ant-design:star-filled" color={comment.rating >= 3 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                </span>
                                <span className='star' style={{color:'yellow'}} >
                                <Icon icon="ant-design:star-filled" color={comment.rating >= 4 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                </span>
                                <span className='star star1' style={{color:'yellow'}}>
                                <Icon icon="ant-design:star-filled" color={comment.rating >= 5 ? 'gold' : "#c1c8ce"} width="25" height="25" />
                                </span>
                              </div>
                            </span>
                          </div>
                        </div>
                        <div className="message">
                          {comment.comment}
                        </div>
                        <div className="related_photo">
                          <img src={comment.productImgs[0]} alt="product_photo" className='product_based_photo'/>
                          <img src={comment.productImgs[1]} alt="product_photo" className='product_based_photo'/>
                          <img src={comment.productImgs[2]} alt="product_photo" className='product_based_photo'/>
                        </div>
                        <div className='time_posted'>
                          {comment.timeStamp}
                        </div>
                     </div>
            })
          }
               
          <div className='leave_review'>
            <textarea className='review_write' placeholder='leave a review' onChange={(e) => setEditingReview(e.target.value)}>

            </textarea>
            <button className='send_review' onClick={insertReview}>Submit</button>
          </div>
        </div>
        </div>
    </div>
    <div className='related_products'>
      <h2>Related Products</h2>
      <div className='related_products_cards'>
        {relatedProducts?.map((card,index) => {
                return (<div className="card" key={index} onClick={(e) => {e.stopPropagation();goToProduct(card.productID)}}>
                  <div className="view">
                    {card.type == 'hot' ? <span className="new">Hot</span> : null}
                    <img src={card.main_img} alt="productImg" className="picture"/>
                      <div className="choose">
                        <Icon icon="akar-icons:heart" color={hover.love ?  'black' : "#40bfff"} width="25" height="25" onMouseOver={(e) => setHover({...hover,love:false})} onMouseOut={(e) => setHover({...hover,love:true})} className='icon' onClick={(e) => {e.stopPropagation(); addLiked(card.main_img,card.name,card.productID)}}/>
                        <Icon icon="wpf:luggage-trolley" color={hover.trolley ?  'black' : "#40bfff"} width="25" height="25" onMouseOver={(e) => setHover({...hover,trolley:false})} onMouseOut={(e) => setHover({...hover,trolley:true})} className='icon' onClick={(e) => {e.stopPropagation(); addCard(card.main_img,card.name,card.productID)}}/>
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
    </div>
</>)
}


const Item = styled.div`
  position:relative;
`


export default Product










  // product ? <Carousel enableAutoPlay autoPlaySpeed={15000} breakPoints={breakPoints} className="carusel">
        //               {product?.img[0]?.imgs?.map((image,index) => {
        //                 console.log(image);
        //                 {image ? <Item maxWidth="100%" className="carusel_card bag" key={index}>
        //                   <img src={product?.main_img} alt="wallet" className="img" />
        //                 </Item> : null}
        //               })
        //               }
                      
        //               {/* <Item maxWidth="100%" className="carusel_card bag" >
        //                 <img src="./assets/wallet (1).jpg" alt="wallet" className="img" />
        //               </Item>
        //               <Item maxWidth="100%" className="carusel_card k1" >
        //                 <img src="./assets/k1.jpg" alt="wallet" className="img" />
        //               </Item>
        //               <Item maxWidth="100%" className="carusel_card k2" >
        //                 <img src="./assets/k2.jpg" alt="wallet" className="img" />
        //               </Item>      */}
        //           </Carousel>: null