<h1 align="center"> BLE app </h1>

<p align="center">
Aplicação que conecta dispositivos mobile no coletor de dados da GalileoSky <br/>
  
<br>

<p align="center">
  <img alt="projeto Aplicação BLE" src=".github/preview.png" width="100%">
</p>

## 🚀 Tecnologias


Esse projeto foi desenvolvido com as seguintes tecnologias:

- React Native
- Expo
- EAS
- BLE PLX (Bluetooth Low Energy)

## 💻 Projeto

A demanda surgiu como uma ideia de desenvolver uma aplicação nativa de identificação de agentes via BLE (Bluetooth Low-Energy). Dessa forma, o usuário com o aplicativo instalado no seu celular Android conseguirá se conectar via BLE com dispositivos GATT, 
sendo estes responsáveis por enviar pacotes de dados ao celular e apresentá-los em uma interface. A priori, a aplicação deve se conectar com dispositivos da Galileosky.

- Versão BETA da aplicação: [Link](https://expo.dev/accounts/ble-user-gustavo/projects/expo-ble-darwin/builds/c79fbe0b-f4b0-4a18-a9f0-939d202825b2)
- Documentação Galileosky sobre BLE: [Link](https://base.galileosky.com/articles/#!en-documentation/developing-a-mobile-app-for-interacting-with-galileosky-tracking-devices-via-bluetooth/q/bluetooth/qid/13193/qp/4)
- Documentação protocolo Galileosky: [Link](https://base.galileosky.com/articles/#!en-documentation/galileosky-protocol/a/h2_1310565463)
- Github lib RN BLE plx: [Link](https://github.com/dotintent/react-native-ble-plx)
- Documentação lib RN BLE plx: [Link](https://github.com/dotintent/react-native-ble-plx)
  
## 🔖 Layout
  
O Layout pode ser encontrado no Figma por meio do seguinte [Link](https://www.figma.com/file/qgwWujNtdWrZmuNFNuFTFb/BLE-app?type=design&node-id=0%3A1&mode=design&t=t6wQ9OR9xSsCDwY5-1)

## ⏯️ Testes
- Versão Android: 5+
- Versão Expo: 49
- Versão react-Native: 72
- Firmware Galileosky: 38

## 🧮 Execução


## 🧰 Configurações

### Novo projeto

Utilizando Expo
```
npx create-expo-app -t expo-template-blank-typescript expo-ble-darwin
npx expo install react-native-ble-plx @config-plugins/react-native-ble-plx
npx expo install expo-device react-native-base64
```

Instalando o EAS para build
```
npx npm install eas-cli
npx expo install expo-dev-client
```

Adicionar o seguinte plugin no arquivo _app.json_
```
"plugins": [
      [
        "@config-plugins/react-native-ble-plx",
        {
          "isBackgroundEnabled": true,
          "modes": [
            "peripheral",
            "central"
          ],
          "bluetoothAlwaysPermission": "Allow $(PRODUCT_NAME) to connect to bluetooth devices"
        }
      ],
],
```

Adicionar o seguinte snippet no arquivo _eas.json_
```
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

Gerar as pastas nativas Android e IOS e validar os plugins.
Dessa forma, as permissões são inseridas no AndroidManifest.xml e info.plist.
```
npx expo prebuild
```

Gerar uma versão de build de desenvolvimento para ser usada em emuladores ou dispositivos físicos.
Retorna o QRCode para leitura.
```
npx expo run:android
ou
npx expo run:ios
```

Gerar um servidor de desenvolvimento para ser baixado em dispositivos físicos.
Assim é possível rodar a build de desenvolvimento gerada e ler o QRCode.
```
eas build --profile development --platform android
ou
eas build --profile development --platform ios
```

---

