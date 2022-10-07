import React,{useState,useEffect,useContext} from 'react'
import SNavbar from '../../components/setting_navbar/SNavbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Tables from '../../components/table/Table';
import {useQuery} from 'react-query'
import {doc,getDocs,getDoc,collection} from 'firebase/firestore'
import {db} from '../../context/firebase';
import {DataContext} from '../../context/Context'
import './products.scss';

function Products() {
    let {state} = useContext(DataContext);
    let [sidebarHide,setSidebarHide] = useState(false);
    let months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    let [products_rows,setProducts_rows] = useState([]);
    let {data:users,error:usersError,isLoading:usersLoading,refetch} = useQuery('users',() => {
        let usersCollection = collection(db,'users');
        return getDocs(usersCollection)
    },{
        select:(snapshot) => {
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
                  id:item.link,
                  product:doc.data().name,
                  img:doc.data().main_img,
                  date:item.timeStamp[0] + ' ' + months[item.timeStamp[1]] + ', ' + item.timeStamp[2],
                  amount:doc.data().price,
                  status:item.type
                });
              })
        })
        setProducts_rows(arr)
        refetch()
    },[usersLoading])

    function setSidebar(){
        setSidebarHide(pre => !pre);
    }

  return (
    <div className='products'>
        <div className={sidebarHide ? 'black_layer' : 'buried'} onClick={() => {setSidebarHide(pre => !pre)}}></div>
        <div className="static_sidebar">
            <div className='fixed_sidebar'>
                <Sidebar setSidebar={setSidebar}/>
            </div>
        </div>
        <div className={sidebarHide ? 'dynamic_sidebar show' : 'dynamic_sidebar hide'}>
            <Sidebar setSidebar={setSidebar}/>
        </div>
        <div className="productsContainer">
            <SNavbar setSidebar={setSidebar}/>
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

export default Products