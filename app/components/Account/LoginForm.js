import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Input, Icon } from 'react-native-elements'
import { isEmpty } from 'lodash'
import { validateEmail } from '../../utils/validations'
import * as firebase from 'firebase'
import { useNavigation } from '@react-navigation/native'
import Loading from '../Loading'

export default function LoginForm (props) {
    const { toastRef } = props
    const [ showPassword, setShowPassword ] = useState(false)
    const [ formData, setFormData ] = useState(defaultFormValue())
    const [ loading, setLoading ] = useState(false)
    const navigation = useNavigation()

    firebase.auth().onAuthStateChanged((user) => {
        user && navigation.navigate('account')
    })

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
            toastRef.current.show('todos los campos son obligatorios')
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('el email no es correcto')
        } else {
            setLoading(true)
            firebase
                .auth()
                .signInWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false)
                    navigation.goBack()
                })
                .catch(() => {
                    setLoading(false)
                    toastRef.current.show('el email o contraseña no es correcto')
                })
        }
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, 'email')}
                rightIcon={<Icon type="material-community" name="at" iconStyle={styles.iconRight} />}
            />
            <Input
                placeholder="Password"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, 'password')}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Iniciar Sesion"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando sesion" />
        </View>
    )
}
function defaultFormValue () {
    return {
        email: '',
        password: ''
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    inputForm: {
        width: '100%',
        marginTop: 30
    },
    btnContainerLogin: {
        marginTop: 20,
        width: '95%'
    },
    btnLogin: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
})
