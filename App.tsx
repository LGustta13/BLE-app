import Home from "./src/screens/Home";
import { BLEApiProvider } from "./src/hooks/useBLE/useBLE";
import { ParsePacketApiProvider } from "./src/hooks/useParsePacket/useParsePacket";

const App = () => {

  return (
    <BLEApiProvider>
      <ParsePacketApiProvider>
        <Home />
      </ParsePacketApiProvider>
    </BLEApiProvider>
  );
};

export default App;