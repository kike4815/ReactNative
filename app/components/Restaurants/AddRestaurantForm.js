import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { map, size, filter } from 'lodash'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'
import Modal from '../Modal'
import uuid from 'random-uuid-v4'

import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
const db = firebase.firestore(firebaseApp)

const widthScreen = Dimensions.get('window').width

export default function AddRestaurantForm (props) {
    const { toastRef, setIsLoading, navigation } = props
    const [ restaurantName, setRestaurantName ] = useState('')
    const [ restaurantAddress, setRestaurantAddress ] = useState('')
    const [ restaurantDescription, setRestaurantDescription ] = useState('')
    const [ imageSeleted, setImageSeleted ] = useState([])
    const [ isVisibleMap, setIsVisibleMap ] = useState(false)
    const [ locationrestaurant, setLocationrestaurant ] = useState(null)

    const addRestaurante = () => {
        if (!restaurantName || !restaurantDescription || !restaurantAddress) {
            toastRef.current.show('Todos los campos del formulario son obligatorios')
        } else if (size(imageSeleted) === 0) {
            toastRef.current.show('El restaurante debe tener almenos una foto')
        } else if (!locationrestaurant) {
            toastRef.current.show('Tienes que localizar el restaurante en el mapa')
        } else {
            setIsLoading(true)
            uploadImageStorage().then((response) => {
                console.log(restaurantName);
                console.log(restaurantAddress);
                console.log(restaurantDescription);
                console.log(locationrestaurant);
                console.log(response);
                console.log(firebase.auth().currentUser.uuid);
                
                
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationrestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid
                    })
                    .then(() => {
                        setIsLoading(false)
                        navigation.navigate('restaurants')
                    })
                    .catch(() => {
                        setIsLoading(false)
                        toastRef.current.show('error al subir el restaurante, intentelo mas tarde')
                    })
            })
        }
    }

    const uploadImageStorage = async () => {
        const imageBlob = []

        await Promise.all(
            map(imageSeleted, async (image) => {
                const response = await fetch(image)
                const blob = await response.blob()
                const ref = firebase.storage().ref('restaurants').child(uuid())
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`restaurants/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoURL) => {
                            imageBlob.push(photoURL)
                        })
                })
            })
        )
        return imageBlob
    }

    return (
        <ScrollView style={styles.ScrollView}>
            <ImageRestaurant imageRestaurant={imageSeleted[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationrestaurant={locationrestaurant}
            />
            <UploadImage toastRef={toastRef} imageSeleted={imageSeleted} setImageSeleted={setImageSeleted} />
            <Button title="Crear Restaurante" onPress={addRestaurante} buttonStyle={styles.btnAddRestaurant} />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationrestaurant={setLocationrestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function ImageRestaurant (props) {
    const { imageRestaurant } = props
    return (
        <View style={styles.viewPhoto}>
            <Image
                source={
                    imageRestaurant ? { uri: imageRestaurant } : require('../../../assets/img/restaurant-default.png')
                }
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}

function FormAdd (props) {
    const {
        setRestaurantName,
        setRestaurantAddress,
        setRestaurantDescription,
        setIsVisibleMap,
        locationrestaurant
    } = props
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: 'google-maps',
                    color: locationrestaurant ? '#00a680' : '#c2c2c2',
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Descripcion del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map (props) {
    const { isVisibleMap, setIsVisibleMap, setLocationrestaurant, toastRef } = props
    const [ location, setLocation ] = useState(null)

    useEffect(() => {
        ;(async () => {
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)
            const statusPermissions = resultPermissions.permissions.location.status

            if (statusPermissions !== 'granted') {
                toastRef.current.show('Tienes que aceptar los permisos de localizacion para crear un restaurante', 3000)
            } else {
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationrestaurant(location)
        toastRef.current.show('localización guardada correctamente')
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewmapBtn}>
                    <Button
                        title="Guardar ubicacion"
                        containerStyle={styles.viewContainerSet}
                        buttonStyle={styles.viewBtnSet}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar ubicacion"
                        containerStyle={styles.viewMapContainerCanceledBtn}
                        buttonStyle={styles.viewMapBtnCanceled}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage (props) {
    const { toastRef, imageSeleted, setImageSeleted } = props

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL)

        if (resultPermissions === 'denied') {
            toastRef.current.show(
                'Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir a ajustes y activarlos manualmente',
                3000
            )
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [ 4, 3 ]
            })
            if (result.cancelled) {
                toastRef.current.show('Has cerrado sin seleccionar ninguna imagen', 2000)
            } else {
                setImageSeleted([ ...imageSeleted, result.uri ])
            }
        }
    }

    const removeImage = (image) => {
        Alert.alert(
            'Eliminar Imagen',
            '¿Estas seguro de que quieres eliminar la imagen',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        setImageSeleted(filter(imageSeleted, (imageUrl) => imageUrl !== image))
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <View style={styles.viewImages}>
            {size(imageSeleted) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imageSeleted, (imageRestaurant, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}
const styles = StyleSheet.create({
    ScrollView: {
        height: '100%'
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: '#00a680',
        margin: 20
    },
    viewImages: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3'
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: '100%',
        height: 550
    },
    viewmapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    viewMapContainerCanceledBtn: {
        paddingLeft: 5
    },
    viewMapBtnCanceled: {
        backgroundColor: '#a60d0d'
    },
    viewContainerSet: {
        paddingRight: 5
    },
    viewBtnSet: {
        backgroundColor: '#00a680'
    }
})
