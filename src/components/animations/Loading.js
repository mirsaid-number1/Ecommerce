import React from 'react'
import './animation.scss';
import icon from '../../images/Icon.png'
function Loading() {
  return (
    <div className='entrance_loading'>
      <div className='items'>
        <img src={icon} alt='logo' className='loading_logo' />
        <span className='ecommerce_text'>Ecommerce</span>
      </div>
    </div>
  )
}

export default Loading