import React from 'react';
import { render } from 'react-dom';
import MainPage from './components/Clipboard';

import './index.styl';

const App = () => (
  <div style={{ height: '100%' }}>
    <MainPage />
  </div>
);

render(<App />, document.getElementById('app'));
