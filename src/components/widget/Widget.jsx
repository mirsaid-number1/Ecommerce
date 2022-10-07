import React from 'react'
import './widget.scss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

function Widget({type,amount}) {
    let data;
    const dollar = 193;
    const diff = 25;
    switch(type) {
        case 'user':
            data = {
                title:'USERS',
                isMoney:false,
                link:'see all users',
                icon: <PersonOutlinedIcon  className='icon' style={{
                    color:'rgb(128, 11, 3)',
                    backgroundColor:'rgba(145, 46, 39,0.2)'
                }}/>
            }
        break;
        case 'order':
            data = {
                title:'ORDERS',
                isMoney:false,
                link:'see all orders',
                icon: <ShoppingCartOutlinedIcon  className='icon' style={{
                    color:'#ccae04',
                    backgroundColor:'rgba(240, 250, 105,0.2)'
                }}/>
            }
        break;
        case 'expenditure':
            data = {
                title:'EXPENDITURE',
                isMoney:true,
                link:'see all expenditure',
                icon: <MonetizationOnOutlinedIcon  className='icon' style={{
                    color:'#1ca803',
                    backgroundColor:'rgba(85, 194, 66,0.2)'
                }}/>
            }
        break;
        case 'balance':
            data = {
                title:'BALANCES',
                isMoney:true,
                link:'see all balance',
                icon: <AccountBalanceWalletOutlinedIcon  className='icon' style={{
                    color:'#a00ec4',
                    backgroundColor:'rgba(185, 71, 214, .2)'
                }}/>
            }
        break;
    }
  return (
    <div className='widget'>
        <div className="left">
            <span className='title'>{data.title}</span>
            <span className='counter'>{data.isMoney && '$'} {amount}</span>
            <span className='link'>{data.link}</span>
        </div>
        <div className="right">
            <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
            </div>
            {data.icon}
        </div>
    </div>
  )
}

export default Widget