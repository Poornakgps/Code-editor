import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProblemPage from "./Components/Pages/ProblemContainer/ProblemPage"
import HomePage from "./Components/Pages/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import CodeEditor from './Components/CodeEditor/CodeEditor';
import SolveProblem  from "./Components/SolveProblem/SolveProblem";
import AddProblem from "./Components/Pages/AddProblem/AddProblem";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5001/api";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/ide" element={<CodeEditor type="ide"/>}/>
        <Route path="/solveproblem/:id" element={<SolveProblem/>}/>
        <Route path="/add-problem" element={<AddProblem />} />
      </Routes>
    </Router>
  );
};

export default App;