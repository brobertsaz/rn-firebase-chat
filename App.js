import { createStackNavigator } from 'react-navigation'
import Chat from './components/Chat'
import Login from './components/Login'
import Signup from './components/Signup';

export default createStackNavigator({
  Login: { screen: Login },
  Signup: { screen: Signup },
  Chat: { screen: Chat }
})