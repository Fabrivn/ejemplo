import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Keyboard, SafeAreaView, TouchableOpacity, FlatList, Button, StyleSheet, Switch, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TableScreen from './TableScreen';

const Armadura = ({ route }) => {
  const { item } = route.params;
  const { ArmInf } = item; // Asumiendo que ArmInf es el valor necesario para la combinación
  const { ArmSup } = item;
  const verificarRelacion = (combinacion) => {
    const { areaTotal } = combinacion;
    const areaRequerida = parseFloat(ArmInf);

    // Si el área total de la combinación es mayor o igual al área requerida, es válida
    return areaTotal >= areaRequerida;
  };
    // Función para encontrar la mejor combinación de fierros
    const encontrarMejorCombinacion = (armadura) => {
        let combinacionOptima = null;
        let areaMinima = Infinity;
      
        // Analizar el área recibida
        for (let i = 0; i < fierros.length; i++) {
          for (let j = 0; j < fierros.length; j++) {
            let fierro1 = fierros[i];
            let fierro3 = fierros[j];
      
            // Asegurarse de que los fierros en las posiciones (1,1) y (1,3) sean iguales
            if (fierro1.diametro === fierro3.diametro) {
              const areaTotalSinMedio = fierro1.area * 2;
      
              if (areaTotalSinMedio >= armadura) {
                // Verificar si esta combinación cumple con el área requerida
                if (areaTotalSinMedio < areaMinima) {
                  combinacionOptima = {
                    fierro1,
                    fierro2: null,
                    fierro3: fierro3,
                    areaTotal: areaTotalSinMedio
                  };
                  areaMinima = areaTotalSinMedio;
                }
              } else {
                // Añadir un fierro al medio (1,2) para verificar si la combinación cumple
                for (let k = 0; k < fierros.length; k++) {
                  let fierro2 = fierros[k];
                  const areaTotalConMedio = areaTotalSinMedio + fierro2.area;
      
                  if (areaTotalConMedio >= armadura) {
                    // Verificar si esta combinación cumple con el área requerida
                    if (areaTotalConMedio < areaMinima) {
                      combinacionOptima = {
                        fierro1,
                        fierro2,
                        fierro3,
                        areaTotal: areaTotalConMedio
                      };
                      areaMinima = areaTotalConMedio;
                    }
                    break; // Salir del loop si encontramos una combinación que cumple con el área
                  }
                }
              }
            }
          }
        }
        
        return combinacionOptima};

    const calculoDistancias = (fierro1, fierro2, fierro3, long, muerta) => {
            let dist;
            dist = (long - (fierro1 / 10) - (fierro2 / 10) - (fierro3 / 10) - 2 * muerta)/2;
            return dist;
          };

  const combinacionOptimaInf = encontrarMejorCombinacion(ArmInf);
  const combinacionOptimaSup = encontrarMejorCombinacion(ArmSup);

  const distanciaInf = combinacionOptimaInf
    ? calculoDistancias(
        combinacionOptimaInf.fierro1.diametro,
        combinacionOptimaInf.fierro2 ? combinacionOptimaInf.fierro2.diametro : 0,
        combinacionOptimaInf.fierro3.diametro,
        parseFloat(item.width),
        parseFloat(item.campoMuerto)
      )
    : 0;

  const distanciaSup = combinacionOptimaSup
    ? calculoDistancias(
        combinacionOptimaSup.fierro1.diametro,
        combinacionOptimaSup.fierro2 ? combinacionOptimaSup.fierro2.diametro : 0,
        combinacionOptimaSup.fierro3.diametro,
        parseFloat(item.width),
        parseFloat(item.campoMuerto)
      )
    : 0;

    return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Combinación Óptima de Armadura</Text>
    
          <View style={styles.recuadro}>
            <Text style={styles.recuadroTitle}>Armadura Inferior:</Text>
            {combinacionOptimaInf ? (
              <>
                <Text style={styles.resultText}>
                  Fierro 1: <Text style={styles.resultValue}>{combinacionOptimaInf.fierro1.diametro} mm</Text>
                </Text>
                {combinacionOptimaInf.fierro2 && (
                  <Text style={styles.resultText}>
                    Fierro 2: <Text style={styles.resultValue}>{combinacionOptimaInf.fierro2.diametro} mm</Text>
                  </Text>
                )}
                <Text style={styles.resultText}>
                  Fierro 3: <Text style={styles.resultValue}>{combinacionOptimaInf.fierro3.diametro} mm</Text>
                </Text>
                <Text style={styles.resultText}>
                  Distancia: <Text style={styles.resultValue}>{distanciaInf.toFixed(2)} cm</Text>
                </Text>
              </>
            ) : (
              <Text style={styles.resultText}>No se encontró una combinación óptima para la armadura inferior.</Text>
            )}
          </View>
    
          <View style={styles.recuadro}>
            <Text style={styles.recuadroTitle}>Armadura Superior:</Text>
            {combinacionOptimaSup ? (
              <>
                <Text style={styles.resultText}>
                  Fierro 1: <Text style={styles.resultValue}>{combinacionOptimaSup.fierro1.diametro} mm</Text>
                </Text>
                {combinacionOptimaSup.fierro2 && (
                  <Text style={styles.resultText}>
                    Fierro 2: <Text style={styles.resultValue}>{combinacionOptimaSup.fierro2.diametro} mm</Text>
                  </Text>
                )}
                <Text style={styles.resultText}>
                  Fierro 3: <Text style={styles.resultValue}>{combinacionOptimaSup.fierro3.diametro} mm</Text>
                </Text>
                <Text style={styles.resultText}>
                  Distancia: <Text style={styles.resultValue}>{distanciaSup.toFixed(2)} cm</Text>
                </Text>
              </>
            ) : (
              <Text style={styles.resultText}>No se encontró una combinación óptima para la armadura superior.</Text>
            )}
          </View>
        </SafeAreaView>
      );
    };
    
    // Datos de fierros disponibles
    const fierros = [
      { diametro: 8, area: 50.2656 },
      { diametro: 10, area: 78.54 },
      { diametro: 12, area: 113.0976 },
      { diametro: 16, area: 201.0624 },
      { diametro: 20, area: 314.16 },
      { diametro: 25, area: 490.875 }
    ];
    
    // Estilos
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding:20,
        backgroundColor: '#f4f4f4',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 40, 
      },
      recuadro: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: 30,
      },
      recuadroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      resultText: {
        fontSize: 16,
        marginBottom: 5,
      },
      resultValue: {
        fontWeight: 'bold',
      },
    });
    
    export default Armadura;