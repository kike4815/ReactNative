import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'
import { map } from 'lodash'
import Modal from '../Modal'
import ChangeDisplayForm from '../../components/Account/ChangeDisplayForm'
import ChangeEmailForm from '../../components/Account/ChangeEmailForm'
import ChangePasswordForm from '../../components/Account/ChangePasswordForm'

export default function AccountOptions (props) {
	const { userInfo, toastRef, setReloadUserInfo } = props
	const [ showModal, setShowModal ] = useState(false)
	const [ renderComponent, setRenderComponent ] = useState(null)

	const selectComponent = (key) => {
		switch (key) {
			case 'displayName':
				setRenderComponent(
					<ChangeDisplayForm
						displayName={userInfo.displayName}
						setShowModal={setShowModal}
						toastRef={toastRef}
						setReloadUserInfo={setReloadUserInfo}
					/>
				)
				setShowModal(true)
				break
			case 'email':
				setRenderComponent(
					<ChangeEmailForm
						email={userInfo.email}
						setShowModal={setShowModal}
						toastRef={toastRef}
						setReloadUserInfo={setReloadUserInfo}
					/>
				)
				setShowModal(true)
				break
			case 'password':
				setRenderComponent(<ChangePasswordForm setShowModal={setShowModal} toastRef={toastRef} />)
				setShowModal(true)
				break
			default:
				setRenderComponent(null)
				setRenderComponent(false)
				break
		}
	}
	const menuOptions = generateOptions(selectComponent)

	return (
		<View>
			{map(menuOptions, (menu, index) => (
				<ListItem
					key={index}
					title={menu.title}
					leftIcon={{
						type: menu.iconType,
						name: menu.iconNameLeft,
						color: menu.iconColorLeft
					}}
					rightIcon={{
						type: menu.iconType,
						name: menu.iconNameRight,
						color: menu.iconColorRight
					}}
					containerStyle={styles.menuItem}
					onPress={menu.onPress}
				/>
			))}
			{renderComponent && (
				<Modal isVisible={showModal} setIsVisible={setShowModal}>
					{renderComponent}
				</Modal>
			)}
		</View>
	)
}
function generateOptions (selectComponent) {
	return [
		{
			title: 'Cambiar Nombre y Apellidos',
			iconType: 'material-community',
			iconNameLeft: 'account-circle',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectComponent('displayName')
		},
		{
			title: 'Cambiar Email',
			iconType: 'material-community',
			iconNameLeft: 'at',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectComponent('email')
		},
		{
			title: 'Cambiar Password',
			iconType: 'material-community',
			iconNameLeft: 'lock-reset',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectComponent('password')
		}
	]
}

const styles = StyleSheet.create({
	menuItem: {
		borderBottomWidth: 1,
		borderBottomColor: '#e3e3e3'
	}
})
