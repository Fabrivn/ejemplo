import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Keyboard, SafeAreaView, TouchableOpacity, FlatList, Button, StyleSheet, Switch, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// HomeScreen Component
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bienvenido!</Text>
        <Text style={styles.justifiedText}>
        Esta aplicación está diseñada para calcular la cantidad y el tipo de armadura necesarios para una viga en estructuras de construcción. Su objetivo es optimizar el uso de fierros en función de las especificaciones de diseño, garantizando que la viga cumpla con los requisitos estructurales establecidos.
        </Text>

        <TouchableOpacity
          style={styles.thirdButton}
          onPress={() => navigation.navigate('Datos')}
        >
          <View style={styles.buttonContent}>
  
            <Text style={styles.buttonText}>Crear un proyecto</Text>
          </View>
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
    </SafeAreaView>
  );
};

// InputScreen Component
const InputScreen = ({ navigation }) => {
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fck, setFck] = useState('');
  const [fyk, setFyk] = useState('');
  const [dPrime, setDPrime] = useState('');
  const [momento, setMomento] = useState('');
  const [nombre, setNombre] = useState('');
  const [isPositive, setIsPositive] = useState(true); // Nuevo estado para el Switch
  const [dimensiones, setDimensiones] = useState([]);
  const [agregado, setAgregado] = useState([]);
  const [campoMuerto, setcampoMuerto] = useState([]);
  

  const handleCalculate = () => {
    Keyboard.dismiss();

    if (ancho && alto && cantidad && fck && fyk) {
      const area = parseFloat(ancho) * parseFloat(alto);
      const fcd = (parseFloat(fck) / 1.5).toFixed(2);
      const fyd = (parseFloat(fyk) / 1.15).toFixed(2);
      const d = (alto - parseFloat(dPrime)).toFixed(2);
      const adjustedMomento = isPositive ? parseFloat(momento) : parseFloat(-momento); // Ajuste del momento
      const u = (((parseFloat(momento) * 1000000) / (parseFloat(ancho) * 10 * (d * 10) * (d * 10) * fcd))).toFixed(3);
      const ulim = 0.2961;
      let ud;

      if (u <= ulim) {
        ud = u;
      } else {
        ud = 0.2961;
      }
      const a = 0.32;
      const b = -0.8;

      const e1 = ((-b + Math.sqrt(b * b - 4 * a * ud)) / (2 * a)).toFixed(3);
      const e2 = ((-b - Math.sqrt(b * b - 4 * a * ud)) / (2 * a)).toFixed(3);

      const minX = Math.min(parseFloat(e1), parseFloat(e2));

      const x = minX * d * 10;
      const As_calc = ((0.8 * x * ancho * 10 * fcd) / fyd).toFixed(3);

      const M_lim = ((ulim * ancho * 10 * d * d * 100 * fcd) / 1000000).toFixed(3);
      const Delta_M = (adjustedMomento - M_lim).toFixed(3);

      const Delta_As = (Delta_M * 1000000 / (fyd * ((d * 10) - (dPrime * 10)))).toFixed(3);

      let ArmSup, ArmInf;

      if (adjustedMomento > 0) {
        ArmSup = Delta_As;
        ArmInf = (parseFloat(Delta_As) + parseFloat(As_calc)).toFixed(3);
      } else {
        ArmInf = 0;
        ArmSup = As_calc;
      }

      const nuevaDimension = {
        key: `${dimensiones.length + 1}`,
        width: ancho,
        height: alto,
        area: area.toFixed(2),
        cantVigas: cantidad,
        fck: fck,
        fyk: fyk,
        fcd: fcd,
        fyd: fyd,
        momento: adjustedMomento,
        dPrima: dPrime,
        d: d,
        u: u,
        ud: ud,
        minX: minX,
        ArmInf: ArmInf,
        ArmSup: ArmSup,
        nombre: nombre,
        campoMuerto: campoMuerto
      };

      setDimensiones([...dimensiones, nuevaDimension]);

      setAncho('');
      setAlto('');
      setCantidad('');
      setNombre('');
      setDPrime('');
      setMomento('');
      setAgregado('');
      setcampoMuerto('');

      Alert.alert('Listo!', 'Datos guardados exitosamente.');
    } else {
      Alert.alert('Error', 'Por favor, ingresa todos los valores.');
    }
  };


  const goToTableScreen = () => {
    navigation.navigate('Tabla', { vigas: dimensiones });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Ingrese las dimensiones de la viga [cm]:</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <TextInput
              style={styles.input}
              placeholder="Codigo de Viga"
              placeholderTextColor="#666"
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              style={styles.input}
              placeholder="Ancho [cm]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={ancho}
              onChangeText={setAncho}
            />

            <TextInput
              style={styles.input}
              placeholder="Concreto (fck) [Mpa]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={fck}
              onChangeText={setFck}
            />

            <TextInput
            style={styles.input}
            placeholder="Momento [kN·m]"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={momento}
            onChangeText={setMomento}
          />
            <TextInput
              style={styles.input}
              placeholder="Agregado + grueso [plg]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={agregado}
              onChangeText={setAgregado}
            />
          </View>

          <View style={styles.column}>
            <TextInput
                style={styles.input}
                placeholder="Cantidad de vigas"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={cantidad}
                onChangeText={setCantidad}
              />

            <TextInput
              style={styles.input}
              placeholder="Alto [cm]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={alto}
              onChangeText={setAlto}
            />

            <TextInput
              style={styles.input}
              placeholder="Acero (fyk) [Mpa]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={fyk}
              onChangeText={setFyk}
            />

            <TextInput
              style={styles.input}
              placeholder="d' [cm]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={dPrime}
              onChangeText={setDPrime}
            />
            <TextInput
              style={styles.input}
              placeholder="Campo Muerto [cm]"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={campoMuerto}
              onChangeText={setcampoMuerto}
            />

          </View>
        </View>

        {/* Agregar el Switch para determinar si el momento es positivo o negativo */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>¿Momento Positivo?</Text>
          <Switch
            value={isPositive}
            onValueChange={setIsPositive}
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCalculate}
        >
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={goToTableScreen}
        >
          <Text style={styles.buttonText}>Ver resultados</Text>
          
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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

// Datos de fierros disponibles
const fierros = [
  { diametro: 8, area: 50.2656 },
  { diametro: 10, area: 78.54 },
  { diametro: 12, area: 113.0976 },
  { diametro: 16, area: 201.0624 },
  { diametro: 20, area: 314.16 },
  { diametro: 25, area: 490.875 }
];

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

// Pantalla de Armadura
// Pantalla de Armadura
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
      <View style={styles.resultContainer}>
        <Text style={styles.title}>Combinación Óptima de Armadura</Text>
        <Text style={styles.resultText}>
          <Text style={styles.resultText2}>Armadura Inferior:</Text>
        </Text>
        {combinacionOptimaInf ? (
          <>
            <Text style={styles.resultText}>
              Fierro 1: <Text style={styles.resultText2}>{combinacionOptimaInf.fierro1.diametro} mm</Text>
            </Text>
            {combinacionOptimaInf.fierro2 && (
              <Text style={styles.resultText}>
                Fierro 2: <Text style={styles.resultText2}>{combinacionOptimaInf.fierro2.diametro} mm</Text>
              </Text>
            )}
            <Text style={styles.resultText}>
              Fierro 3: <Text style={styles.resultText2}>{combinacionOptimaInf.fierro3.diametro} mm</Text>
            </Text>
            <Text style={styles.resultText}>
              Distancia: <Text style={styles.resultText2}>{distanciaInf.toFixed(2)} cm</Text>
            </Text>
          </>
        ) : (
          <Text style={styles.resultText}>No se encontró una combinación óptima para la armadura inferior.</Text>
        )}

        <Text style={styles.resultText}>
          <Text style={styles.resultText2}>Armadura Superior:</Text>
        </Text>
        {combinacionOptimaSup ? (
          <>
            <Text style={styles.resultText}>
              Fierro 1: <Text style={styles.resultText2}>{combinacionOptimaSup.fierro1.diametro} mm</Text>
            </Text>
            {combinacionOptimaSup.fierro2 && (
              <Text style={styles.resultText}>
                Fierro 2: <Text style={styles.resultText2}>{combinacionOptimaSup.fierro2.diametro} mm</Text>
              </Text>
            )}
            <Text style={styles.resultText}>
              Fierro 3: <Text style={styles.resultText2}>{combinacionOptimaSup.fierro3.diametro} mm</Text>
            </Text>
            <Text style={styles.resultText}>
              Distancia: <Text style={styles.resultText2}>{distanciaSup.toFixed(2)} cm</Text>
            </Text>
          </>
        ) : (
          <Text style={styles.resultText}>No se encontró una combinación óptima para la armadura superior.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

  

const Stack = createStackNavigator();

// Estructura App
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#841584', // Cambia este color para el fondo del encabezado
          },
          headerTintColor: '#fff', // Cambia este color para el texto del encabezado
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Datos" component={InputScreen} />
        <Stack.Screen name="Tabla" component={TableScreen} />
        <Stack.Screen name="Armadura" component={Armadura} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E4E2',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  primaryButton: {
    backgroundColor: '#841584',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  thirdButton: {
    backgroundColor: '#841584',
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
  justifiedText: {
    textAlign: 'justify',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default App;