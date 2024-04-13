import React from 'react';
import { Modal, View, Text, Linking, TouchableOpacity, Share, FlatList, ImageBackground, StyleSheet, Platform, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import data from './data.json';
import { useNavigation } from '@react-navigation/native';

const DetailScreen = ({route}) => {
    const {itemData, itemDatas} = route.params;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selecteditemData, setSelecteditemData] = React.useState(null);
    
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
            message: `${itemData.name}\n${itemData.category}\n${itemData.description}\n${itemData.phone}\n${itemData.title}`,
          });
        } catch (error) {
          alert(error.message);
        }
    };
    const filteredData = data.filter(i => i.category === itemData.category);
    // Mezcla los datos filtrados
    const shuffledData = filteredData.sort(() => 0.5 - Math.random());

    // Selecciona los primeros 4 elementos
    const relateditemDatas = shuffledData.slice(0, Math.min(4, shuffledData.length));

    const renderitemData = ({item}) => (
        <TouchableOpacity onPress={() => { setSelecteditemData(item); setModalVisible(true); }}>
            <Card style={{ margin: 5, height: 120, width: '90%', alignSelf: 'center' }}>
                <Card.Content>
                    <Text style={styles.textStyle}>{item.category}</Text>
                    <Text style={styles.textStyle}>{item.description.substring(0, 100)}...</Text>
                    <Text style={styles.textStyle}>{item.name}</Text>
                    <Text style={styles.textStyle}>{item.title}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
    
    

   

    return (
        <ImageBackground
            source={require('./montaña.jpg')}
            style={styles.backgroundImage}>
            <ScrollView> 
            <View>
                <Card style={{margin: 10, elevation: 10}}>
                    <Card.Content>
                        <Text style={styles.textStyle}>{itemData.title}</Text>
                        <Text style={styles.textStyle}>{itemData.name}</Text>
                        <Text style={styles.textStyle}>{itemData.category}</Text>
                        <Text style={styles.textStyle}>{itemData.description}</Text>
                        <Text style={styles.textStyle}>{itemData.horario}</Text>
                        <TouchableOpacity onPress={()=>dialCall(itemData.phone)}>
                            <Text style={styles.textStyle}>{itemData.phone}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>sendWhatsApp(itemData.phone)}>
                            <Text style={styles.textStyle}>Enviar WhatsApp</Text>
                        </TouchableOpacity>
                        {itemData.links && (
                            <>
                                <TouchableOpacity onPress={() => Linking.openURL(itemData.links.website)}>
                                    <Text style={styles.textStyle}>Website</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL(itemData.links.instagram)}>
                                    <Text style={styles.textStyle}>Instagram</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL(itemData.links.facebook)}>
                                    <Text style={styles.textStyle}>Facebook</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Card.Content>
                </Card>
                <Button mode="contained" onPress={onShare} style={{margin: 10}}>
                    Compartir información
                </Button>
                <Text
                style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginTop: 5,
                    color: 'darkviolet',
                    marginLeft: 20,
                    marginBottom: 25,
                }}>Si te interesó esta categoría, también te podría interesar esto:</Text>
            
          
                    <FlatList
                        data={relateditemDatas}
                        keyExtractor={item => item ? item.id.toString() : ''}
                        renderItem={renderitemData}
                        numColumns={1} // Esto hará que tus tarjetas se muestren en una columna
                        key={1} // Añade una clave única que cambie cuando cambie numColumns
                        contentContainerStyle={{ paddingBottom: 20 }} // Añade un padding en la parte inferior si es necesario
                    />
               
            
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {selecteditemData && (
                                <>
                                    <Text style={styles.textStyle}>{selecteditemData.title}</Text>
                                    <Text style={styles.textStyle}>{selecteditemData.name}</Text>
                                    <Text style={styles.textStyle}>{selecteditemData.category}</Text>
                                    <Text style={styles.textStyle}>{selecteditemData.description}</Text>
                                    <Text style={styles.textStyle}>{selecteditemData.horario}</Text>
                                    <Text style={styles.textStyle}>{selecteditemData.phone}</Text>
                                    {/* Aquí puedes agregar más campos si los necesitas */}
                                </>
                            )}
                            <TouchableOpacity
                                style={{ marginTop: 15 }}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            </ScrollView> 
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: '#000066',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        color: "darkviolet",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default DetailScreen;