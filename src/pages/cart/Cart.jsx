import React,{useState,useEffect,startTransition} from 'react';
import { Icon } from '@iconify/react';
import {useQuery} from 'react-query';
import {db} from '../../context/firebase';
import {doc,getDoc,onSnapshot,updateDoc} from 'firebase/firestore'
import './cart.scss';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom';

function Cart() {
    let [qty,setQty] = useState([]);
    let [readyCards,setReadyCards] = useState([]);
    let [refresh,setRefresh] = useState('yes');
    let [finished,setFinished] = useState(false);
    let {width,height} = useWindowSize();

    let {data:cards,error:cardsError,isLoading:cardsLoading,isFetching:cardsFetching,isFetched,refetch} = useQuery('cardsInCart',() => {
        let cardDoc = doc(db,'users',localStorage.getItem('userId'));
        return getDoc(cardDoc);
    },{
        select:(snapshot) => {
            return snapshot.data();
        }
    })

    useEffect(() => {
        let arr=[];
        cards?.card?.map(async(card) => {
            let cardDoc = doc(db,'products',card);
            await getDoc(cardDoc).then(respond => {
                arr.push({...respond.data(),productID:respond.id});
            })
        });

        setQty([...Array(cards?.card?.length).fill(1)]);
        setReadyCards(arr);
        refetch()
    },[isFetched,refresh])


    function deleteProductFromCard(id) {
        let cardDoc = doc(db,'users',localStorage.getItem('userId'));
        let newNotification = cards?.notification?.cards;
        updateDoc(cardDoc,{
            card:[
                ...(cards.card.filter(item => item != id))
            ],
            notification:{cards:newNotification,number:newNotification.length,type:newNotification.length >= 0 ? 'on' : 'off'},
        })
        setReadyCards([...(readyCards.filter(item => item.productID != id))])
        refetch();
    }

    function purchaseMade() {
        let userDoc = doc(db,'users',localStorage.getItem('userId'));
        let remainingProducts = readyCards.map((item,index) => {return qty[index] == 0 ? item.productID : undefined}).filter(item => item != undefined);
        let newPurchased = cards?.card?.map(item => {
            if(!remainingProducts.includes(item)) {
                return {link:item,timeStamp:[new Date().getDate(),new Date().getMonth(),new Date().getFullYear()],type:'purchased'}
            }
        }).filter(item => item != undefined);
        let newProducts = cards?.products?.filter(item => item.type != 'card' || item.type == 'card' && remainingProducts.includes(item.link));
        let purchasingProducts = readyCards.filter((item,index) => qty[index] > 0);
        let newNotificationAddition = purchasingProducts.map(item => { 
                return {
                img:item.main_img,
                name:item.name,
                type:'purchased'
                }
        })
            updateDoc(userDoc,{
                purchased: [...cards?.purchased,...newPurchased],
                notification:{cards:newNotificationAddition.concat(cards?.notification?.cards),number:cards?.notification.number + newPurchased.length,type:'on'},
                products: [...newProducts,...newPurchased],
                expenditure: readyCards.reduce((acc,price,) => acc + +price.price,0) + 20 + cards?.expenditure,
                card:remainingProducts,
            }) 
            setReadyCards([]);
    }
  return (<>
    {finished ? 
        <div className="finished">
            <Confetti 
                width={width}
                height={height}
                gravity={0.05}
                numberOfPieces={800}
            />
            <div className="message">
                <h1>Purchase done successfully</h1>
                <div className='done'>
                    <CheckIcon width={20} fontSize={'large'}/>
                </div>
                <h3 className='status_show'>Success</h3>
                <button className='success_button' onClick={() => setFinished(false)}>Complete</button>
            </div>
        </div> :
        null
    }

        <div className='refresh_section'>
            If you can't see new products that you have added recently to your card, then press the button refresh
            <button className='refresh' onClick={() => setRefresh(''+new Date().getSeconds())}>Refresh</button>
        </div>

    {
        qty.length < 1 && readyCards.length < 1 ? <div className='empty'>
            <span>In your card no products to buy </span>
            <span><Link to="/">Please, return to home page</Link></span>
            </div> : <div className='cart_body'>
        <section className='carts_collection'>
                <div className="carts_part1" >
                    <header className="headers">Product</header>
                    {readyCards?.map((item,index) => (
                       <div className="cart" key={index}>
                                <Icon icon="ph:x-circle" color="#ff4858" width="25" height="24" onClick={() => deleteProductFromCard(item.productID)}/>
                                <img src={item.main_img} alt='trainer' className='cart_image'/>
                                <span className='cart_name'>{item.name}</span>
                            </div>
                    ))}
                </div>
                <div className="carts_part2">
                    <div className="headers_pack">
                        <header className="headers" title='price'>Price</header>
                        <header className="headers" title='quantity'>Qty</header>
                        <header className="headers" title='unit_price'>Unit Price</header>
                    </div>
                    {readyCards.map((item,index) => {
                        return <div className="cart" key={index}>
                            <span className="price">${Math.round(item.price)}</span>
                            <div className='incrementor'>
                                <button className='minus' onClick={() => setQty(qty.map((item,ind) => ind == index && item > 0 ? --item : item))}>-</button>
                                <span className='qty'>{qty[index]}</span>
                                <button className='plus' onClick={() => setQty(qty.map((item,ind) => ind == index ? ++item : item))}>+</button>
                            </div>
                            <span className='unit_price'>${Math.round(+item.price * qty[index] + 20)}</span>
                        </div>
                    })}
                </div>

        </section>
        <section className='mobile_carts_collection'>
            <h2 className='carts_collection_header'>Products</h2>
            {readyCards?.map((item,index) => {
                return <div className="cart" key={index}>
                    <div className="first_part">
                        <Icon icon="ph:x-circle" color="#ff4858" width="35" height="35"  className='cancel' onClick={() => deleteProductFromCard(item.productID)}/>
                        <img src={item.main_img} alt='trainer' className='cart_image'/>
                        <span className='cart_name'>{item.name}</span>
                    </div>
                    <div className="second_part">
                        <span className='key_part'>Price</span>
                        <span className='value_part'>${item.price}</span>
                    </div>
                    <div className="third_part">
                        <span className='key_part'>QTY</span>
                        <div className="value_part">
                            <div className='incrementor'>
                                <button className='minus' onClick={() => setQty(qty.map((item,ind) => ind == index && item > 0 ? --item : item))}>-</button>
                                <span className='qty'>{qty[index]}</span>
                                <button className='plus' onClick={() => setQty(qty.map((item,ind) => ind == index ? ++item : item))}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className="unit_price">
                        <span className="key_part">Unit Price</span>
                        <span className="value_part">${Math.round(+item.price * qty[index] + 20)}</span>
                    </div>
                </div>
            })}
        </section>
        <section className='carts_payment_overall'>
            <div className="voucher">
                <input type="text" className="input" placeholder="voucher code..." aria-label="Search..." aria-describedby="Search..." />
                <button className="btn btn-outline-secondary submit" type="button" id="button-addon2">Redeem</button>
            </div>
            
            <div className='payment'>
                <div className='parts'>
                    <div className='part1'><span>Subtotal</span> <span>${Math.round(readyCards.filter((item,index) => qty[index] > 0).reduce((acc,price,) => acc + +price.price,0))}</span></div>
                    <div className='part1'><span>Sheeping Fee</span> <span>$20</span></div>
                    <div className='part1'><span>Coupon</span> <span>No</span></div>
                </div>
                <div className='total'>
                    <span>Total</span>
                    <span>${Math.round(readyCards.filter((item,index) => qty[index] > 0).reduce((acc,price,index) => acc + +price.price*qty[index],0) + 20)}</span>
                </div>
                <button className='check_out' onClick={() => {purchaseMade(); setFinished(true)}}>Check Out</button>
            </div>
        </section>
    </div> 
    }
    
    
  </>)
}

export default Cart