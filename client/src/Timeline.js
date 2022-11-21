import logo from './logo.svg';
import React from 'react';
import './App.css';
import Tweet from './Tweet'



function Timeline(props){
  // console.log(props);
  const [tweets, setTweets] = React.useState(null);
  // const [index, setIndex] = React.useState(0);
  const [active, setActive] = React.useState(0);
    React.useEffect(() => {
        fetch(`/usertweets/?count=10&userid=${props.user_id}`)
          .then((res) => res.json())
          .then(res => {
              setTweets(res)
              // console.log(res);
          })

      }, []);


    const toggle = (event) => {
      if (props.activeTimelinePassedDown){
        if (event.keyCode == 38){ // up arrow
          if (active > 0){
              setActive(active -1);
          }
        }
        else if (event.keyCode == 40){
          setActive(active + 1);
        }
      }
    }
    React.useEffect(() => {
      window.addEventListener('keydown', toggle);
      return () => {
          window.removeEventListener("keydown", toggle);
      }
    })

    if (!tweets) return <div>Loading...</div>;
    let temp = []
    for (var i = 0; i < tweets.length; i++) {
      let abc = tweets[i].text;
      temp.push(
        <div className={ active == i ? 'flex-column ActiveTweet' : 'flex-column'} onClick={props.onChange}>
            <Tweet text={abc} user={tweets[i].username} active={active == i && props.activeTimelinePassedDown}/>
          </div>
      )
    }
    return temp
}

export default Timeline;