import React from 'react';
import { render } from 'react-dom';
import MainPage from './components/MainPage';

const App = () => (
  <div>
    <MainPage />
  </div>
);

render(<App />, document.getElementById('app'));
