import React from "react";
import { Grid, Typography, Container, Paper } from "@mui/material";
import MyCalendar from "../../MyCalendar";
import TodaysWork from "./TodaysWork";
import { useState } from "react";
import TodoIndivMember from "./TodoIndivMember";
import TodoAllMember from "./TodoAllMember";

const Todo = () => {
  const getFormatDate = (date) => {
    let year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    return year + "-" + month + "-" + day;
  };
  let today = getFormatDate(new Date());

  const [scheduleList, setScheduleList] = useState("");

  const getScheduleList = (scheduleList) => {
    setScheduleList(scheduleList);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        pb: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          mr: 2,
          p: 2,
          height: "100%",
          width: "100%",
        }}
      >
        <Grid
          container
          rowSpacing={2}
          sx={{ m: 4 }}
          textAlign="center"
          display="flex"
        >
          <Grid item xs={6}>
            <TodaysWork />
          </Grid>
          <Grid item xs={6}>
            <TodoAllMember
              getScheduleList={getScheduleList}
              scheduleList={scheduleList}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          mt: 2,
          mr: 2,
          p: 2,
          height: "100%",
          width: "100%",
        }}
      >
        <Grid
          container
          rowSpacing={2}
          sx={{ m: 4 }}
          textAlign="center"
          display="flex"
        >
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Today : {today}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TodoIndivMember />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Todo;
