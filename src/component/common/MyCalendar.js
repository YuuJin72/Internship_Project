import React from 'react';
import './MyCalendar.css'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

const MyCalendar = () => {
    const onclick = (e) => {
        console.log(e)
    }
        return (
          <div>
            <FullCalendar 
              // defaultView="dayGridMonth" 
              plugins={[ dayGridPlugin, bootstrap5Plugin]}
              events={[
                { title: 'event 6', start: '2023-03-09', end: '2023-03-13', color: 'red'},
                { title: 'event 2', date: '2023-03-09' }
            ]}
              themeSystem= 'bootstrap5'
            />
          </div>
        );
}
export default MyCalendar;

