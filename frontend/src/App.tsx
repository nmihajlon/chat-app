import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={ theme }>
      <Navbar />
      <main>
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
};

export default App;
