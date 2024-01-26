import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import { AppContext } from "./context";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import Authenticate from "./pages/Landing";
import Report from "./pages/Report/Report";
import AllUsers from "./pages/Users/AllUsers";
import AllWarnings from "./pages/Warning/AllWarnings";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [noOfCalorieWarnings, setNoOfCalorieWarnings] = useState(0);
  const [noOfPriceWarnings, setNoOfPriceWarnings] = useState(0);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        isTokenVerified,
        noOfPriceWarnings,
        noOfCalorieWarnings,
        setUser,
        setIsLoading,
        setIsTokenVerified,
        setNoOfPriceWarnings,
        setNoOfCalorieWarnings,
      }}
    >
      <BrowserRouter>
        <MainLayout>
          <Header />
          <Routes>
            <Route path={`/home`} element={<Home />} />
            {user?.userRole === "User" && (
              <Route path={`/warnings`} element={<AllWarnings />} />
            )}
            {user?.userRole === "Admin" && (
              <Route path={`/report`} element={<Report />} />
            )}
            {user?.userRole === "Admin" && (
              <Route path={`/users`} element={<AllUsers />} />
            )}
            <Route path={`/`} element={<Authenticate />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
