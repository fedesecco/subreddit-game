import './App.css';

let currentGame = 1;

function App() {
  return (
    <div className="App">
      <h1>Subreddit Game</h1>
      <header />
      {if (currentGame == 1){
        return <Game1 />
      }
      else if (currentGame ==2){
        return <Game2 />
      }}
    </div>
  );
}

export default App;
