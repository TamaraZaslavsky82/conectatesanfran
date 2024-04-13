import React, { useState } from 'react';
import { Button, TextInput, View, ImageBackground, StyleSheet, Text, Switch } from 'react-native';
import { Linking } from 'react-native';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [business, setBusiness] = useState('');
    const [phone, setPhone] = useState('');
    const [premium, setPremium] = useState(false);

    const handleSubmit = () => {
        const message = `Hola, mi nombre es ${name}. Estoy interesado en sumar ${business}, a la aplicacon . Mi número de contacto es ${phone}. ${premium ? 'Deseo promocionar.' : ''}`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=+5492664663623`;
        Linking.openURL(url);
    };

    return (
        <ImageBackground source={require('./montaña.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.invitation}>¡Suma tus servicios en la app de Conectate! Podes llenar los datos y a la brevedad te enviaremos toda la informacion que necesitamos para sumar tus datos.</Text>
                <Text style={styles.invitation}>Recorda que la aplicacion es gratuita. En caso que desees realizar publicidad cliclea la casilla y te brindaremos toda la informacion necesaria.</Text>
                <TextInput style={styles.input} placeholder="Nombre" onChangeText={setName} placeholderTextColor="darkviolet"/>
                <TextInput style={styles.input} placeholder="Negocio" onChangeText={setBusiness} placeholderTextColor="darkviolet"/>
                <TextInput style={styles.input} placeholder="Teléfono" onChangeText={setPhone} placeholderTextColor="darkviolet" />
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={premium ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setPremium}
                        value={premium}
                    />
                    <Text style={styles.label}>Deseo promocionar</Text>
                </View>
                <Button title="Enviar" onPress={handleSubmit} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        margin: 10,
        paddingLeft: 10,
        color:'darkviolet'
    },
    invitation: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        width: '80%',
        left: '10%',
    },
    switchContainer: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch: {
        transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] // Aumenta el tamaño del switch
    },
    label: {
        margin: 8,
        color: 'white', // Cambia el color del texto a blanco
    },
});

export default ContactForm;