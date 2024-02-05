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

type TapeApiProps = {
    handleRecvTape: (
        rpm: number, 
        velocidade: number, 
        pedal: number, 
        piloto: boolean) => void;
}

type StorageTapeProps = {
    [id: number]: TapeProps
}

type TapeProviderProps = {
    children: ReactNode;
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

    async function storeTape(dataToStore: TapeProps) : Promise<void> {
        try{
            const dataInStore = await AsyncStorage.getItem(COLLECTION_TAPE)
            const dataInStoreObject = dataInStore ? (JSON.parse(dataInStore) as StorageTapeProps) : ({})

            const newDataToStore = {
                [dataToStore.createdAt]: dataToStore
            }

            await AsyncStorage.setItem(COLLECTION_TAPE, JSON.stringify({
                ...dataInStoreObject,
                ...newDataToStore
            }))
        } catch(error) {
            throw error;
        }
    }

    async function getTape() : Promise<StorageTapeProps> {
        try {
            const dataInStore = await AsyncStorage.getItem(COLLECTION_TAPE)
            const dataInStoreObject = dataInStore ? (JSON.parse(dataInStore) as StorageTapeProps) : ({})

            return dataInStoreObject
        } catch(error){
            throw error;
        }
    }

    async function handleRecvTape(rpm: number, velocidade: number, pedal: number, piloto: boolean) {
        let dentroFaixa = false;
        let rolamento = false;
        let paradoLigado = false;
        let faixaPedal = false;

        if (rpm > MAX_RPM_FAIXA && velocidade > MIN_VELOCIDADE_FAIXA && pedal > MIN_POS_PEDAL){
            dentroFaixa = true;
        }

        if (rpm >= MIN_RPM_ROLAMENTO && velocidade >MIN_VELOCIDADE_ROLAMENTO && pedal == 0 && !piloto) {
            rolamento = true;
        }

        if (rpm > MIN_RPM_PARADO && velocidade == 0) {
            paradoLigado = true
        }

        if (pedal >= MIN_PEDAL && pedal <= MAX_PEDAL) {
            faixaPedal = true
        }

        const tape = {
            dentroFaixa,
            rolamento,
            paradoLigado,
            faixaPedal,
            createdAt: Math.floor(Date.now() / 1000)
        }

        await storeTape(tape);
    }

    return (
        <TapeApiContext.Provider value = {{handleRecvTape}}>
            {children}
        </TapeApiContext.Provider>
    )
}

export function useTape(){
    const context = useContext(TapeApiContext);
    return context;
}

