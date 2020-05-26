import React, { useRef } from 'react'
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import LoginForm from '../../components/Account/LoginForm'
import FacebookLogin from '../../components/Account/FacebookLogin'

export default function Login () {
	const toastRef = useRef()
	return (
		<ScrollView>
			<Image source={require('../../../assets/img/logo-5.png')} resizeMode="contain" style={styles.logo} />
			<View style={styles.viewContainer}>
				<LoginForm toastRef={toastRef} />
				<CreateAccount />
			</View>
			<Divider style={styles.divider} />
			<View style={styles.viewContainer}>
				<FacebookLogin />
			</View>
			<Toast ref={toastRef} position="center" opacity={0.9} />
		</ScrollView>
	)
}

function CreateAccount () {
	const navigation = useNavigation()
	return (
		<Text style={styles.textRegister}>
			¿Aún no tienes cuenta?
			<Text style={styles.btnRgister} onPress={() => navigation.navigate('register')}>
				Registrate
			</Text>
		</Text>
	)
}

const styles = StyleSheet.create({
	logo: {
		width: '100%',
		height: 150,
		marginTop: 20
	},
	viewContainer: {
		marginRight: 40,
		marginLeft: 40
	},
	textRegister: {
		marginTop: 15,
		marginLeft: 50
	},
	btnRgister: {
		color: '#00a680',
		fontWeight: 'bold'
	},
	divider: {
		backgroundColor: '#00a680',
		margin: 10
	}
})
