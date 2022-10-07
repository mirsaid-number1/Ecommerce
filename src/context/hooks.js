import React,{useState,useEffect,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from 'firebase/auth';
import {DataContext} from './Context'
import {auth} from './firebase.js';


export function createUserWithEmail(email,password){
    return createUserWithEmailAndPassword(auth,email,password)
}

export function signInWithEmail(email,password){
    return signInWithEmailAndPassword(auth,email,password)
}

export function signInWithGoogle() {
    return signInWithPopup(auth,new GoogleAuthProvider()) 
}

export function signInWithGithub() {
    return signInWithPopup(auth,new GithubAuthProvider()) 
}

function Profile_Check({children}) {
    let {state} = useContext(DataContext)
    let navigate = useNavigate();
    
    useEffect(() => {
      const checkDetaily = async() => {
        let token = localStorage.getItem('userToken');    
        console.log(token)
          if(!token){
            navigate('/login');
          }
      }
      checkDetaily();
    },[])
    
  return (
    <div>{children}</div>
  )
}

export default Profile_Check