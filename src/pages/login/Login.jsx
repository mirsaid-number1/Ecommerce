import React,{useState,useEffect,useRef,useContext} from 'react'
import './login.scss';
import {Link,useNavigate} from 'react-router-dom'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import MailLockOutlinedIcon from '@mui/icons-material/MailLockOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import Page_animation from '../../components/animations/Page_animation';
import {signInWithEmail,signInWithGithub,signInWithGoogle} from '../../context/hooks'
import {db} from '../../context/firebase'
import {doc,getDoc,setDoc,serverTimestamp} from 'firebase/firestore';
import {DataContext} from '../../context/Context'

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;

function Login() {
  let navigate = useNavigate();
  let {state,dispatch} = useContext(DataContext);
  let [show,setShow] = useState(false);
  let [animation,setAnimation] = useState(true);
  let months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
  let date = new Date();
  let emailRef = useRef();

  const [email,setEmail] = useState('');
  const [validEmail,setValidEmail] = useState(false);
  const [emailFocus,setEmailFocus] = useState(false);

  const [pwd,setPwd] = useState('');
  const [validPwd,setValidPwd] = useState(false);
  const [pwdFocus,setPwdFocus] = useState(false);

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
    let emailCheck = email.includes('@');
    setValidEmail(emailCheck);
  },[email])

  useEffect(() => {
    let result = PWD_REGEX.test(pwd);
    setValidPwd(result);
  },[pwd])


  const handleSubmit = async(e) => {
    e.preventDefault()
    let createdUser = await signInWithEmail(email,pwd);

    let foundUser = doc(db,'users',createdUser.user.uid);
    getDoc(foundUser).then((res) => {

      dispatch({
        type:'LogIn',
        userToken:createdUser.user.accessToken,
        user:createdUser,
        userEmail:res.data().email,
        userName:res.data().user,
        userImg:res.data().img,
        userId:createdUser.user.uid,
        userCreatedAt:createdUser.user.metadata.creationTime,
      })
      setSuccess(true);
    }).catch(err => {
      console.log(err.message)
      setErrMsg(err.message);
    })
  }

  function SignWithGoogle(){
    signInWithGoogle().then(res => {
      console.log(res.user)
      getDoc(doc(db,'users',res.user.uid)).then(res2 => {
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
      }).catch(err => {
        console.log(err);
      })
      
      dispatch({
        type:'LogIn',
        userToken:res.user.accessToken,
        user:res,
        userEmail:res.user.email,
        userId:res.user.uid,
        userName:res.user.displayName,
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
      console.log(res.user)   
      getDoc(doc(db,'users',res.user.uid)).then(res2 => {
        if(!res2.data()){
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
      }).catch(err => {
        console.log(err);
        setErrMsg(err.message)
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
        You are successfully Logged in !!!!! 
      </div>
      <div className="user_info">
        <img src={state.userImg ? state.userImg : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="avatar"  className='avatar'/>

        <div className="miniData">
          <span className='header'>Name:</span> <span className='value'>{state.userName}</span><br />
          <span className="header">Email:</span> <span className="value">{state.userEmail}</span><br />
          <span className="header">CreatedAt:</span> <span className="value">{state.userCreatedAt}</span><br />
        </div>
      </div>
      <button onClick={() => navigate('/')}>Finish</button>
    </div>
    <div className={errMsg ? 'error' : 'hide'}>
        <div className="text">{errMsg}</div>
    </div>
    <div className='login'>
      <div className="properties">
        <div className="left">
          <h2>Log in to Ecommerce</h2>
          <div className="img">
            <img src="https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/output-onlinepngtools-min.webp?alt=media&token=2a855f81-e9c4-46e7-abb2-c457a028278b"
             alt="login" 
             className='login_png'
             />
          </div>
        </div>
        <div className="right">
          <form onSubmit={handleSubmit} className="inputs_group">
            <label htmlFor="email" className='email_label'>
              Email:
              <span className={validEmail ? 'valid' : 'hide'}>
                <DoneOutlinedIcon/>
              </span>
              <span className={validEmail || !email ? 'hide' : 'invalid'}>
                <CloseOutlinedIcon />
              </span>
            </label>
            <div className="email">
              <div className="input">
                <MailLockOutlinedIcon className='icon'/>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  ref={emailRef}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='off'
                  required
                  aria-invalid={validEmail ? false : true}
                  aria-describedby='uidnote'
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </div>
              <p id="uidnote" className={emailFocus && !validEmail ? 'instructions' : 'offscreen'}>
               <PriorityHighOutlinedIcon className='icon' />
                @ symbol is required.<br />
                Letters, numbers, underscores, hypens allowed
              </p>
            </div>
            <label htmlFor="password" className='password_label'>
              Password:
              <span className={validPwd ? 'valid' : 'hide'}>
                <DoneOutlinedIcon/>
              </span>
              <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
                <CloseOutlinedIcon/>
              </span>
            </label>
            <div className='password'>
              <div className="input">
                <LockOpenOutlinedIcon className='icon'/>
                <input 
                  type={show ? 'text' : "password"} 
                  name="password" 
                  id="password" 
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validPwd ? 'false' : 'true'}
                  aria-describedby= 'pwdnote'
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
            <button type='submit' className='submit'>Submit</button>
          </form>
          <div className="break"><span className="line" ></span>OR<span className="line" ></span></div>
          <div className="otherOptions">
            <button className='Google' onClick={SignWithGoogle}><GoogleIcon className='icon'/> Register with Google</button>
            <button className='Git Hub' onClick={SignWithGithub}><GitHubIcon className='icon' /> Register with Git Hub</button>
          </div>
          <span className='sign_up'>If you haven't created an account, go to <Link to={'/signup'} className='link'>Sign up page</Link> </span>
        </div>
      </div>
    </div>
    </>)
}

export default Login


// https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/output-onlinepngtools-min.webp?alt=media&token=2a855f81-e9c4-46e7-abb2-c457a028278b