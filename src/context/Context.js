import React,{useReducer,createContext} from 'react'

export const DataContext = createContext(null);

const data = {
  userToken:null,
  user:null,
  userName:'',
  userImg:null,
  userEmail:'',
  userCreatedAt:0,
  userId:'',
  product:{},
}

function func(state,action){
  switch(action.type) {
    case 'LogIn' :
      state = {
        userToken:action.userToken,
        user:action.user,
        userName:action.userName,
        userImg:action.userImg,
        userEmail:action.userEmail,
        userId:action.userId,
        userCreatedAt:action.userCreatedAt,
      }  
    break;
    case 'SignUp' :
      state = {
        userToken:action.userToken,
        user:action.user,
        userName:action.userName,
        userImg:action.userImg,
        userId:action.userId,
        userEmail:action.userEmail,
        userCreatedAt:action.userCreatedAt,
      }
    break;
    case 'LogOut' :
      state = {
        userToken:'',
        user:null,
        userName:'',
        userImg:null,
        userEmail:null,
        userCreatedAt:0,
      }
    break;
  }
  return state
}

function Context({children}) {
    let [state,dispatch] = useReducer(func,data)
  return (
    <DataContext.Provider value={{state,dispatch}}>{children}</DataContext.Provider>
  )
}

export default Context
