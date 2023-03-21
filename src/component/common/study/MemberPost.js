import Home from "./studyroom/Home";
import Todo from "./studyroom/Todo";
import Board from "./studyroom/Board";
import Settings from "./studyroom/Settings";
import StudyDrawer from "./studyroom/StudyDrawer";
import { useSelector, useDispatch } from "react-redux";
import { studyNavState } from "../../../store/studyNav";
import { useEffect } from "react";
import Loading from "../Loading";

const MemberPost = () => {
  const navnumber = useSelector((state) => state.studynavnumber.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(studyNavState("1"));
  }, []);

  return (
    <div className="bgcolor">
      <StudyDrawer />
      {navnumber === "1" ? (
        <Home />
      ) : navnumber === "2" ? (
        <Todo />
      ) : navnumber === "3" ? (
        <Board />
      ) : (
        <Settings />
      )}
    </div>
  );
};

export default MemberPost;
