import Home from "./src/screens/Home";
import { BLEApiProvider } from "./src/hooks/useBLE/useBLE";

const App = () => {
  
  return (
    <BLEApiProvider>
      <Home/>
    </BLEApiProvider>
  );
};

export default App;