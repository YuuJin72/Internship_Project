import PwCheck from "../../common/study/mypage/PwCheck";
import PwChange from "../../common/study/mypage/PwChange";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../modal/Modal";
import axios from "axios";

const MyPageChangePw = () => {
  const [isCorrect, SetIsCorrect] = useState(false);

  const navigate = useNavigate();
  const { Failure } = Modal();

  const getIsCorrect = (isCorrect) => {
    SetIsCorrect(isCorrect);
  };

  const islogin = () => {
    axios.get("http://localhost:8080/islogin").then((res) => {
      if (res.data.message === "fail") {
        Failure("잘못된 접근입니다.");
        navigate("/signin");
      }
    });
  };

  useEffect(() => {
    islogin();
  }, [isCorrect]);

  return (
    <>
      {!isCorrect && (
        <PwCheck isCorrect={isCorrect} getIsCorrect={getIsCorrect} />
      )}
      {isCorrect && <PwChange />}
    </>
  );
};

export default MyPageChangePw;
