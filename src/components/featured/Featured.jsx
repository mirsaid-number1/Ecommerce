import React from 'react'
import './featured.scss'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'

function Featured({expenditure,amount}) {
    return (
      <div className='featured'>
        <div className="top">
          <h1 className="title">Total Expenditure</h1>
          <MoreVertIcon fontSize='small' />
        </div>
        <div className="bottom">
          <div className="featuredChart">
            <CircularProgressbar value={expenditure} text={expenditure + ' %'} strokeWidth={5}/>
          </div>
          <p className="title">Total sales made overall</p>
          <p className="amount">$ {amount}</p>
          <p className="desc">These is pure spending of purchased products.</p>
          <div className="summary">
            <div className="item">
              <div className="itemTitle">Target</div>
              <div className="itemResult negative">
                <KeyboardArrowDownIcon fontSize='small' />
                <div className="resultAmount">$12.3k</div>
              </div>
            </div>
            <div className="item">
              <div className="itemTitle">Last Week</div>
              <div className="itemResult positive">
                <KeyboardArrowUpIcon fontSize='small' />
                <div className="resultAmount">$12.3k</div>
              </div>
            </div>
            <div className="item">
              <div className="itemTitle">Last Month</div>
              <div className="itemResult positive">
                <KeyboardArrowUpIcon fontSize='small' />
                <div className="resultAmount">$12.3k</div>
              </div>
            </div>
          </div>
        </div>
        </div>
    )
  }
  
  export default Featured