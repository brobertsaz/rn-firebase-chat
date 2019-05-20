import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firebaseSvc from '../config/firebaseSvc'

export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!'
  })

  state = {
    messages: []
  }

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      avatar: this.props.navigation.state.params.avatar,
      id: firebaseSvc.uid,
      _id: firebaseSvc.uid
    }
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={this.user}
      />
    )
  }

  componentDidMount() {
    console.log('params', this.props.navigation.state.params)
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    )
  }
  componentWillUnmount() {
    firebaseSvc.refOff()
  }
}
