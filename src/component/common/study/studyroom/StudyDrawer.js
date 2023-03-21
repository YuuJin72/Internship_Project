import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSelector, useDispatch } from "react-redux";
import { studyNavState } from "../../../../store/studyNav";
import { Container } from "@mui/material";

function LinkTab(props) {
  const navnumber = useSelector((state) => state.studynavnumber.value);
  const dispatch = useDispatch();

  return (
    <Tab
      component="a"
      onClick={(e) => {
        e.preventDefault();
        dispatch(studyNavState(e.target.id));
      }}
      {...props}
    />
  );
}

export default function NavTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bgcolor">
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "white.main",
            borderBottom: 2,
            borderColor: "#AAAAAA",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            TabIndicatorProps={{ style: { background: "blue" } }}
          >
            <LinkTab label="Home" id="1" />
            <LinkTab label="Todo" id="2" />
            <LinkTab label="Board" id="3" />
            <LinkTab label="Settings" id="4" />
          </Tabs>
        </Box>
      </Container>
    </div>
  );
}
