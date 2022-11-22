import logo from './logo.svg';
import React from 'react';
import './Tweet.css';


function Tweet(props){
  // need to hangle mintues and such
  var date = new Date(
    props.date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"));
  let str = ""
  if (Date.now() - date > 86400000){
    str = date.toLocaleDateString()
  }
  else {
    let hours = Math.floor(((Date.now() - date) / (1000 * 60 * 60)))
    str = hours + "h"
  }

  function QuoteTweet(props){
    if (typeof(props.text) == "undefined"){
      return (<div> </div>)
    }
    else {
      return (
        <div  className="QuoteTweet">
          <div className="tweetHeader">
            <span className='username'> {props.user}  &#183;
              <span className='date'>{str}</span>
            </span>
          </div>
          <text>{props.text}  </text>
        </div>
      )
    }
  }
  let temp_user = props.user;
  if (typeof(props.quote) == 'undefined'){
    temp_user = "-1";
  }
  return (
    <div  className={props.active ? "ActiveTweet Tweet" : "Tweet"}>
      <div className="tweetHeader">
        <span className='username'> {props.user}  &#183;
          <span className='date'>{str}</span>
        </span>
      </div>
      <text>{props.text}  </text>
      <QuoteTweet text={props.quote.text} date={props.quote.datetime} user={props.quote.username}/>
    </div>
  )

}



export default Tweet;
