// Libs
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Components
import { DeviceModal } from "../../components/Modal";
import { TitleText } from "../../components/TitleText";
import { ButtonConnect } from "../../components/ButtonConnect";
import { TrackerData } from "../../components/TrackerData";

// Hooks
import { useBLE } from "../../hooks/useBLE/useBLE";

// Styles
import { styles } from "./styles";
import useParsepacket from "../../hooks/useParsepacket/useParsepacket";

const Home = () => {
  const { handleRecvPkg, outParsedPkg } = useParsepacket();

  const {requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    galileoDataBuffer,
    disconnectFromDevice} = useBLE();
    
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
    handleRecvPkg(galileoDataBuffer)
  }, [galileoDataBuffer])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
        {connectedDevice ? (
          <>
            <TitleText text={"Dados do coletor"} />
            <TrackerData data={outParsedPkg}/>
          </>
        ) : (
          <TitleText text={"Realize a conexão"} />
        )}
      </View>
      <ButtonConnect
        textConnect="Conectar"
        textDisconnect="D"
        connectedDevice={connectedDevice}
        disconnectFromDevice={disconnectFromDevice}
        openModal={openModal}
      />
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

export default Home;