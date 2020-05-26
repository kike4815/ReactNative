import firebase from 'firebase/app'

const firebaseConfig = {
	apiKey: 'AIzaSyDJdTQurdTTvBpfXSOcICCMMeMiBX5gpwE',
	authDomain: 'tenedores-c7430.firebaseapp.com',
	databaseURL: 'https://tenedores-c7430.firebaseio.com',
	projectId: 'tenedores-c7430',
	storageBucket: 'tenedores-c7430.appspot.com',
	messagingSenderId: '751587268316',
	appId: '1:751587268316:web:439454bb5dbad88a99c619'
}
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig)
