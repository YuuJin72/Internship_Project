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

        <Route path="/study" element={<StudyLayout />}>
          {/* <Route path="search" element={<StudySearch />} /> */}
          <Route index element={<StudyMain />} />
          <Route path=':id' element={<StudyDetail />} />
          <Route path="create" element={<StudyCreate />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />

      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;
