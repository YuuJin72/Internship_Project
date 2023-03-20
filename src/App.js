import {BrowserRouter, Route, Routes} from 'react-router-dom'
import axios from "axios";
import './App.css'
import Banner from "./component/layout/Banner";
import Footer from "./component/layout/Footer";
import Main from "./component/page/Main/Main";
import Signin from "./component/page/Sign/Signin";
import Navbar2 from "./component/layout/Navbar2";
import Signup from "./component/page/Sign/Signup";
import StudyMain from "./component/page/Study/StudyMain";
import StudyCreate from "./component/page/Study/StudyCreate";
import StudyDetail from "./component/page/Study/StudyDetail";
import ErrorPage from "./component/page/Main/Error";
import StudyLayout from "./component/outlet/StudyOutlet";
import StudyList from "./component/page/Study/StudyList";
import StudySearch from "./component/page/Study/StudySearch";
import MyPageLayout from './component/outlet/MyPageOutlet'
import MyPageInfo from "./component/page/Mypage/MyPageInfo";
import MyPageStudy from "./component/page/Mypage/MyPageStudy";
import MyPageChangePw from "./component/page/Mypage/MyPageChangePw";
import { createTheme, ThemeProvider } from '@mui/material';

function App() {

  axios.defaults.withCredentials = true;

  const theme = createTheme({
    typography: {
      fontFamily: 'OAGothic-Medium'
    },
    palette: {
      primary: {
        main: '#22365E',
        contrastText: '#fff',
      },
      blue: {
        main: '#1971c2',
        light: '#a5d8ff',
        dark: '#22365E',
        contrastText: '#fff',
      },
      darkblue: {
        main: '#22365E',
        contrastText: '#fff',
      },
      red: {
        main: '#f03e3e',
        contrastText: '#fff',
      },
      lightgray: {
        main: '#EBEBEB'
      },
      white: {
        main: '#FFFFFF'
      },
      green: {
        main: '#66FF33',
        contrastText: '#000'
      }
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar2 />
        <Banner />
        <Routes>
          <Route path="/" exact={true} element={<Main />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/study" element={<StudyLayout />}>
            <Route index element={<StudyMain />} />
            <Route path="search" element={<StudySearch />} />
            <Route path=':id' element={<StudyDetail />} />
            <Route path="create" element={<StudyCreate />} />
            <Route path="list" element={<StudyList />} />
          </Route>
          <Route path="/mypage" element={<MyPageLayout />}>
            <Route index element={<MyPageInfo />} />
            <Route path='mystudy' element={<MyPageStudy />} />
            <Route path='changepw' element={<MyPageChangePw />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
