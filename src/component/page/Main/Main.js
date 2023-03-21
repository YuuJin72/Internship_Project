import "./Main.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect, useLayoutEffect } from "react";
import { loginState } from "../../../store/user";

const Main = () => {
  const dispatch = useDispatch();

  const fetchLogin = () => {
    axios.get("http://localhost:8080/islogin").then((res) => {
      if (res.data.message === "fail") {
        dispatch(loginState(false));
      }
    });
  };

  useLayoutEffect(() => {
    fetchLogin();
  }, []);

  return <div className="main"></div>;
};

export default Main;
