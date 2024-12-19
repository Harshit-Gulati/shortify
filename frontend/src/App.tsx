import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing.tsx";
import { Stats } from "./pages/Stats.tsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}
