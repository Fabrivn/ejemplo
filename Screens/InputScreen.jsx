import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Keyboard, SafeAreaView, TouchableOpacity, FlatList, Button, StyleSheet, Switch, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

                <TouchableOpacity style={styles.switchButton} activeOpacity={0.8}>
                    <Text style={styles.switchLabel}>Momento Signo Positivo</Text>
                    <Switch
                        value={isPositive}
                        onValueChange={setIsPositive}
                        trackColor={{ false: '#FFFFFF', true: '#040720' }}
                        thumbColor={isPositive ? '#FFFFFF' : '#040720'} 
                    />
                </TouchableOpacity>

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E4E2',
    },
    innerContainer: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
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
    switchButton: {
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        color: '#fff',
    },
    primaryButton: {
        backgroundColor: '#040720',
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default InputScreen;