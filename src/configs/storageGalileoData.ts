// import AsyncStorage from '@react-native-async-storage/async-storage';
// import GalileoParsePacket from '../hooks/useParsePacket/parse';
// import { COLLECTION_GALILEOSKYDATA } from './database';

// export async function saveGalileoDataParsed(galileoData: GalileoParsePacket): Promise<void> {

//     try {
//         const data = await AsyncStorage.getItem(COLLECTION_GALILEOSKYDATA);
//         const oldData = data ? (JSON.parse(data) as GalileoParsePacket) : {};

//         await AsyncStorage.setItem(COLLECTION_GALILEOSKYDATA, JSON.stringify({
//             ...oldData,
//             galileoData
//         }))
//     } catch {
//         throw new Error("Erro ao salvar no localStorage")
//     }
// }

// export async function getGalileoDataParsed() : Promise<GalileoParsePacket> {
//     try {
//         const data = await AsyncStorage.getItem(COLLECTION_GALILEOSKYDATA); 
//         const galileoDataArray = data ? (JSON.parse(data) as GalileoParsePacket) : new GalileoParsePacket();
        
//         return galileoDataArray;
//     } catch{
//         throw new Error("Erro ao resgatar dados do Storage");
//     }
// }

// export async function removeGalileoDataParsed() : Promise<void> {
//     try {
//         await AsyncStorage.removeItem(COLLECTION_GALILEOSKYDATA);
        
//     } catch {
//         throw new Error("Erro ao remover dados do Storage")
//     }
// }