import "./App.css";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Code from "./pages/Code";
import SignIn from "./pages/Auth";
import "react-loading-skeleton/dist/skeleton.css";
import QuestionList from "./pages/QuestionList";
import AddQuestion from "./pages/AddQuestion";
import ProfilePage from "./pages/Profile";
import SubmissionView from "./pages/SubmissionView";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/sign" element={<SignIn></SignIn>} />
        <Route path="/questionlist" element={<QuestionList></QuestionList>} />
        <Route path="/add_question" element={<AddQuestion></AddQuestion>} />
        <Route path="/profile" element={<ProfilePage></ProfilePage>} />
        <Route path="/ques/:quesName" element={<Code></Code>} />
        <Route path="/submission/view/:id" element={<SubmissionView></SubmissionView>} />
        <Route path="/" element={<Home></Home>} />
      </Routes>
    </div>
  );
}

export default App;
