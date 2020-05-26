import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase'
import { validateEmail } from '../../utils/validations'
import { reauthenticate } from '../../utils/api'

export default function ChangeEmailForm (props) {
	const { email, setShowModal, toastRef, setReloadUserInfo } = props
	const [ formData, setFormData ] = useState(defaultValue())
	const [ showPassword, setShowPassword ] = useState(false)
	const [ error, setError ] = useState({})
	const [ isLoading, setIsLoading ] = useState(false)

	const onChange = (e, type) => {
		setFormData({ ...formData, [type]: e.nativeEvent.text })
	}
	const onSubmit = () => {
		setError({})
		if (!formData.email || email === formData.email) {
			setError({
				email: 'El email no ha cambiado'
			})
		} else if (!validateEmail(formData.email)) {
			setError({
				email: 'El email es incorrecto'
			})
		} else if (!formData.password) {
			setError({
				password: 'El password no puede estar vacio'
			})
		} else {
			setIsLoading(true)
			reauthenticate(formData.password)
				.then(() => {
					firebase
						.auth()
						.currentUser.updateEmail(formData.email)
						.then(() => {
							setIsLoading(false)
							setReloadUserInfo(true)
							toastRef.current.show('Email actualizado correctamente')
							setShowModal(false)
						})
						.catch((error) => {
							console.log(error)

							setError({ email: 'Error al actualizar el email' })
							setIsLoading(false)
						})
				})
				.catch(() => {
					setIsLoading(false)
					setError({
						password: 'la contraseña no es valida'
					})
				})
		}
	}

	return (
		<View style={styles.view}>
			<Input
				containerStyle={styles.input}
				placeholder="Correo Electronico"
				defaultValue={email || ''}
				onChange={(e) => onChange(e, 'email')}
				errorMessage={error.email}
				rightIcon={{
					type: 'material-community',
					name: 'at',
					color: '#c2c2c2'
				}}
			/>
			<Input
				placeholder="Contraseña"
				containerStyle={styles.input}
				password={true}
				secureTextEntry={showPassword ? false : true}
				onChange={(e) => onChange(e, 'password')}
				errorMessage={error.password}
				rightIcon={{
					type: 'material-community',
					name: showPassword ? 'eye-off-outline' : 'eye-outline',
					color: '#c2c2c2',
					onPress: () => setShowPassword(!showPassword)
				}}
			/>
			<Button
				title="Cambiar Email"
				containerStyle={styles.btnContainer}
				buttonStyle={styles.btn}
				onPress={onSubmit}
				loading={isLoading}
			/>
		</View>
	)
}

function defaultValue () {
	return {
		email: '',
		password: ''
	}
}

const styles = StyleSheet.create({
	view: {
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10
	},
	input: {
		marginBottom: 10
	},
	btnContainer: {
		marginTop: 20,
		width: '95%'
	},
	btn: {
		backgroundColor: '#00a680'
	}
})
