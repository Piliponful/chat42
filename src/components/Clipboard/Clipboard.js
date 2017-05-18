import React, { Component } from 'react';
import io from 'socket.io-client';
import CopyToClipboard from 'react-copy-to-clipboard';

import styles from './Clipboard.styl';

export default class Clipboard extends Component {
  constructor() {
    super();
    this.state = {
      link: '',
      copied: false,
      flashMessage: null,
    };
    this.socket = io.connect('http://localhost:3000', {
      query: window.location.search.slice(1),
    });
    this.socket.on('room', roomId => this.setState({
      ...this.state,
      link: `${window.location}?roomId=${roomId}`,
    }));
    this.socket.on('join', () => this.setState('Your friend is here, everything great!'));
    this.socket.on('full', () => this.setState({
      ...this.state,
      flashMessage: 'No one needs you here... This is a cruel world, what was you expect?',
    }));
  }
  render() {
    return (
      <div className={styles.btnWrapper}>
        <CopyToClipboard
          text={this.state.link}
          onCopy={() => this.setState({ ...this.state, copied: true })}
        >
          <button className={styles.btn}>Copy link</button>
        </CopyToClipboard>
      </div>
    );
  }
}
