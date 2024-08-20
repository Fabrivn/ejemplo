import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    //  para que los botones aparezcan después de 2 segundos
    setTimeout(() => {
      setShowButtons(true);
    }, 2000); // Puedes ajustar el tiempo según prefieras
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/icon.jpg')} // Cambia esto a la ruta de tu logo
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido VigaSolver </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.justifiedText}>
          Esta aplicación lleva a cabo el cálculo para determinar la disposición y selección óptima de las armaduras necesarias en una viga, con el fin de garantizar su resistencia estructural y cumplir con los requisitos de diseño.
        </Text>
      </View>

      {showButtons && (
        <View>
          <TouchableOpacity
            style={styles.thirdButton}
            onPress={() => navigation.navigate('Datos')}
          >
            <Text style={styles.buttonText}>Crear un proyecto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Datos')}
          >
            <Text style={styles.buttonText}>Calculo Rapido de una viga</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Datos')}
          >
            <Text style={styles.buttonText}>Calcular Armado Rapido</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E4E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, //Tamano de la imagen(logo(icon.jpg))
    height: 200, //Tamano de la imagen(logo(icon.jpg))
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    width: '90%',
  },
  justifiedText: {
    textAlign: 'justify',
    fontSize: 16,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  thirdButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
