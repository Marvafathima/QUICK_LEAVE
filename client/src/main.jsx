import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react";
import { store } from './app/store.jsx';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <ThemeProvider>
    <App />
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
