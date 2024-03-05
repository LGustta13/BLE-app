// Libs
import React, { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Components
import { DeviceModal } from "../../components/Modal";
import { TitleText } from "../../components/TitleText";
import { ButtonConnect } from "../../components/ButtonConnect";
import { TrackerData } from "../../components/TrackerData";

// Hooks
import { useBLE } from "../../hooks/useBLE";
import { useTape } from "../../hooks/useTape";
import { useETL } from "../../hooks/useETL";

// Styles
import { styles } from "./styles";
import { useParsePacket } from "../../hooks/useParsepacket";

const Home = () => {
  const { outParsedPkg, handleRecvPkg } = useParsePacket();

  const { handleRecvTape, deleteTape } = useTape();

  const { handleRecvETL, deleteEtl } = useETL();

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    galileoDataBuffer,
    disconnectFromDevice,
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

  const handleDeleteTape = async () => {
    await deleteTape();
    Alert.alert("FITA DE DADOS foram DELETADAS");
  };

  const handleDeleteEtl = async () => {
    await deleteEtl();
    Alert.alert("ETLs foram DELETADAS");
  };

  useEffect(() => {
    handleRecvPkg(galileoDataBuffer);
    handleRecvTape(1400, 80, 70, false);
    handleRecvETL();
  }, [galileoDataBuffer]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
        {connectedDevice ? (
          <>
            <TitleText text={"Dados do coletor"} />
            <TrackerData data={outParsedPkg} />
          </>
        ) : (
          <>
            <TitleText text={"Realize a conexão"} />
          </>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        {connectedDevice ? (
          <></>
        ) : (
          <>
            <View style={styles.deleteButtonContainer}>
              <Button
                title="Deletar Tape"
                color="red"
                onPress={handleDeleteTape}
              />
              <Button
                title=" Deletar Etl "
                color="red"
                onPress={handleDeleteEtl}
              />
            </View>
          </>
        )}

        <ButtonConnect
          textConnect="Conectar"
          textDisconnect="D"
          connectedDevice={connectedDevice}
          disconnectFromDevice={disconnectFromDevice}
          openModal={openModal}
        />
      </View>
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
