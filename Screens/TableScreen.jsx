import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Keyboard, SafeAreaView, TouchableOpacity, FlatList, Button, StyleSheet, Switch, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// TableScreen Component
const TableScreen = ({ route, navigation }) => {
    const { vigas } = route.params;
  
    const handleSquareButtonPress = (item) => {
      navigation.navigate('Armadura', { item }); // Navega a la nueva pantalla
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={styles.tableContainer}
          ListHeaderComponent={<Text style={styles.title}>Resultados</Text>}
          data={vigas}
          renderItem={({ item }) => (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>
                Viga: <Text style={styles.resultText2}>{item.nombre}</Text>
              </Text>
              <Text style={styles.resultText}>
                Ancho: <Text style={styles.resultText2}>{item.width} cm</Text>
              </Text>
              <Text style={styles.resultText}>
                Alto: <Text style={styles.resultText2}>{item.height} cm</Text>
              </Text>
              <Text style={styles.resultText}>
                Área: <Text style={styles.resultText2}>{item.area} cm²</Text>
              </Text>
              <Text style={styles.resultText}>
                Cantidad de vigas: <Text style={styles.resultText2}>{item.cantVigas}</Text>
              </Text>
              <Text style={styles.resultText}>
                fck: <Text style={styles.resultText2}>{item.fck} MPa</Text>
              </Text>
              <Text style={styles.resultText}>
                fyk: <Text style={styles.resultText2}>{item.fyk} MPa</Text>
              </Text>
              <Text style={styles.resultText}>
                fcd: <Text style={styles.resultText2}>{item.fcd} MPa</Text>
              </Text>
              <Text style={styles.resultText}>
                fyd: <Text style={styles.resultText2}>{item.fyd} MPa</Text>
              </Text>
              <Text style={styles.resultText}>
                Momento: <Text style={styles.resultText2}>{item.momento} kN·m</Text>
              </Text>
              <Text style={styles.resultText}>
                d': <Text style={styles.resultText2}>{item.dPrima} cm</Text>
              </Text>
              <Text style={styles.resultText}>
                d: <Text style={styles.resultText2}>{item.d} cm</Text>
              </Text>
              <Text style={styles.resultText}>
                u: <Text style={styles.resultText2}>{item.u}</Text>
              </Text>
              <Text style={styles.resultText}>
                ud: <Text style={styles.resultText2}>{item.ud}</Text>
              </Text>
              <Text style={styles.resultText}>
                x: <Text style={styles.resultText2}>{item.minX} cm</Text>
              </Text>
              <Text style={styles.resultText}>
                Arm Sup: <Text style={styles.resultText2}>{item.ArmSup} mm²</Text>
              </Text>
              <Text style={styles.resultText}>
                Arm Inf: <Text style={styles.resultText2}>{item.ArmInf} mm²</Text>
              </Text>
  
              {/* Botón cuadrado junto a la viga */}
              <TouchableOpacity
              style={styles.squareButton}
              onPress={() => handleSquareButtonPress(item)}
              >
              <Text style={styles.squareButtonText}>Calcular Armadura</Text>
              </TouchableOpacity>
              
            </View>
          )}
  
          ListFooterComponent={
            <View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => exportToGoogleSheets(vigas)}
            >
              <Text style={styles.buttonText}>Exportar a Google Sheets</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => generatePDF(vigas)}
            >
            <Text style={styles.buttonText}>Generar PDF</Text>
            </TouchableOpacity>
            </View>
          }
          keyExtractor={item => item.key}
        />
      </SafeAreaView>
    );
  };
  
//   // Datos de fierros disponibles
//   const fierros = [
//     { diametro: 8, area: 50.2656 },
//     { diametro: 10, area: 78.54 },
//     { diametro: 12, area: 113.0976 },
//     { diametro: 16, area: 201.0624 },
//     { diametro: 20, area: 314.16 },
//     { diametro: 25, area: 490.875 }
//   ];
  
  // Función para encontrar la mejor combinación de fierros
//   const encontrarMejorCombinacion = (armadura) => {
//     let combinacionOptima = null;
//     let areaMinima = Infinity;
  
//     // Analizar el área recibida
//     for (let i = 0; i < fierros.length; i++) {
//       for (let j = 0; j < fierros.length; j++) {
//         let fierro1 = fierros[i];
//         let fierro3 = fierros[j];
  
//         // Asegurarse de que los fierros en las posiciones (1,1) y (1,3) sean iguales
//         if (fierro1.diametro === fierro3.diametro) {
//           const areaTotalSinMedio = fierro1.area * 2;
  
//           if (areaTotalSinMedio >= armadura) {
//             // Verificar si esta combinación cumple con el área requerida
//             if (areaTotalSinMedio < areaMinima) {
//               combinacionOptima = {
//                 fierro1,
//                 fierro2: null,
//                 fierro3: fierro3,
//                 areaTotal: areaTotalSinMedio
//               };
//               areaMinima = areaTotalSinMedio;
//             }
//           } else {
//             // Añadir un fierro al medio (1,2) para verificar si la combinación cumple
//             for (let k = 0; k < fierros.length; k++) {
//               let fierro2 = fierros[k];
//               const areaTotalConMedio = areaTotalSinMedio + fierro2.area;
  
//               if (areaTotalConMedio >= armadura) {
//                 // Verificar si esta combinación cumple con el área requerida
//                 if (areaTotalConMedio < areaMinima) {
//                   combinacionOptima = {
//                     fierro1,
//                     fierro2,
//                     fierro3,
//                     areaTotal: areaTotalConMedio
//                   };
//                   areaMinima = areaTotalConMedio;
//                 }
//                 break; // Salir del loop si encontramos una combinación que cumple con el área
//               }
//             }
//           }
//         }
//       }
//     }
    
//     return combinacionOptima};
  
//   const calculoDistancias = (fierro1, fierro2, fierro3, long, muerta) => {
//     let dist;
//     dist = (long - (fierro1 / 10) - (fierro2 / 10) - (fierro3 / 10) - 2 * muerta)/2;
//     return dist;
//   };
//Estilos
const styles = StyleSheet.create({
   
   
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
   
   
    primaryButton: {
      backgroundColor: '#040720',
      padding: 15,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 10,
    },
    
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    tableContainer: {
      padding: 20,
    },
    resultContainer: {
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    resultText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    resultText2: {
      fontSize: 14,
      fontWeight: 'normal',
      marginBottom: 5,
    },
    resultText3: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    resultText4: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#ff6347'
    },
    squareButton: {
      backgroundColor: '#ff6347',
      padding: 15,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 10,
      borderRadius: 20,
      marginTop: 10,
    },
    squareButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    
  });
  
  export default TableScreen;