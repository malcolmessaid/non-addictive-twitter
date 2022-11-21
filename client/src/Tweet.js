import logo from './logo.svg';
import React from 'react';
import './Tweet.css';


function Tweet(props){
  // const []

  return (
    <div className='Tweet'>
    <span className='username'> {props.user + ": "} </span>
      <text className={props.active ? "ActiveTweet" : ""}>{props.text}  </text>
    </div>
  )

}


export default Tweet;
