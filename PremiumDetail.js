import React from 'react';
import { ScrollView, View, Text, Linking, TouchableOpacity, Share, Image, StyleSheet, Platform, Modal, Button } from 'react-native';
import { Card } from 'react-native-paper';
import data from './data.json';
import Swiper from 'react-native-swiper';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAAlpyQPvBVphO6J59Cz05Umjka4MHBIO0'

const PremiumDetailScreen = ({route}) => {
    const { itemData } = route.params;
    const [currentLocation, setCurrentLocation] = React.useState(null);

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
    

    const getDirections = async () => {
        const origin = `${currentLocation.longitude},${currentLocation.latitude}`;
        const destination = `${itemData.location.longitude},${itemData.location.latitude}`;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?access_token=tu-token-de-acceso`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                setDirectionsRoute(data.routes[0].geometry.coordinates);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const dialCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
    };

    const sendWhatsApp = (number) => {
        let url = 'whatsapp://send?text=' + 'Hola, necesito más información' + '&phone=+549' + number;
        Linking.openURL(url).then((data) => {
            console.log('WhatsApp Opened');
        }).catch(() => {
            alert('Make sure Whatsapp installed on your device');
        });
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 
                    `Nombre del lugar: ${itemData.title}\n` +
                    `Horario de atención: ${itemData.horarios}\n` +
                    `Teléfono: ${itemData.phone}\n` +
                    `Ubicación: ${itemData.location.latitude}, ${itemData.location.longitude}\n` +
                    (itemData.links ? `Website: ${itemData.links.website}` : ''),
            });
    
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // se compartió con una actividad de tipo específico
                } else {
                    // se compartió
                }
            } else if (result.action === Share.dismissedAction) {
                // se descartó el cuadro de diálogo de compartir
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const isOpen = (horarios) => {
        if (horarios === 'Abierto todo el año') {
            return true;
        }
    
        const [start, end] = horarios.split('-').map(time => {
            const [hours, minutes] = time.trim().split(':');
            return hours * 60 + minutes * 1; // convertir a minutos
        });
    
        const now = new Date();
        const nowInMinutes = now.getHours() * 60 + now.getMinutes();
    
        return nowInMinutes >= start && nowInMinutes <= end;
    };

    return (
        <ScrollView>
            <Swiper height={400} autoplay>
                {itemData.image.map((imageUrl, index) => (
                    <Image key={index} style={styles.image} source={{ uri: imageUrl }} />
                ))}
            </Swiper>
            <View style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.title}>{itemData.title}</Text>
                  
                        <Text style={styles.subtitle}>{itemData.category}</Text>
                        <Text style={styles.description}>{itemData.description}</Text>
                        <Text style={styles.description}>{itemData.horario}</Text>
                        {itemData.horario && (
                            <Text style={{...styles.description, color: isOpen(itemData.horario) ? 'green' : 'red'}}>
                                {isOpen(itemData.horario) ? 'Abierto' : 'Cerrado'}
                            </Text>
                        )}
                        <Text style={styles.description}>{itemData.subCategory}</Text>
                        <Text style={styles.status}>{itemData.status}</Text>
                        <TouchableOpacity style={styles.button} onPress={()=>dialCall(itemData.phone)}>
                            <Text style={styles.buttonText}>Llamar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={()=>sendWhatsApp(itemData.phone)}>
                            <Text style={styles.buttonText}>Eviar WhatsApp</Text>
                        </TouchableOpacity>
                        {itemData.links && (
                            <View style={styles.links}>
                                {itemData.links.website && (
                                    <TouchableOpacity onPress={() => Linking.openURL(itemData.links.website)}>
                                        <Text style={styles.linkText}>Website</Text>
                                    </TouchableOpacity>
                                )}
                                {itemData.links.facebook && (
                                    <TouchableOpacity onPress={() => Linking.openURL(itemData.links.facebook)}>
                                        <Text style={styles.linkText}>Facebook</Text>
                                    </TouchableOpacity>
                                )}
                                {itemData.links.instagram && (
                                    <TouchableOpacity onPress={() => Linking.openURL(itemData.links.instagram)}>
                                        <Text style={styles.linkText}>Instagram</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
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
                    {currentLocation && (
                        <MapViewDirections
                            origin={currentLocation}
                            destination={{latitude: itemData.location.latitude, longitude: itemData.location.longitude}}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
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
        height: 600,
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
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
    description: {
        fontSize: 18, // Aumenta el tamaño de la fuente
        marginVertical: 10,
       top: 10,
        bottom: 40,
       
        
        
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
    title:{
        color: 'black'
    },
    subtitle:{
        color: 'black'
    },
    description:{
        color: 'black'
    }
});

export default PremiumDetailScreen;