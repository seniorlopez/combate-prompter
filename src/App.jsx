import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Prompter from './components/Prompter';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-combate-dark text-slate-200">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/host" element={<Prompter role="host" />} />
          <Route path="/cohost" element={<Prompter role="cohost" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
