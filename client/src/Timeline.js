import logo from './logo.svg';
import React from 'react';
import './App.css';
import Tweet from './Tweet'



function Timeline(props){
  console.log(props);
  const [tweets, setTweets] = React.useState(null);
  // const [index, setIndex] = React.useState(0);
  // const [active, setActive] = React.useState(false);
    React.useEffect(() => {
        fetch(`/usertweets/?count=10&userid=${props.user_id}`)
          .then((res) => res.json())
          .then(res => {
              setTweets(res)
              console.log(res);
          })

      }, []);


    const handler = (event) => {
      // if (!this.active){
      //   return
      // }
      if (event.keyCode == 38){ // up arrow
        console.log(event);
      }
      else if (event.keyCode == 40){
        console.log(event);
      }
    }
    React.useEffect(() => {
      window.addEventListener('keydown', handler);
      return () => {
          window.removeEventListener("keydown", handler);
      }
    })

    if (!tweets) return <div>Loading...</div>;
    let temp = []
    for (var i = 0; i < tweets.length; i++) {
      let abc = tweets[i].text;
      temp.push(
        <div className='flex-column' onClick={props.onChange}>
            <Tweet text={abc} user={tweets[i].username}/>
          </div>
      )
    }
    return temp
}

export default Timeline;
