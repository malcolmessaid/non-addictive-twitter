import logo from './logo.svg';
import React from 'react';
import './Tweet.css';


function Tweet(props){
  // const []
  // console.log(Date(props.datetime).toDateString());
  console.log("props ", props.date);
  // let date = Date(props.date);
  var date = new Date(
    props.date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,
        "$1 $2 $4 $3 UTC"));
  console.log("date", date)

  let str = date.toLocaleString()

  if (Date.now() - date > 86400000){
    str = date.toLocaleDateString()
  }
  else {
    let secs = Date.now() - date;
    let hours = Math.floor((secs / (1000 * 60 * 60)))
    console.log(hours);
    str = hours + "h"
  }
  return (
    <div  className={props.active ? "ActiveTweet Tweet" : "Tweet"}>
      <div className="tweetHeader">
        <span className='username'> {props.user}  &#183;
          <span className='date'>{str}</span>
        </span>
      </div>
      <text >{props.text}  </text>
    </div>
  )

}


export default Tweet;
