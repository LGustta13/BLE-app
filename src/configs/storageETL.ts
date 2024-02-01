// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ETLParse from '../hooks/useETL/parse';
// import { COLLECTION_ETL } from './database';

// export async function saveETLDataParsed(ETLData: ETLParse): Promise<void> {

//     try {
//         const data = await AsyncStorage.getItem(COLLECTION_ETL);
//         const oldData = data ? (JSON.parse(data) as ETLParse) : {};

//         await AsyncStorage.setItem(COLLECTION_ETL, JSON.stringify({
//             ...oldData,
//             ETLData
//         }))
//     } catch {
//         throw new Error("Erro ao salvar no localStorage")
//     }
// }

// export async function getETLDataParsed() : Promise<ETLParse> {
//     try {
//         const data = await AsyncStorage.getItem(COLLECTION_ETL); 
//         const ETLDataArray = data ? (JSON.parse(data) as ETLParse) : new ETLParse();
        
//         return ETLDataArray;
//     } catch{
//         throw new Error("Erro ao resgatar dados do Storage");
//     }
// }

// export async function removeETLDataParsed() : Promise<void> {
//     try {
//         await AsyncStorage.removeItem(COLLECTION_ETL);
        
//     } catch {
//         throw new Error("Erro ao remover dados do Storage")
//     }
// }