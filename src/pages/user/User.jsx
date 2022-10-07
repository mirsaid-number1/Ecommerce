import React,{useState,useContext,useEffect,useLayoutEffect} from 'react';
import SNavbar from '../../components/setting_navbar/SNavbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Widget from '../../components/widget/Widget';
import Chart from '../../components/chart/Chart';
import Tables from '../../components/table/Table';
import Featured from '../../components/featured/Featured';
import {db} from '../../context/firebase';
import {doc,getDoc} from 'firebase/firestore';
import {DataContext} from '../../context/Context'
import {getDocs,collection} from 'firebase/firestore';
import {useQuery} from 'react-query'

import './user.scss';
function User() {
  let {state} = useContext(DataContext);
  let [sidebarHide,setSidebarHide] = useState(false);
  let amount = 0;
  let total_cost = 760;
  let months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  let [userAmount,setUserAmount] = useState({amount:0,expenditure:0,orders:0,balance:Infinity,total_cost});
  let [products_rows,setProducts_rows] = useState([]);
  let {data:users,error:usersError,isLoading:usersLoading,refetch} = useQuery('users',() => {
    let usersCollection = collection(db,'users');
    return getDocs(usersCollection)
  },{
    select:(snapshot) => {
      amount = snapshot?.docs?.length;
      let data = snapshot?.docs?.find((doc) => state.userId == doc?.id)
      return data?.data();
    }
  })

  

  useEffect(() => {
        let arr = [];
        users?.products?.map((item) => {

          let productDoc = doc(db,'products',item?.link);

              getDoc(productDoc).then(doc => {
                arr.push({
                  id:item?.link,
                  product:doc.data().name,
                  img:doc.data().main_img,
                  date:item?.timeStamp[0] + ' ' + months[item.timeStamp[1]] + ', ' + item.timeStamp[2],
                  amount:doc.data().price,
                  status:item?.type
                });
              })
        })
        setProducts_rows(arr)
        refetch()
    },[ usersLoading])

  useEffect(() => {
      total_cost = Math.round((users?.expenditure * 100) / total_cost);
      setUserAmount({amount,expenditure:users?.expenditure,orders:users?.card?.length,balance:Infinity,total_cost})
    },[usersLoading ])

    
  // setUserAmount({...userAmount,expenditure:doc.data().expenditure,orders:doc.data().card});
  function setSidebar(){
    setSidebarHide(pre => !pre);
  }

  return (
    <div className='user'>
      <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={() => {setSidebarHide(pre => !pre)}}></div>
      <div className="static_sidebar">
        <div className='fixed_sidebar'>
        <Sidebar setSidebar={setSidebar}/>
        </div>
      </div>
      <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
        <Sidebar setSidebar={setSidebar}/>
      </div>
      <div className="userContainer">
        <SNavbar setSidebar={setSidebar}
        />
        <div className="widgets">
          <Widget type='user' amount={userAmount.amount}/>
          <Widget type='order' amount={userAmount.orders}/>
          <Widget type='expenditure' amount={userAmount.expenditure}/>
          <Widget type='balance' amount={userAmount.balance}/>
        </div>
        <div className="charts">
          <Featured expenditure={userAmount.total_cost} amount={userAmount.expenditure}/>
          <Chart aspect={2/1} title={'Last 6 months revenue'}/>
        </div>
        <div className="listContainer">
          <div className="listTitle">
            Latest transactions
          </div>
          <Tables products_rows={products_rows}/>
        </div>
      </div>
    </div>
  )
}

export default User