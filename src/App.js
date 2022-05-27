import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Subreddit Game</h1>
      <header />
      {if (currentGame == 1){
        <Game1 />
        <Game 2/>
      }}
    </div>
  );
}

export default App;
