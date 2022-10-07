//tools
import React,{useEffect,useContext} from "react";
import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import {QueryClient,QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools'
//components
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Contact from './pages/contact/Contact';
import Hot_Deals from "./pages/hot_deals/Hot_Deals";
import Product from "./pages/product/Product";
import Star from './components/Star'
import User from "./pages/user/User";
//styles import
import Bottom from "./components/bottom/Bottom";
import Cart from "./pages/cart/Cart";
import SignUp from "./pages/signup/SignUp";
import Login from "./pages/login/Login";
import Profile_Check from "./context/hooks";
import {DataContext} from './context/Context'
import {auth,db} from './context/firebase'
import {onAuthStateChanged} from 'firebase/auth'
import {doc,getDoc} from 'firebase/firestore';
import Single from "./pages/single/Single";
// import List from "./pages/list/List";
import Products from "./pages/products/Products";
import Purchased from "./pages/purchased/Purchased";
import Notification from "./pages/notification/Notification";
import Messenger from "./pages/messenger/Messenger";
import homeImage from '../public/assets/view_b.png';

const queryClient = new QueryClient();
function App() {
  let {state,dispatch} = useContext(DataContext)

    useEffect(() => {
        onAuthStateChanged(auth,(userAuth) => { 

          if(!userAuth){
              <Navigate to={'/login'} />
            }
            localStorage.setItem('userToken',userAuth.accessToken);
            localStorage.setItem('userId',userAuth.uid)
            const getUser = async() => {
              let userData = doc(db,'users',userAuth.uid);
              await getDoc(userData).then((res) =>{
                dispatch({
                  type:'LogIn',
                  userToken:localStorage.getItem('userToken'),
                  user:userAuth,
                  userEmail:res.data().email,
                  userName:res.data().user,
                  userImg:res.data().img,
                  userId:localStorage.getItem('userId'),
                  userCreatedAt:userAuth.metadata.creationTime,
                })
              })
            }
            getUser();
        })
    },[])


  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/">
          <Route index element={<Home bgImage={`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/hamza-nouasria-bqj1GMsSKM-unsplash-min.webp?alt=media&token=4d7d688b-564c-4ca7-ade9-6cad3e93b840`} type={'completed'} productPng={homeImage}/>} />
          <Route path="bags" element={<Home bgImage={`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/alfonso-ramirez-TQ8RWNM0eBY-unsplash-min.webp?alt=media&token=5cd33bb1-a065-47ec-988f-586f1a6794fd`} type={'incomplete'} productPng={"https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/pngwing.com-min.webp?alt=media&token=7280a706-b04f-4c62-8689-704d52b884ba"} />} />
          <Route path="sneakers" element={<Home bgImage={`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/taylor-smith-aDZ5YIuedQg-unsplash-min_1.webp?alt=media&token=2670bb94-256c-4421-90c2-dba393b38798`} type={'incomplete'} productPng={`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/pngwing.com-_1_-min.webp?alt=media&token=a3334b5b-f066-42f8-bb43-328fa3ae7cb3`}/>} />
          <Route path="belt" element={<Home bgImage={`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/jacob-spencer-NXWZj96mgfs-unsplash-min_1.webp?alt=media&token=bfc884b8-0303-4137-81d5-8862b1f74acc`} type={'incomplete'} productPng={`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/pngwing.com-_2_-min.webp?alt=media&token=f146effb-fdab-4e0d-a8d3-1bea568f024f`}/>} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="contact" element={<Profile_Check><Contact /></Profile_Check>} />
          <Route path="cart" element={<Profile_Check><Cart /></Profile_Check>} />
          <Route path="hot_deals" element={<Profile_Check><Hot_Deals /></Profile_Check>}>
            <Route path=":id" element={<Profile_Check><Product /></Profile_Check>} />
          </Route>
          <Route path="product">
            <Route path=":productID" element={<Profile_Check><Product /></Profile_Check>} />
          </Route>
          
        </Route>
        <Route path="user">
          <Route index element={<Profile_Check><User /></Profile_Check>}/>
          <Route path="dashboard" element={<Profile_Check><Single /></Profile_Check>} />
          <Route path="list" element={<Profile_Check><Products /></Profile_Check>} />
          <Route path="purchased" element={<Profile_Check><Purchased word={'Purchased Products'} search={'purchased'}/></Profile_Check>} />
          <Route path="card" element={<Profile_Check><Purchased word={'Products in Card'} search={'card'}/></Profile_Check>} />
          <Route path="liked" element={<Profile_Check><Purchased word={'Liked Products'} search={'liked'}/></Profile_Check>} />
          <Route path="notification" element={<Profile_Check><Notification /></Profile_Check>} />
          <Route path="messenger" element={<Profile_Check><Messenger /></Profile_Check>} />
        </Route>
      </Routes>
      <Bottom />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
     </QueryClientProvider>
    </BrowserRouter>
    );
}

export default App;
