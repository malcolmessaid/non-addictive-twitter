import logo from './logo.svg';
import React from 'react';
import './App.css';
import Timeline from './Timeline'


// This is a competnent
function App() {
  const [tweets, setTweets] = React.useState(null);



React.useEffect(() => {
    fetch("/tweets")
      .then((res) => res.json())
      .then(res => {
          setTweets(res)
          console.log(res);
      })

  }, []);
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
          <div className='Timeline'><Timeline user_id="1495841608863862786"/></div>
          <div className='Timeline'><Timeline user_id="44196397"/></div>
        </div>
      </header>
    </div>
  );
}

export default App;

        // <div className='Timeline'><Timeline user_id="44196397"/></div>
        // <div className='Timeline'><Timeline user_id="18989355"/></div>
