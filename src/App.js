import Navbar from "./component/layout/Navbar";
import Banner from "./component/layout/Banner";
import Footer from "./component/layout/Footer";
import Main from "./component/page/Main/Main";
import Signin from "./component/page/Sign/Signin";
import Navbar2 from "./component/layout/Navbar2";
import Signup from "./component/page/Sign/Signup";
import StudyList from "./component/page/Study/StudyList";

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import StudyCreate from "./component/page/Study/StudyCreate";

function App() {
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
        <Route path="/study" element={<StudyList />} />
        <Route path="/study/create" element={<StudyCreate />} />
      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;
