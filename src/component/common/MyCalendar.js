import React from 'react';
import './MyCalendar.css'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MyCalendar = (prop) => {

  return (
    <div>
      {<FullCalendar 
        // defaultView="dayGridMonth" 
        plugins={[ dayGridPlugin, bootstrap5Plugin]}
        events={prop.prop}
        themeSystem= 'bootstrap5'
        height= '600px'
      />}
    </div>
  );
}
export default MyCalendar;

