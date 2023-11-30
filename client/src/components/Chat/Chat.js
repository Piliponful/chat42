import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './Chat.styl'

export default class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      messages: []
    }
    props.socket.on('message', text => this.setState({
      ...this.state,
      messages: [
        ...this.state.messages,
        { text, mine: false }
      ]
    }))
    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage () {
    const text = this.state.value
    this.props.socket.emit('message', text)
    this.setState({
      ...this.state,
      value: '',
      messages: [
        ...this.state.messages,
        { text, mine: true }
      ]
    })
  }

  render () {
    return (
      <div className={styles.chat}>
        <div className={styles.messageBoard}>
          {
            this.state.messages.map(msg =>
              (
                <div
                  className={
                    classNames(
                      styles.message,
                      {
                        [styles.mine]: msg.mine,
                        [styles.notMine]: !msg.mine
                      }
                    )
                  }
                >
                  {msg.text}
                </div>
              )
            )
          }
        </div>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.input}
            value={this.state.value}
            onChange={({ target: { value } }) => this.setState({ value })}
          />
          <button
            className={styles.btn}
            onClick={this.sendMessage}
          >
            Submit
          </button>
        </div>
      </div>
    )
  }
}
