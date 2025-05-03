import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProblemPage from "./Components/Pages/ProblemContainer/ProblemPage"
// import HomePage from "./Components/Pages/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import ContestPage from "./Components/Pages/Contest/ContestPage";
import CodeEditor from './Components/CodeEditor/CodeEditor';
import SolveProblem  from "./Components/SolveProblem/SolveProblem";
import AddProblem from "./Components/Pages/AddProblem/AddProblem";
import ContestProblem from "./Components/Pages/Contest/ContestProblem"
import axios from "axios";


axios.defaults.baseURL = "http://192.168.172.197:5001/api";
// axios.defaults.baseURL = "http://192.168.31.243:5001/api";
// axios.defaults.baseURL = "http://localhost:5001/api";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route exact path="/" element={<HomePage />} /> */}
        <Route path="/problems" element={<ProblemPage />} />
        <Route path="/ide" element={<CodeEditor type="ide"/>}/>
        <Route path="/contest" element={<ContestPage />} />
        <Route path="/solveproblem/:id" element={<SolveProblem/>}/>
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path="/contest-detail" element={<ContestProblem/>} />


      </Routes>
    </Router>
  );
};

export default App;
