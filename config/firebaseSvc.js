import firebase from 'firebase'
import uuid from 'uuid'

const config = {
  apiKey: 'AIzaSyAOzb98EPkixCU8_6eROawWV-X_jcl3Kzc',
  authDomain: 'rn-firebase-chat-f2baf.firebaseapp.com',
  databaseURL: 'https://rn-firebase-chat-f2baf.firebaseio.com',
  projectId: 'rn-firebase-chat-f2baf',
  storageBucket: 'rn-firebase-chat-f2baf.appspot.com',
  messagingSenderId: '1005141741974',
  appId: '1:1005141741974:web:6ff3ebae2ba37406'
}

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    } else {
      console.log('firebase apps already running...')
    }
  }

  login = async (user, success_callback, failed_callback) => {
    console.log('logging in')
    const output = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback)
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged)

  onAuthStateChanged = user => {
    if (user) {
      this.setState({ loggedIn: true })
    } else {
      this.setState({ loggedIn: false })
    }
  }

  createAccount = async user => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function() {
          var userf = firebase.auth().currentUser
          userf.updateProfile({ displayName: user.name }).then(
            function() {
              console.log('Updated displayName successfully. name:' + user.name)
              alert(
                'User ' + user.name + ' was created successfully. Please login.'
              )
            },
            function(error) {
              console.warn('Error update displayName.')
            }
          )
        },
        function(error) {
          console.error(
            'got error:' + typeof error + ' string:' + error.message
          )
          alert('Create account failed. Error: ' + error.message)
        }
      )
  }

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri)
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4())
      const task = ref.put(blob)

      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
            console.log('inside the upload image promise')
          },
          reject => console.log('rejected', reject),
          () =>
            console.log('task.snapshot.downloadURL', task.snapshot.downloadURL)
        )
      })
    } catch (err) {
      console.log('err: ', err)
      console.log('uploadImage try/catch error: ' + err.message) //Cannot load an empty url
    }
  }

  updateAvatar = url => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser
    if (userf != null) {
      userf.updateProfile({ avatar: url }).then(
        function() {
          console.log('Updated avatar successfully. url:' + url)
          alert('Avatar image is saved successfully.')
        },
        function(error) {
          console.warn('Error update avatar.')
          alert('Error update avatar. Error:' + error.message)
        }
      )
    } else {
      console.log("can't update avatar, user is not login.")
      alert('Unable to update avatar. You must login first.')
    }
  }

  onLogout = user => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('Sign-out successful.')
      })
      .catch(function(error) {
        console.log('An error happened when signing out')
      })
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid
  }

  get ref() {
    return firebase.database().ref('Messages')
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val()
    const { key: id } = snapshot
    const { key: _id } = snapshot //needed for giftedchat
    const timestamp = new Date(numberStamp)

    const message = {
      id,
      _id,
      timestamp,
      text,
      user
    }
    return message
  }

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)))
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i]
      const message = {
        text,
        user,
        createdAt: this.timestamp
      }
      this.ref.push(message)
    }
  }

  refOff() {
    this.ref.off()
  }
}

const firebaseSvc = new FirebaseSvc()
export default firebaseSvc
