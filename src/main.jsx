import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import './styles/buttons.css';
import './styles/cards.css';
import './styles/media.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/roadmap.css';
import './styles/booking.css';
import './styles/footer.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
