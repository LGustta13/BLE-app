import Home from "./src/screens/Home";
import { BLEApiProvider } from "./src/hooks/useBLE";
import { ParsePacketApiProvider } from "./src/hooks/useParsepacket";

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