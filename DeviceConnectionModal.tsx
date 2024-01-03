import React, { FC, useCallback } from "react";
import {
    FlatList,
    ListRenderItemInfo,
    Modal,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Device } from "react-native-ble-plx";

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
            style={modalStyle.ctaButton}
        >
            <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
            <View style={{alignItems: "center", justifyContent: "center" ,backgroundColor: 'white', borderRadius: 20, width: 40, height: 40}}>
            <Text style={{color: "#FF6060", fontWeight: 'bold'}}>{item.item.rssi}</Text>
            </View>
            
        </TouchableOpacity>
    );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
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
            style={modalStyle.modalContainer}
            animationType="slide"
            transparent={false}
            visible={visible}
        >
            <SafeAreaView style={modalStyle.modalTitle}>
                <Text style={modalStyle.modalTitleText}>
                    Selecione um dispositivo
                </Text>
                <FlatList
                    contentContainerStyle={modalStyle.modalFlatlistContainer}
                    data={devices}
                    renderItem={renderDeviceModalListItem}
                />
            </SafeAreaView>
        </Modal>
    );
};

const modalStyle = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    modalFlatlistContainer: {
        flex: 1,
        justifyContent: "center",
    },
    modalCellOutline: {
        borderWidth: 1,
        borderColor: "black",
        alignItems: "center",
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
    },
    modalTitle: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    modalTitleText: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: "bold",
        marginHorizontal: 20,
        textAlign: "center",
    },
    ctaButton: {
        flexDirection: 'row',
        backgroundColor: "#FF6060",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        paddingHorizontal: 12,
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

export default DeviceModal;