import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// map
import './utils/mapboxgl';
import 'mapbox-gl/dist/mapbox-gl.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

// components
import { SettingsProvider } from './components/settings';

import { AuthProvider } from './auth/JwtContext';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <AuthProvider>
      <HelmetProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SettingsProvider>
            <BrowserRouter>
              <App />
              <ToastContainer />
            </BrowserRouter>
          </SettingsProvider>
        </LocalizationProvider>
      </HelmetProvider>
    </AuthProvider>
  </>
);

serviceWorkerRegistration.unregister();
reportWebVitals();
