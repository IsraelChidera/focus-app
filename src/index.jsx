import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import SetupRequired from './page/SetupRequired';
import { store } from './store';
import { missingFirebaseEnv } from './firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {missingFirebaseEnv.length > 0 ? (
      <SetupRequired missing={missingFirebaseEnv} />
    ) : (
      <Provider store={store}>
        <App />
      </Provider>
    )}
  </React.StrictMode>
);
