import React,{useState,useRef,useEffect, useContext} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import './signup.scss'
import MailLockOutlinedIcon from '@mui/icons-material/MailLockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import Page_animation from '../../components/animations/Page_animation';
import {createUserWithEmail,signInWithGithub,signInWithGoogle} from '../../context/hooks'
import {db,storage} from '../../context/firebase'
import {doc,setDoc,serverTimestamp,getDoc, addDoc, collection} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {DataContext} from '../../context/Context'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;

function SignUp() {
  let {dispatch,state} = useContext(DataContext);
  let navigate = useNavigate()
  let [show,setShow] = useState(false);
  let [file, setFile] = useState('');
  let [ready_img,setReady_img] = useState(null);
  let [animation,setAnimation] = useState(true);
  let date = new Date();
  let months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];

  const emailRef = useRef();
  const errRef = useRef();
  const userRef = useRef();

  const [user,setUser] = useState('');
  const [validName,setValidName] = useState(false);
  const [userFocus,setUserFocus] = useState(false);

  const [email,setEmail] = useState('');
  const [validEmail,setValidEmail] = useState(false);
  const [emailFocus,setEmailFocus] = useState(false);

  const [pwd,setPwd] = useState('');
  const [validPwd,setValidPwd] = useState(false);
  const [pwdFocus,setPwdFocus] = useState(false);

  const [matchPwd,setMatchPwd] = useState('');
  const [validMatch,setValidMatch] = useState(false);
  const [matchFocus,setMatchFocus] = useState(false);

  const [errMsg,setErrMsg] = useState('');
  const [success,setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
    let anim = setTimeout(() => {setAnimation(false)},1000)
    return () => {
      clearTimeout(anim);
    }
  },[])

  useEffect(() => {

    const uploadFile = () => {

      let randomName = new Date().getTime() + file.name;
      const storageRef = ref(storage, randomName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setReady_img(downloadURL);
          });
        }
      );


    }

    file && uploadFile()

  },[file])

  useEffect(() => {
    let result = USER_REGEX.test(user);
    setValidName(result);
  },[user])

  useEffect(() => {
    let emailCheck = email.includes('@');
    setValidEmail(emailCheck);
  },[email])

  useEffect(() => {
    let result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    let match = pwd == matchPwd;
    setValidMatch(match);
  },[pwd,matchPwd])


  const handleSubmit = (e) =>{
    e.preventDefault();

      createUserWithEmail(email,pwd).then((createdUser) => {
        setDoc(doc(db,'users',createdUser.user.uid),{
          user,
          email,
          img:ready_img,
          timeStamp:createdUser.user.metadata.creationTime,
          expenditure:0,
          card:[],
          liked:[],
          message:{
            messages:[{
              img:'https://lh3.googleusercontent.com/a-/AFdZucrvDJfQvyEljUJpwoECrQaehsFqdeO7et033ezn=s96-c',
              text:`Hello ${user}, my name is Mirsaid. Nice to meet you.`,
              timeStamp:`${date.toLocaleTimeString()}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
              who:'admin'
            }],
            number:1,
            type:'on'
          },
          notification:{
            cards:[],
            number:0,
            type:'off'
          },
          products:[],
          purchased:[],
        })
        dispatch({
          type:'SignUp',
          userToken:createdUser.user.accessToken,
          user:createdUser,
          userEmail:email,
          userName:user,
          userId:createdUser.user.uid,
          userImg:ready_img,
          userCreatedAt:createdUser.user.metadata.creationTime,
        })
        setSuccess(!!createdUser);
      }).catch((err) => {
        setErrMsg(err.message);
      })
      
      
  }

  function SignWithGoogle(){
    signInWithGoogle().then(res => {
      console.log(res.user);
        getDoc(doc(db,'users',res.user.uid)).then(res2 => {
          console.log(res2.data())
          if(!res2?.data()){
            setDoc(doc(db,'users',res.user.uid),{
              user:res.user.displayName,
              email:res.user.email,
              img:res.user.photoURL,
              timeStamp:res.user.metadata.creationTime,
              expenditure:0,
              card:[],
              liked:[],
              message:{
                messages:[{
                  img:'https://lh3.googleusercontent.com/a-/AFdZucrvDJfQvyEljUJpwoECrQaehsFqdeO7et033ezn=s96-c',
                  text:`Hello ${res.user.displayName}, my name is Mirsaid. Nice to meet you.`,
                  timeStamp:`${date.toLocaleTimeString()}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
                  who:'admin'
                }],
                number:1,
                type:'on'
              },
              notification:{
                cards:[],
                number:0,
                type:'off'
              },
              products:[],
              purchased:[],
            })
          }
 
        }      
        ).catch(err => {
        console.log(err.message);
        })
  
      dispatch({
        type:'LogIn',
        userToken:res.user.accessToken,
        user:res,
        userEmail:res.user.email,
        userName:res.user.displayName,
        userId:res.user.uid,
        userImg:res.user.photoURL,
        userCreatedAt:res.user.metadata.creationTime,
      })
      setSuccess(true)
    }).catch((err) => {
      console.log(err.message);
      setErrMsg(err.message);
    })
  }

  function SignWithGithub(){
    signInWithGithub().then(res => {
      getDoc(doc(db,'users',res.user.uid)).then(res2 => {
        console.log(res2.data())
        if(res2.data()){
          setDoc(doc(db,'users',res.user.uid),{
            user:res.user.displayName,
            email:res.user.email,
            img:res.user.photoURL,
            timeStamp:res.user.metadata.creationTime,
            expenditure:0,
            card:[],
            liked:[],
            message:{
              messages:[{
                img:'https://lh3.googleusercontent.com/a-/AFdZucrvDJfQvyEljUJpwoECrQaehsFqdeO7et033ezn=s96-c',
                text:`Hello ${res.user.displayName}, my name is Mirsaid. Nice to meet you.`,
                timeStamp:`${date.toLocaleTimeString()}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
                who:'admin'
              }],
              number:1,
              type:'on'
            },
            notification:{
              cards:[],
              number:0,
              type:'off'
            },
            products:[],
            purchased:[],
          })
        }

      }      
      ).catch(err => {
      console.log(err.message);
      })
      
      dispatch({
        type:'LogIn',
        userToken:res.user.accessToken,
        user:res,
        userEmail:res.user.email,
        userName:res.user.displayName,
        userId:res.user.uid,
        userImg:res.user.photoURL,
        userCreatedAt:res.user.metadata.creationTime,
      })
      setSuccess(true)
    }).catch((err) => {
      console.log(err.message);
      setErrMsg(err.message);
    })
  }
  return (<>
  {animation ? <Page_animation /> : null}
    <div className={success ? 'success' : 'hide'}>
      <div className='text'>
        You are successfully completed Sign up and Log in forms 
      </div>
      <div className="user_info">
        <img src={state.userImg ? state.userImg : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="avatar"  className='avatar'/>

        <div className="miniData">
          <span className='header'>Name:</span> <span className='value'>{state.userName}</span><br />
          <span className="header">Email:</span> <span className="value">{state.userEmail}</span><br />
          <span className="header">Created At:</span> <span className="value">{state.userCreatedAt}</span><br />
        </div>
      </div>
      <button onClick={() => navigate('/')}>Finish</button>
    </div>
    <div className={errMsg ? 'error' : 'hide'}>
        <div className="text">Sorry something went wrong. Probably this email is already in use, or you have a problem with network.</div>
    </div>
    <div className='signup'>
      <div className="properties">
        <div className="left">
          <h2>Sign up to Ecommerce</h2>
          <div className="img">
          <img src="https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/%E2%80%94Pngtree%E2%80%94log-in-login-interface-computer_3945571-min.webp?alt=media&token=185f9183-801e-46fb-9702-eda7643dbd59" 
            alt="login" 
            className='signup_png'
          />
          </div>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit} className='inputs_group'>
            <label htmlFor="email" className='email_label'>
              Email:
              <span className={validEmail ? 'valid' : 'hide'}>
                <DoneOutlinedIcon />
              </span>
              <span className={validEmail || !email ? 'hide' : 'invalid'}>
                <CloseOutlinedIcon />
              </span>
            </label>
            <div className="email">
              <div className='input'>
                <MailLockOutlinedIcon className='icon'/>
                <input 
                 type="email"
                  name="email" 
                  id="email"
                  ref={emailRef}  
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='off'
                  required
                  aria-invalid = {validEmail ? false : true}
                  aria-describedby = 'uidnote'
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </div>
              
              <p id='uidnote' className={emailFocus && !validEmail ? 'instructions' : 'offscreen'}>
                <PriorityHighOutlinedIcon className='icon' />
                @ symbol is required.<br />
                Letters, numbers, underscores, hypens allowed
              </p>
            </div>

            <label htmlFor="password" className='password_label'>
              Password:
              <span className={validPwd ? 'valid' : 'hide'}>
                <DoneOutlinedIcon className='icon' />
              </span>
              <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
                <CloseOutlinedIcon className='icon' />
              </span>
            </label>
            <div className="password">
              <div className="input">
                <LockOpenOutlinedIcon className='icon'/>
                <input
                  type={show ? 'text' : "password"} 
                  name="password" 
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validPwd ? 'false' : 'true'}
                  aria-describedby = 'pwdnote'
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)} 
                />
                <span className="visibility" onClick={() => setShow(prev => !prev)}>
                  {show ? <VisibilityOutlinedIcon className='icon'/> : <VisibilityOffOutlinedIcon className='icon'/>}
                </span>
              </div> 
              <p id='pwdnote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'} >
                <PriorityHighOutlinedIcon className='icon' />
                8 to 24 characters. <br />
                Must include uppercase and lowercase letters, a number and a special 
                characters. <br />
                Allowed special characters : <span aria-label='exclamation mark'>!</span>
                <span aria-label='at symbol'>@</span> <span aria-label='hashtag'>#</span>
                <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
              </p>
            </div>

            <label htmlFor="confirm_pwd" className='confirm_pwd_label'>
              Confirm Password:
              <span className={validMatch && matchPwd ? 'valid' : 'hide'}>
                <DoneOutlinedIcon className='icon' />
              </span>
              <span className={validMatch || !matchPwd ? 'hide' : 'invalid'}>
                <CloseOutlinedIcon className='icon' />
              </span>
            </label>
            <div className="confirm_password">
              <div className="input">
                  <LockOpenOutlinedIcon className='icon'/>
                  <input
                    type={show ? 'text' : "password"} 
                    name="confirm_pwd" 
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? 'false' : 'true'}
                    aria-describedby = 'confirmnote'
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)} 
                  />
                  <span className="visibility" onClick={() => setShow(prev => !prev)}>
                    {show ? <VisibilityOutlinedIcon className='icon'/> : <VisibilityOffOutlinedIcon className='icon'/>}
                  </span>
              </div>
           
              <p id='confirmnote' className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
                <PriorityHighOutlinedIcon className='icon' />
                Must match the first password input field              
              </p>
            </div>
            <div className="personalInfo">
              <div className='first_part'>
                <label htmlFor="name">
                  Name:
                  <span className={validName ? 'valid' : 'hide'}>
                    <DoneOutlinedIcon className='icon' />
                  </span>  
                  <span className={validName || !user ? 'hide' : 'invalid'}>
                    <CloseOutlinedIcon className='icon' />
                  </span>
                </label>
                <div className='input'>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    ref={userRef}
                    onChange={(e) => setUser(e.target.value)}
                    autoComplete='off'
                    required
                    aria-invalid={validName ? false : true}
                    aria-describedby='uidnote'
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                  />
               </div>
               <p id="uidnote" className={userFocus && !validName ? 'instructions' : 'offscreen'}>
                <PriorityHighOutlinedIcon className='icon' />
                4 to 24 characters .<br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hyphens allowed.
               </p>
              </div>
              <div className='second_part'>
                <label htmlFor="image"><DriveFolderUploadIcon className='icon' /> Upload Image</label>
                <input type="file" name="image" id="image" onChange={(e) => setFile(e.target.files[0])} style={{display:'none'}}/>
                <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="avatar"  className='avatar'/>
              </div>
            </div>
            <button type='submit' className='submit' disabled={!ready_img} style={ready_img ? {cursor:'pointer'} : {cursor:'not-allowed'}}>Submit</button>
          </form>
          <div className="break"><span className="line" ></span>OR<span className="line" ></span></div>
          <div className="otherOptions">
            <button className='Google' onClick={SignWithGoogle}><GoogleIcon className='icon'/> Register with Google</button>
            <button className='Git Hub' onClick={SignWithGithub}><GitHubIcon className='icon' /> Register with Git Hub</button>
          </div>
          <span className='log_in'>If you have already created an account, go to <Link to={'/login'} className='link'>Log in page</Link> </span>
        </div>
      </div>
    </div>
  </>)
}

export default SignUp