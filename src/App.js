import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './router/Routes';
import { Provider } from 'react-redux';
import store from './redux/store';
import { LastLocationProvider } from 'react-router-last-location';
import { SocketContext, socket } from './SocketContext'
import { CheckboxContext } from './CheckboxContext';



function App() {
  const [checkbox, setCheckboxData] = useState(false)
  return (
    <React.Suspense fallback={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LastLocationProvider>
            <SocketContext.Provider value={{ socket }}>
              <CheckboxContext.Provider value={{
                checkbox,
                setCheckboxData
              }}>
                <Routes />
              </CheckboxContext.Provider>
            </SocketContext.Provider>
          </LastLocationProvider>
        </BrowserRouter>
      </Provider>
    </React.Suspense>
  );
}

export default App;
