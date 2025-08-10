import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import weekday from 'dayjs/plugin/weekday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.locale('fr');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);