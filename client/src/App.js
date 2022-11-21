import logo from './logo.svg';
import React from 'react';
import './App.css';
import Timeline from './Timeline'


// This is a competnent
function App() {
  const [tweets, setTweets] = React.useState(null);
  const [activeTimeline, setActiveTimeline] = React.useState(0);

let num_users = 3;

React.useEffect(() => {
    fetch("/tweets")
      .then((res) => res.json())
      .then(res => {
          setTweets(res)
          console.log(res);
      })
  }, []);


  const handler = (event) => {

    if (event.keyCode == 37){ // left arrow
      // console.log("activeTimeline before ", activeTimeline);
      // if (activeTimeline != 0){
        // setActiveTimeline(activeTimeline - 1);
      // }
      let temp = activeTimeline - 1;
      setActiveTimeline(((temp % num_users) + num_users) % num_users);
    }
    else if (event.keyCode == 39){
      // console.log("activeTimeline before ", activeTimeline);
      // if (activeTimeline != 2){
      let temp = activeTimeline + 1;
        // setActiveTimeline(activeTimeline + 1);
      // }

      setActiveTimeline(((temp % num_users) + num_users) % num_users);
    }
    console.log("activeTimeline after ", activeTimeline);
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => {
        window.removeEventListener("keydown", handler);
    }
  })

  // <p> {tweets['AccountMalcolm'][0].text}</p>
// <p>This is the tweet: {tweets['AccountMalcolm'][2].text}</p>
  if (!tweets) return <div>Loading...</div>;
  console.log();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <code>Non Addictive Twitter</code>
        </p>
        <div className="flex">
          <div className={ activeTimeline == 0 ? 'Timeline ActiveTimeline' : 'Timeline'} >
            <Timeline user_id="1495841608863862786"
            onChange={() => {
              console.log("hello");
              setActiveTimeline(0)
            }}/>
          </div>
          <div className={ activeTimeline == 1 ? 'Timeline ActiveTimeline' : 'Timeline'}>
            <Timeline user_id="44196397"
             onChange={() => setActiveTimeline(1)}/>
          </div>
          <div className={ activeTimeline == 2 ? 'Timeline ActiveTimeline' : 'Timeline'}>
            <Timeline user_id="18989355"
             onChange={() => setActiveTimeline(2)}/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
