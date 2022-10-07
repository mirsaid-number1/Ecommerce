import React,{useState,useEffect,useContext} from 'react'
import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import SNavbar from '../../components/setting_navbar/SNavbar'
import Chart from '../../components/chart/Chart'
import Tables from '../../components/table/Table';
import {doc,getDocs,collection,getDoc} from 'firebase/firestore';
import {db} from '../../context/firebase';
import {DataContext} from '../../context/Context'
import {useQueryClient,useQuery} from 'react-query'
function Single() {
  let {state} = useContext(DataContext);
  const queryClient = useQueryClient();
  let [sidebarHide,setSidebarHide] = useState(false);
  let [products_rows,setProducts_rows] = useState([]);
  let months = ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];
  let data = queryClient.getQueryData('users');
  let {data:users,error:usersError,isLoading:usersLoading,refetch} = useQuery(['users','single'], () => {
    let userCollection = collection(db,'users');
    return getDocs(userCollection);
  },{
    select:(snapshot) => {
      let data = snapshot?.docs?.find((doc) => state.userId == doc?.id);
      return data?.data();
    },
    // initialData:() => {
    //   let arr = data?.docs?.find((doc) => doc?.id == state.userId);
    //   if(arr) {
    //     return arr?.data();
    //   }
    //   return undefined
    // }
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
              date:item?.timeStamp[0] + ' ' + months[item?.timeStamp[1]] + ', ' + item?.timeStamp[2],
              amount:doc.data().price,
              status:item?.type
            });
      })
    })
    setProducts_rows(arr)
    refetch();
  },[usersLoading])
  

  function setSidebar(){
    setSidebarHide(pre => !pre);
  }

  return (
    <div className='single'>
      <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={() => {setSidebarHide(pre => !pre)}}></div>
      <div className="static_sidebar">
        <div className='fixed_sidebar'>
          <Sidebar setSidebar={setSidebar}/>
        </div>
      </div>
      <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
        <Sidebar setSidebar={setSidebar}/>
      </div>
      <div className="singleContainer">
        <SNavbar setSidebar={setSidebar}
        />
        <div className="top">
          <div className="left">
            <h1 className="title">Infromation</h1>
            <div className="editButton">Edit</div>
            <div className="item">
              <img src={users?.img}
                   alt="hr girl"
                  className='itemImg'/>
              <div className="details">
                <h2 className="itemTitle">{users?.user}</h2>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{users?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Created At:</span>
                  <span className="itemValue">{String(users?.timeStamp)}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">country</span>
                  <span className="itemValue">Uzbekistan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3/1} title={'last 6 months of spendgin of this user'}/>
          </div>
        </div>
        <div className="bottom">
            <h1 className="title">Last Transactions</h1>
            <Tables products_rows={products_rows}/>
        </div>
      </div>
    </div>
  )
}

export default Single