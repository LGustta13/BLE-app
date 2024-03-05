import Home from "./src/screens/Home";
import { BLEApiProvider } from "./src/hooks/useBLE";
import { ParsePacketApiProvider } from "./src/hooks/useParsepacket";
import { TapeApiProvider } from "./src/hooks/useTape";
import { ETLApiProvider } from "./src/hooks/useETL";

const App = () => {

  return (
    <BLEApiProvider>
      <ParsePacketApiProvider>
        <TapeApiProvider>
          <ETLApiProvider>
            <Home />
          </ETLApiProvider>
        </TapeApiProvider>
      </ParsePacketApiProvider>
    </BLEApiProvider>
  );
};

export default App;