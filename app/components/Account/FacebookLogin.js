import React from 'react'
import { SocialIcon } from 'react-native-elements'

export default function FacebookLogin () {
	const login = () => {
		console.log('Login...')
	}

	return <SocialIcon title="Iniciar Sesion con Facebook" button type="facebook" onPress={login} />
}
