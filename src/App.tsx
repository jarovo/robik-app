import logo from './logo.svg';
import './App.css';

//import Login from './components/Login';
import GoogleSignInButton from './components/GoogleSignInButton';
import Calendar from './components/Calendar';

function App() {

  return (
    <div className="App">
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <GoogleSignInButton />
      <Calendar />
    </div>
  );
}

export default App;
