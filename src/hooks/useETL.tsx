import { ReactNode, createContext, useContext, useState } from "react";
import { useTape } from "./useTape";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLLECTION_ETL } from "../configs/database";

type ETLProps = {
  dentroFaixa: IndicatorProps;
  rolamento: IndicatorProps;
  paradoLigado: IndicatorProps;
  faixaPedal: IndicatorProps;
  createdAt: IndicatorProps;
};

type IndicatorProps = {
  value: number;
  color: string;
};

type StorageETLProps = {
  [id: number]: ETLProps;
};

type ETLApiProps = {
  etl: ETLProps;
  handleRecvETL: () => Promise<void>;
  deleteEtl: () => Promise<void>;
};

type ETLProviderProps = {
  children: ReactNode;
};

type TapeProps = {
  dentroFaixa: boolean;
  rolamento: boolean;
  paradoLigado: boolean;
  faixaPedal: boolean;
  createdAt: number;
};

const ETLApiContext = createContext<ETLApiProps>({} as ETLApiProps);

export function ETLApiProvider({ children }: ETLProviderProps) {
  const [etl, setEtl] = useState<ETLProps>({
    dentroFaixa: { value: 100, color: "green" },
    rolamento: { value: 100, color: "green" },
    paradoLigado: { value: 0, color: "green" },
    faixaPedal: { value: 100, color: "green" },
    createdAt: { value: Date.now(), color: "#f7a" },
  });

  const { getTape } = useTape();

  async function storeEtl(etlToStore: ETLProps): Promise<void> {
    try {
      const etlInStore = await AsyncStorage.getItem(COLLECTION_ETL);
      const etlInStoreObject = etlInStore
        ? (JSON.parse(etlInStore) as StorageETLProps)
        : {};

      const newetlToStore = {
        [etlToStore.createdAt.value]: etlToStore,
      };

      await AsyncStorage.setItem(
        COLLECTION_ETL,
        JSON.stringify({
          ...etlInStoreObject,
          ...newetlToStore,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  async function getEtl(): Promise<StorageETLProps> {
    try {
      const etlInStore = await AsyncStorage.getItem(COLLECTION_ETL);
      const etlInStoreObject = etlInStore
        ? (JSON.parse(etlInStore) as StorageETLProps)
        : {};

      return etlInStoreObject;
    } catch (error) {
      throw error;
    }
  }

  async function deleteEtl() : Promise<void> {
    try {
      await AsyncStorage.removeItem(COLLECTION_ETL);
    } catch (error) {
      throw error;
    }
  }

  async function handleRecvETL() {
    const tapeInStore = await getTape();

    const tapeObjectValues = Object.values(tapeInStore);

    const callback = (acumulador: ETLProps, valor: TapeProps) => {
      acumulador.dentroFaixa.value += Number(valor.dentroFaixa);
      acumulador.faixaPedal.value += Number(valor.faixaPedal);
      acumulador.paradoLigado.value += Number(valor.paradoLigado);
      acumulador.rolamento.value += Number(valor.rolamento);
      return acumulador;
    };

    const etlAux: ETLProps = {
      dentroFaixa: { value: 1, color: "red" },
      rolamento: { value: 1, color: "red" },
      paradoLigado: { value: 0, color: "red" },
      faixaPedal: { value: 1, color: "red" },
      createdAt: { value: Date.now(), color: "#f7a" },
    };

    let newEtl = tapeObjectValues.reduce(callback, etlAux);
    newEtl.dentroFaixa.value = Math.round(
      (newEtl.dentroFaixa.value * 100) / (tapeObjectValues.length + 1)
    );
    newEtl.faixaPedal.value = Math.round(
      (newEtl.faixaPedal.value * 100) / (tapeObjectValues.length + 1)
    );
    newEtl.paradoLigado.value = Math.round(
      (newEtl.paradoLigado.value * 100) / (tapeObjectValues.length + 1)
    );
    newEtl.rolamento.value = Math.round(
      (newEtl.rolamento.value * 100) / (tapeObjectValues.length + 1)
    );

    newEtl.dentroFaixa.color =
      newEtl.dentroFaixa.value < 89.99
        ? "red"
        : newEtl.dentroFaixa.value < 90
        ? "yellow"
        : "green";
    newEtl.faixaPedal.color =
      newEtl.faixaPedal.value < 69.99
        ? "red"
        : newEtl.faixaPedal.value < 79.99
        ? "yellow"
        : "green";
    newEtl.paradoLigado.color =
      newEtl.paradoLigado.value > 8
        ? "red"
        : newEtl.paradoLigado.value > 5
        ? "yellow"
        : "green";
    newEtl.rolamento.color =
      newEtl.rolamento.value < 29.99
        ? "red"
        : newEtl.rolamento.value < 31.99
        ? "yellow"
        : "green";

    setEtl(newEtl);
    storeEtl(newEtl);
  }

  return (
    <ETLApiContext.Provider value={{ etl, handleRecvETL, deleteEtl}}>
      {children}
    </ETLApiContext.Provider>
  );
}

export function useETL() {
  const context = useContext(ETLApiContext);
  return context;
}
