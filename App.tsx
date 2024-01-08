import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import { useBLE, useParsepacket } from "./src/hooks";

const App = () => {
  const { handleRecvPkg, outParsedPkg } = useParsepacket();
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    galileoDataBuffer,
    disconnectFromDevice,
    size,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (galileoDataBuffer.length > 4) {
      const galileoPktSize = galileoDataBuffer.readUInt16LE(5)
      if (galileoPktSize === (size - 9)) {
        handleRecvPkg(galileoDataBuffer);
      }
    }
  }, [size])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text>Galileosky BLE</Text>
            <Text style={styles.heartRateTitleText}>Dados do coletor</Text>
            {
              outParsedPkg.imei ? (<Text style={styles.heartRateTitleTextSnd}>{outParsedPkg.imei}</Text>) :
              (<Text>...</Text>)
            }
            
            <Text style={styles.heartRateText}>{galileoDataBuffer}</Text>
            {/*<Text style={styles.heartRateText}>TAMANHO: {size}</Text> */}
            <Text style={styles.heartRateText}>FIRMWARE: {outParsedPkg.firmwareVersion}</Text>
            {/* <Text style={styles.heartRateText}>HARDWARE: {outParsedPkg.hardwareVersion}</Text> */}
            {/* <Text style={styles.heartRateText}>RECEIVED: {outParsedPkg.receivedTimestamp}</Text>
            <Text style={styles.heartRateText}>NAVIGATION: {outParsedPkg.navigationTimestamp}</Text> */}
            <Text style={styles.heartRateText}>LATITUDE: {outParsedPkg.latitude}</Text>
            <Text style={styles.heartRateText}>LONGITUDE: {outParsedPkg.longitude}</Text>
            {/* <Text style={styles.heartRateText}>BATERIA: {outParsedPkg.batteryVoltage}</Text>
            <Text style={styles.heartRateText}>FONTE: {outParsedPkg.supplyVoltage}</Text>
            <Text style={styles.heartRateText}>ALTITUDE: {outParsedPkg.height}</Text>
            <Text style={styles.heartRateText}>HDOP: {outParsedPkg.hdop}</Text>
          <Text style={styles.heartRateText}>TEMPERATURA: {outParsedPkg.temperature}</Text>*/}
            <Text style={styles.heartRateText}>VELOCIDADE: {outParsedPkg.speed} Km/h</Text>
            {/*<Text style={styles.heartRateText}>PACOTE: {outParsedPkg.packetID}</Text>
            <Text style={styles.heartRateText}>ENTRADA 3: {outParsedPkg.inputVoltage3}</Text> */}
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Conecte a um Galileo
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Desconectar" : "Conectar"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateTitleTextSnd: {
    fontSize: 20, 
    marginTop: 5,
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
  },
  heartRateText: {
    fontSize: 12,
    marginTop: 15,
    marginHorizontal: 10,
    display: 'flex',
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;