import React from 'react';
import { Text, Modal, View, Button, ImageBackground, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import data from './data.json'; 


class GeoMapa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: { latitude: -32.5999, longitude: -66.1259 },
            zoom: 13,
            category: 'Selecciona tu categoria',
            selectedTitle: null,
            modalVisible: false,
            route: null,
            categories: [],
            origin: null,
            destination: null,
        };
    }

    componentDidMount() {
        const categories = [...new Set(data.map(item => item.category))];
        this.setState({ categories });
        Geolocation.getCurrentPosition((position) => {
            this.setState({ origin: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
        }, (error) => console.error(error), { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }
    renderAnnotations() {
        const filteredData = data.filter(item => item.category === this.state.category);

        return filteredData.map(item => {
            if (item.location && item.location.latitude && item.location.longitude) {
                return (
                    <Marker
                        key={item.id}
                        coordinate={{latitude: item.location.latitude, longitude: item.location.longitude}}
                        onPress={() => {
                            this.setState({ selectedItem: item, modalVisible: true, destination: { latitude: item.location.latitude, longitude: item.location.longitude } });
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 5, padding: 2, marginRight: 5 }}>
                            {item.image && item.image.length > 0 && (
                                <Image
                                    style={{ width: 50, height: 50, marginRight: 5 }}
                                    source={{ uri: item.image[0] }}
                                />
                            )}
                            <Text style={{ color: 'darkviolet' }}>{item.title}</Text>
                        </View>
                        
                    </Marker>
                );
            }
        });
    }

    render() {
        const { origin, destination } = this.state;
        return (
            <React.Fragment>
                <ImageBackground
      source={require('./montaña.jpg')}
      style={styles.backgroundImage}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                            {this.state.selectedItem && (
                                <>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.title}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.description}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.category}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.name}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.phone}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.links.website}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.links.instagram}</Text>
                                    <Text style={{ color: 'darkviolet' }}>{this.state.selectedItem.links.facebook}</Text>
                                </>
                            )}

                            <Button
                                title="Cerrar"
                                onPress={() => {
                                    this.setState({ modalVisible: false });
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                 <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 20,
              color: 'white',
              marginLeft: 20,
              marginBottom: 25,
            }}>Conectate te ofrece la posibilidad de buscar el servicio, profesional y mucho mas segun la ubicacion que te sea mas comoda</Text>
                <Picker
                    selectedValue={this.state.category}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({category: itemValue})
                    }>
                    {this.state.categories.map((item, index) => {
                        return (<Picker.Item label={item} value={item} key={index}/>) 
                    })}
                </Picker>
                <MapView
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: this.state.center.latitude,
                            longitude: this.state.center.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {this.renderAnnotations()}
                        {origin && destination && (
                            <MapViewDirections
                                origin={origin}
                                destination={destination}
                                apikey={"AIzaSyAAlpyQPvBVphO6J59Cz05Umjka4MHBIO0"}
                                strokeWidth={4} // Esto cambiará el ancho de la línea
                                strokeColor="blue" // Esto cambiará el color de la línea a azul
                            />
                        )}
                    </MapView>
                </ImageBackground>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
  });

export default GeoMapa;