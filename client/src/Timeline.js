import logo from './logo.svg';
import React from 'react';
import './App.css';
import Tweet from './Tweet'



function Timeline(props){
  const [tweets, setTweets] = React.useState(null);
    React.useEffect(() => {
        fetch(`/usertweets/?count=10&userid=${props.user_id}`)
          .then((res) => res.json())
          .then(res => {
              setTweets(res)
              console.log(res);
          })

      }, []);
      if (!tweets) return <div>Loading...</div>;
    let temp = []
    for (var i = 0; i < tweets.length; i++) {
      let abc = tweets[i].text;
      temp.push(<div className='flex-column'><Tweet text={abc} user={tweets[i].username}/> </div>)
      // temp.push(<div>{tweets[i].text}</div>)
    }
    return temp
}

export default Timeline;
