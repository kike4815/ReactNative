import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { size } from 'lodash'
import { useNavigation } from '@react-navigation/native'

export default function ListRestaurants (props) {
    const { restaurants, handleLoadMore, isloading } = props
    const navigation = useNavigation()
    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isloading={isloading} />}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando restaurantes...</Text>
                </View>
            )}
        </View>
    )
}

function Restaurant (props) {
    const { restaurant, navigation } = props
    const { id, images, name, description, address } = restaurant.item
    const imageRestaurant = images[0]

    const goRestaurant = () => {
        navigation.navigate('restaurant', {
            id,
            name
        })
    }

    return (
        <TouchableOpacity onPress={() => goRestaurant()}>
            <View style={styles.viewRestaurants}>
                <View style={styles.viewRestaurantsImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                        source={
                            imageRestaurant ? (
                                { uri: imageRestaurant }
                            ) : (
                                require('../../../assets/img/restaurant-default.png')
                            )
                        }
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList (props) {
    const { isloading } = props
    if (isloading) {
        return (
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View style={styles.notFountRest}>
                <Text>No quedan restaurantes para cargar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    viewRestaurants: {
        flexDirection: 'row',
        margin: 10
    },
    viewRestaurantsImage: {
        marginRight: 15
    },
    imageRestaurant: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: 'bold'
    },
    restaurantAddress: {
        paddingTop: 2,
        color: 'grey'
    },
    restaurantDescription: {
        paddingTop: 2,
        color: 'grey',
        width: 300
    },
    notFountRest: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    }
})
