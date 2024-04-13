import React, {useState, useLayoutEffect, useCallback} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import {
  List,
  Button,
  Divider,
  Provider as PaperProvider,
  Card,
  Title,
} from 'react-native-paper';
import { HeaderBackButton } from '@react-navigation/stack';

const CategoriesScreen = ({navigation}) => {
  const data = require('./data.json');

  const allCategories = data.map(item => item.category);
  const uniqueCategories = allCategories
    .filter((category, index, self) => self.indexOf(category) === index)
    .sort((a, b) => b.localeCompare(a));

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
  };

  const handleSubCategorySelect = subCategory => {
    setSelectedSubCategory(subCategory);
  };

  const handleBackToSubCategories = () => {
    setSelectedSubCategory(null);
  };

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  

  const filteredData = selectedCategory
    ? data
        .filter(item => item.category === selectedCategory)
        .sort((a, b) => (b.status === 'Premium' ? 1 : -1))
    : [];

  const filteredSubCategoryData = selectedSubCategory
    ? filteredData
        .filter(item => item.subCategory === selectedSubCategory)
        .sort((a, b) => (b.status === 'Premium' ? 1 : -1))
    : [];


    
  const allSubCategories = filteredData
    .map(item => item.subCategory)
    .filter(subCategory => subCategory);

  const uniqueSubCategories = allSubCategories
    .filter((subCategory, index, self) => self.indexOf(subCategory) === index)
    .sort((a, b) => b.localeCompare(a));

  return (
    <PaperProvider>
      <ImageBackground
        source={require('./montaña.jpg')}
        style={styles.backgroundImage}>
          
        <View
          style={{
            flex: 1,
           
            padding: 10,
          }}>
          {selectedCategory ? (
            <Button
              style={{
                backgroundColor: 'white',
                marginBottom: 10,
                marginTop: 10,
              }}
              onPress={handleBackToCategories}>
              Volver a las categorías
            </Button>
          ) : null}
          {!selectedCategory ? (
            <>
              <Text style={{fontSize: 20, textAlign: 'center', margin: 10}}>
                Aquí puedes encontrar todas las categorías disponibles
              </Text>
              <FlatList
                data={uniqueCategories}
                numColumns={2}
                renderItem={({item}) => (
                  <Card
                    style={styles.card}
                    onPress={() => handleCategorySelect(item)}>
                    <Card.Content>
                      <Title style={styles.title}>{item}</Title>
                    </Card.Content>
                  </Card>
                )}
                keyExtractor={item => item}
                key="categories"
              />
            </>
          ) : uniqueSubCategories.length > 0 && !selectedSubCategory ? (
            <>
              <Button
                style={{
                  backgroundColor: 'white',
                  marginBottom: 10,
                  marginTop: 10,
                }}
                onPress={handleBackToSubCategories}>
                Volver a Subcategorías
              </Button>
              <FlatList
                data={uniqueSubCategories}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSubCategorySelect(item)}>
                    <List.Item
                      title={<Text style={{color: 'darkviolet'}}>{item}</Text>}
                      style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
                ItemSeparatorComponent={Divider}
              />
            </>
          ) : (
            <FlatList
              data={
                selectedSubCategory ? filteredSubCategoryData : filteredData
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.status === 'Free') {
                      navigation.navigate('Detail', {itemData: item});
                    } else if (item.status === 'Premium') {
                      navigation.navigate('PremiumDetail', {itemData: item});
                    } else if (item.status === 'Lugares') {
                      navigation.navigate('Lugares', {itemData: item});
                    }
                  }}>
                  <List.Item
                    title={
                      <Text style={{color: 'darkviolet'}}>{item.title}</Text>
                    }
                    description={
                      <Text
                        style={{
                          color: 'darkviolet',
                        }}>{`${item.description}`}</Text>
                    }
                    left={() => (
                      item.status === 'Premium' ? 
                      <Image
                        source={require('./estrella.png')}
                        style={{width: 30, height: 30}}
                      /> : null
                    )}
                    style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={Divider}
              />
          )}
        </View>
      </ImageBackground>
    </PaperProvider>
  );
                    }
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      marginBottom:60
    },
    card: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
      maxWidth: '60%',
      marginBottom: 5,
      marginTop: 5,
      marginLeft: 10,
      backgroundColor: '#fff', // Asegúrate de tener un color de fondo para que la sombra sea visible
      shadowColor: '#000', // El color de la sombra debe ser oscuro para que sea visible
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10,
    },
    title: {
      fontSize: 12,
      fontWeight: 'bold',
      color:'darkviolet'
    },
  });
  export default CategoriesScreen;