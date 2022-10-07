import React,{useEffect,useState} from 'react'
import styled from 'styled-components';
function Time() {
    let date = new Date();
    let [time, setTime] = useState({hour:date.getHours(),minute: date.getMinutes(),second:date.getSeconds()});
    useEffect(() => {
       let setting = setInterval(() => {
            let date = new Date();
            setTime({hour:date.getHours(),minute: date.getMinutes(),second:date.getSeconds()});
            },1000);

        return () => {
            clearInterval(setting);
        }
    },[])
  return (
    <Item maxWidth="100%" className="carusel_card special">
            <p className="b_name">Super Flash Sale 50% Off</p>
            <img src="./assets/mobile.jpg" alt="wallet" className="img time_img" />
            <span className="tog">
              <span className="s hour">{time.hour}</span>
              <span className="dot_wrap">
              <span className="dot"></span>
              <span className="dot"></span>
              </span>
              <span className="s minute">{time.minute}</span>
              <span className="dot_wrap">
              <span className="dot"></span>
              <span className="dot"></span>
              </span>
              <span className="s second">{time.second}</span>
            </span>
    </Item>
  )
}

const Item = styled.div`
  position:relative;
`

export default Time