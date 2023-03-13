import React from 'react';
import './MyCalendar.css'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MyCalendar = () => {

  const params = useParams()

  const [scheduleList, setScheduleList] = useState([])
  const onclick = (e) => {
      console.log(e)
  }

  const fetchSchedule = () => {
    axios.post(`http://localhost:8080/study/${params.id}/schedule`)
    .then((res) => {
      if(res.data.message === 'success'){
        setScheduleList(res.data.result)
      }
    })
  }
  // { title: 'event 6', start: '2023-03-09', end: '2023-03-13', color: 'red'},
  // { title: 'event 2', date: '2023-03-09' }

  useEffect(() => {
    fetchSchedule()
  },[])

  return (
    <div>
      <FullCalendar 
        // defaultView="dayGridMonth" 
        plugins={[ dayGridPlugin, bootstrap5Plugin]}
        events={[
          scheduleList,
        ]}
        themeSystem= 'bootstrap5'
        
      />
    </div>
  );
}
export default MyCalendar;

