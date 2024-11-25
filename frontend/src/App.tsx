import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import AuthPage from "@/pages/auth";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<AuthPage />} path="/auth" />
    </Routes>
  );
}

export default App;
