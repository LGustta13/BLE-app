import { ReactNode, createContext, useContext, useState } from "react";
import { useTape } from "./useTape";

type ETLProps = {
    dentroFaixa: number;
    rolamento: number;
    paradoLigado: number;
    faixaPedal: number;
    createdAt: number;
}

type ETLApiProps = {
    etl: ETLProps
}

type StorageETLProps = {
    [id:number]: ETLProps
}

type ETLProviderProps = {
    children: ReactNode
}

const ETLApiContext = createContext<ETLApiProps>({} as ETLApiProps)

export function ETLApiProvider({children} : ETLProviderProps) {

    const [etl, setEtl] = useState<ETLProps>({
        dentroFaixa: 100,
        rolamento: 100,
        paradoLigado: 0,
        faixaPedal: 100,
        createdAt: Date.now() / 1000
    });
    const {getTape} = useTape();

    async function handleRecvETL() {

        const tapeInStore = await getTape();

        

        return 1;
    }

    return (
        <ETLApiContext.Provider value={{handleRecvETL}}>
            {children}
        </ETLApiContext.Provider>
    )
}

export function useETL() {
    const context = useContext(ETLApiContext);
    return context;
}