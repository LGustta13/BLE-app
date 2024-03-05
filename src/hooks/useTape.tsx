import { useContext, createContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLLECTION_TAPE } from "../configs/database";

type TapeProps = {
    dentroFaixa: boolean;
    rolamento: boolean;
    paradoLigado: boolean;
    faixaPedal: boolean;
    createdAt: number;
}

type StorageTapeProps = {
    [id: number]: TapeProps
}

type TapeProviderProps = {
    children: ReactNode;
}

type TapeApiProps = {
    handleRecvTape: (
        rpm: number, 
        velocidade: number, 
        pedal: number, 
        piloto: boolean) => void;
    getTape: () => Promise<StorageTapeProps>;
    deleteTape: () => Promise<void>
}

const MAX_RPM_FAIXA = 1500;
const MIN_VELOCIDADE_FAIXA = 5;
const MIN_VELOCIDADE_ROLAMENTO = 10;
const MIN_RPM_ROLAMENTO = 700;
const MIN_RPM_PARADO = 480;
const MIN_PEDAL = 60;
const MAX_PEDAL = 99;

const TapeApiContext = createContext<TapeApiProps>({} as TapeApiProps)

export function TapeApiProvider({children} : TapeProviderProps) {

    async function storeTape(tapeToStore: TapeProps) : Promise<void> {
        try{
            const tapeInStore = await AsyncStorage.getItem(COLLECTION_TAPE)
            const tapeInStoreObject = tapeInStore ? (JSON.parse(tapeInStore) as StorageTapeProps) : ({})

            const newTapeToStore = {
                [tapeToStore.createdAt]: tapeToStore
            }

            await AsyncStorage.setItem(COLLECTION_TAPE, JSON.stringify({
                ...tapeInStoreObject,
                ...newTapeToStore
            }))
        } catch(error) {
            throw error;
        }
    }

    async function getTape() : Promise<StorageTapeProps> {
        try {
            const tapeInStore = await AsyncStorage.getItem(COLLECTION_TAPE)
            const tapeInStoreObject = tapeInStore ? (JSON.parse(tapeInStore) as StorageTapeProps) : ({})

            return tapeInStoreObject
        } catch(error){
            throw error;
        }
    }

    async function deleteTape() : Promise<void> {
        try {
            await AsyncStorage.removeItem(COLLECTION_TAPE); 
         } catch (error) {
             throw error;
         }
    }

    async function handleRecvTape(rpm: number, velocidade: number, pedal: number, piloto: boolean) {

        const newTape = {
            dentroFaixa: (pedal > 0 && rpm < 1800 && velocidade > 5) ? true : false,
            rolamento: (pedal > 0 && rpm >= 700 && velocidade > 10 && !piloto) ? true : false,
            paradoLigado: (rpm > 480 && velocidade == 0) ? true : false,
            faixaPedal: (pedal > 60 && pedal < 99) ? true : false,
            createdAt: Date.now(),
          }

        // createdAt: Math.floor(Date.now() / 1000)

        await storeTape(newTape);
    }

    return (
        <TapeApiContext.Provider value = {{handleRecvTape, getTape, deleteTape}}>
            {children}
        </TapeApiContext.Provider>
    )
}

export function useTape(){
    const context = useContext(TapeApiContext);
    return context;
}

