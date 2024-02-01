type ExtractTransformLoadApi = {
    foraFaixa: (rpm : number, velocidade: number, pedal: number) => boolean;
    foraRolamento: (rpm: number, velocidade: number, pedal: number, piloto: boolean) => boolean;
    paradoLigado: (rpm: number, velocidade: number, pedal: number, piloto: boolean) => boolean;
}

const MAX_RPM_FAIXA = 1000;
const MIN_VELOCIDADE_FAIXA = 5;
const MIN_POS_PEDAL = 0;
const MIN_VELOCIDADE_ROLAMENTO = 10;
const MIN_RPM_ROLAMENTO = 700;
const MIN_RPM_PARADO = 480;
const MIN_VELOCIDADE_PARADO = 0;

function useETL() : ExtractTransformLoadApi {

    const foraFaixa = (rpm : number, velocidade: number, pedal: number) => {
        let estado = false;

        if(rpm > MAX_RPM_FAIXA && velocidade > MIN_VELOCIDADE_FAIXA && pedal > MIN_POS_PEDAL){
            estado = true;
        }

        return estado;
    }

    const foraRolamento = (rpm: number, velocidade: number, pedal: number, piloto: boolean) => {
        let estado = false;

        if(rpm > MIN_RPM_ROLAMENTO && velocidade > MIN_VELOCIDADE_ROLAMENTO && pedal > MIN_POS_PEDAL && piloto == false){
            estado = true;
        }

        return estado;
    }

    const paradoLigado = (rpm: number, velocidade: number) => {
        let estado = false;

        if(rpm > MIN_RPM_PARADO && velocidade > MIN_VELOCIDADE_PARADO){
            estado = true;
        }

        return estado;
    }

    return {
        foraFaixa,
        foraRolamento,
        paradoLigado,
    }
}