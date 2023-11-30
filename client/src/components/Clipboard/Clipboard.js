import React, { Component } from 'react'
import io from 'socket.io-client'
import CopyToClipboard from 'react-copy-to-clipboard'
import classNames from 'classnames'
import queryString from 'query-string'

import Chat from '../Chat'

import styles from './Clipboard.styl'

export default class App extends Component {
  constructor () {
    super()
    this.copyHandler = this.copyHandler.bind(this)
    this.closeFlashMessage = this.closeFlashMessage.bind(this)
    this.addFlashMessage = this.addFlashMessage.bind(this)
    this.state = {
      join: false,
      link: '',
      copied: false,
      flashMessage: null,
      flashMessageType: null,
      flashMessageVisible: false,
      roomId: queryString.parse(location.search).roomId
    }
    this.socket = io.connect(process.env.HOST, {
      query: { roomId: this.state.roomId ? this.state.roomId : '' }
    })
    this.socket.on('room', roomId => this.setState({
      ...this.state,
      link: `${window.location}?roomId=${roomId}`
    }))
    this.socket.on('join', () => {
      this.addFlashMessage('success', 'Your friend is here, everything great!')
      this.setState({ ...this.state, join: true })
    })
    this.socket.on('tryAnotherRoom', msg => {
      this.addFlashMessage(
        'failure',
        msg
      )
      this.setState({
        ...this.state,
        roomId: null
      })
      history.pushState({}, 'new room', '/')
    })
  }

  componentWillUnmount () {
    if (this.flashMessageTimer) {
      clearTimeout(this.flashMessageTimer)
    }
  }

  closeFlashMessage () {
    clearTimeout(this.flashMessageTimer)
    this.setState({
      ...this.state,
      flashMessageVisible: false
    })
  }

  copyHandler () {
    this.setState({
      ...this.state,
      copied: true
    })
    this.addFlashMessage(
      'success',
      'Copied! Now Give it to your friend and wait for him to enter.'
    )
  }

  addFlashMessage (type, text) {
    this.closeFlashMessage()
    this.setState({
      ...this.state,
      flashMessage: text,
      flashMessageType: type,
      flashMessageVisible: true
    })
    this.flashMessageTimer = setTimeout(this.closeFlashMessage, 5000)
  }

  render () {
    return (
      <div className={styles.btnWrapper}>
        <div
          style={{ opacity: this.state.flashMessageVisible ? 1 : 0 }}
          className={
            classNames(styles.flashMessage, {
              [styles.flashMessageSuccess]: this.state.flashMessageType === 'success',
              [styles.flashMessageFailure]: this.state.flashMessageType === 'failure'
            })
          }
        >
          <i
            role='button'
            className={`material-icons ${styles.materialIcons}`}
            onClick={this.closeFlashMessage}
          >
            close
          </i>
          {this.state.flashMessage}
        </div>
        {
          (this.state.join || this.state.roomId)
            ? <Chat socket={this.socket} />
            : <Clipboard link={this.state.link} copyHandler={this.copyHandler} />
        }
      </div>
    )
  }
}

const Clipboard = ({ link, copyHandler }) => (
  <CopyToClipboard
    text={link}
    onCopy={copyHandler}
  >
    <button className={styles.btn}>Copy link</button>
  </CopyToClipboard>
)
