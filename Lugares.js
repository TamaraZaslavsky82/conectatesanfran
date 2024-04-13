import React from 'react';
import { ScrollView, View, Linking, TouchableOpacity, Share, Image, StyleSheet, Platform, Modal, Button, Text } from 'react-native';
import { Card } from 'react-native-paper';
import data from './data.json';
import Swiper from 'react-native-swiper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Lugares = ({route}) => {
    const { itemData } = route.params;
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [coords, setCoords] = React.useState([]);

    React.useEffect(() => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, []);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Mira este lugar: ${itemData.title}`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // compartido con actividad de tipo result.activityType
                } else {
                    // compartido
                }
            } else if (result.action === Share.dismissedAction) {
                // se descartó el cuadro de diálogo de compartir
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const getDirections = async () => {
        const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
        const destination = `${itemData.location.latitude},${itemData.location.longitude}`;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=YOUR_GOOGLE_MAPS_API_KEY`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const points = data.routes[0].overview_polyline.points;
                const steps = Polyline.decode(points);
                const coordSteps = steps.map((step) => {
                    return  {
                        latitude : step[0],
                        longitude : step[1]
                    }
                });
                setCoords(coordSteps);
            }
        } catch (error) {
            console.log(error);
        }
    };

return (
    <ScrollView>
        <Swiper height={200} autoplay>
            {itemData.image && itemData.image.map((imageUrl, index) => (
                <Image key={index} style={styles.image} source={{ uri: imageUrl }} />
            ))}
        </Swiper>
        <View style={styles.content}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{itemData.title}</Text>
                    <Text style={styles.subtitle}>{itemData.category}</Text>
                    <Text style={styles.description}>{itemData.description}</Text>
                    <Text style={styles.status}>Dificultad: {itemData.dificultad}</Text>
                    <Text style={styles.description}>{itemData.subCategory}</Text>
                    <Text style={styles.status}>{itemData.status}</Text>
                </Card.Content>
            </Card>
        </View>
    
        <View style={{ flex: 1, height: 200 }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: itemData.location.latitude,
                        longitude: itemData.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{latitude: itemData.location.latitude, longitude: itemData.location.longitude}}
                        title={itemData.title}
                    />
                    {coords.length > 0 && (
                        <Polyline 
                            coordinates={coords}
                            strokeWidth={2}
                            strokeColor="red"
                        />
                    )}
                </MapView>
        <Button title="Cómo llegar" onPress={getDirections} />
        <Button title="Compartir" onPress={onShare} />
        </View>
    </ScrollView>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        padding: 10,
    },
    card: {
        margin: 10,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color:'black'
    },
    subtitle: {
        fontSize: 18,
        color: '#2874A6',
        color: 'black'
    },
    description: {
        fontSize: 18, // Aumenta el tamaño de la fuente
        marginVertical: 10,
        color: 'black' // Cambia el color del texto
       
        
        
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#AB47BC',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    links: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    linkText: {
        color: '#007bff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default Lugares;