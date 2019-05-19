import firebase from 'firebase'

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyAOzb98EPkixCU8_6eROawWV-X_jcl3Kzc",
        authDomain: "rn-firebase-chat-f2baf.firebaseapp.com",
        databaseURL: "https://rn-firebase-chat-f2baf.firebaseio.com",
        projectId: "rn-firebase-chat-f2baf",
        storageBucket: "rn-firebase-chat-f2baf.appspot.com",
        messagingSenderId: "1005141741974",
        appId: "1:1005141741974:web:6ff3ebae2ba37406"
      })
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback)
  }

  createAccount = async user => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        function () {
          console.log(
            'created user successfully. User email:' +
            user.email +
            ' name:' +
            user.name
          )
          var userf = firebase.auth().currentUser
          userf.updateProfile({ displayName: user.name }).then(
            function () {
              console.log('Updated displayName successfully. name:' + user.name)
              alert(
                'User ' + user.name + ' was created successfully. Please login.'
              )
            },
            function (error) {
              console.warn('Error update displayName.')
            }
          );
        },
        function (error) {
          console.error('got error:' + typeof error + ' string:' + error.message)
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
      const task = ref.put(blob);

      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {

          },
          reject,
          () => resolve(task.snapshot.downloadURL)
        )
      })
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message)
    }
  }

  updateAvatar = url => {
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url }).then(
        function () {
          console.log('Updated avatar successfully. url:' + url)
          alert('Avatar image is saved successfully.')
        },
        function (error) {
          console.warn('Error update avatar.')
          alert('Error update avatar. Error:' + error.message)
        }
      );
    } else {
      console.log("can't update avatar, user is not login.")
      alert('Unable to update avatar. You must login first.')
    }
  }
}
const firebaseSDK = new FirebaseSDK()
export default firebaseSDK