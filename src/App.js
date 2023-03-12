import Navbar from "./component/layout/Navbar";
import Banner from "./component/layout/Banner";
import Footer from "./component/layout/Footer";
import Main from "./component/page/Main/Main";
import Signin from "./component/page/Sign/Signin";
import Navbar2 from "./component/layout/Navbar2";
import Signup from "./component/page/Sign/Signup";
import StudyMain from "./component/page/Study/StudyMain";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import StudyCreate from "./component/page/Study/StudyCreate";
import StudyDetail from "./component/page/Study/StudyDetail";
import ErrorPage from "./component/page/Main/Error";
import StudyLayout from "./component/outlet/StudyOutlet";
import axios from "axios";
// import MuiFileUploader from "./component/page/Sign/upload";
import StudyList from "./component/page/Study/StudyList";
import StudySearch from "./component/page/Study/StudySearch";
import Board from "./component/common/study/studyroom/Board"
import Settings from "./component/common/study/studyroom/Settings"
import Todo from "./component/common/study/studyroom/Todo"
import Home from "./component/common/study/studyroom/Home"

function App() {

  axios.defaults.withCredentials = true;

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Navbar2 />
      <Banner />
      <Routes>
        <Route path="/" exact={true} element={<Main />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/upload" element={<MuiFileUploader />} /> */}
        <Route path="/study" element={<StudyLayout />}>
          <Route index element={<StudyMain />} />
          <Route path="search" element={<StudySearch />} />
          <Route path=':id' element={<StudyDetail />} />
            <Route path=':id/home' element={<Home />} />
            <Route path=':id/todo' element={<Todo />} />
            <Route path=':id/board' element={<Board />} />
            <Route path=':id/settings' element={<Settings />} />
          <Route path="create" element={<StudyCreate />} />
          <Route path="list" element={<StudyList />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />

      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;
