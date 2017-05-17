import React, { Component } from 'react';
import io from 'socket.io-client';

export default class MainPage extends Component {
  constructor() {
    super();
    this.socket = io.connect('http://localhost:3000', {
      query: window.location.search.slice(1),
    });
    this.socket.on('room', roomId => console.log(roomId));
  }
  render() {
    return (
      <div>Hello from MainPage</div>
    );
  }
}
