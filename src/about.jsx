import { createRoot } from 'react-dom/client'
import './App.css'
import Header from './Header';

createRoot(document.getElementById('root')).render(
  <>
	<Header scanButton={false}/>
  </>,
);