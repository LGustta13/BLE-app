import React, { FC, useCallback } from "react";
import {
    FlatList,
    ListRenderItemInfo,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Device } from "react-native-ble-plx";

import { styles } from "./styles";

type DeviceModalListItemProps = {
    item: ListRenderItemInfo<Device>;
    connectToPeripheral: (device: Device) => void;
    closeModal: () => void;
};

type DeviceModalProps = {
    devices: Device[];
    visible: boolean;
    connectToPeripheral: (device: Device) => void;
    closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
    const { item, connectToPeripheral, closeModal } = props;

    const connectAndCloseModal = useCallback(() => {
        connectToPeripheral(item.item);
        closeModal();
    }, [closeModal, connectToPeripheral, item.item]);

    return (
        <TouchableOpacity
            onPress={connectAndCloseModal}
            style={styles.ctaButton}
        >
            <Text style={styles.ctaButtonText}>{item.item.name}</Text>
            <View style={{alignItems: "center", justifyContent: "center", borderRadius: 20, width: 40, height: 40}}>
            <Text style={{color: "#FFFFFF", fontWeight: 'bold'}}>{item.item.rssi}</Text>
            </View>
            
        </TouchableOpacity>
    );
};

export const DeviceModal: FC<DeviceModalProps> = (props) => {
    const { devices, visible, connectToPeripheral, closeModal } = props;

    const renderDeviceModalListItem = useCallback(
        (item: ListRenderItemInfo<Device>) => {
            return (
                <DeviceModalListItem
                    item={item}
                    connectToPeripheral={connectToPeripheral}
                    closeModal={closeModal}
                />
            );
        },
        [closeModal, connectToPeripheral]
    );

    return (
        <Modal
            style={styles.modalContainer}
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <SafeAreaView style={styles.modalBg}>
                <Text style={styles.modalTitleText}>
                    Selecione um dispositivo
                </Text>
                <FlatList
                    contentContainerStyle={styles.modalFlatlistContainer}
                    data={devices}
                    renderItem={renderDeviceModalListItem}
                />
            </SafeAreaView>
        </Modal>
    );
};