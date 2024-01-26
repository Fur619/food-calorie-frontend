import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../context";

import { getUserByToken } from "../apis/userApi";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser, isTokenVerified, setIsLoading, setIsTokenVerified } =
    useContext(AppContext);

  const callApi = async () => {
    try {
      if (!user && localStorage.getItem("token")) {
        setIsLoading(true);
        const { data } = await getUserByToken();
        if (data) {
          setUser(data);
          setIsTokenVerified(true);
          if (
            window.location.pathname === "/warnings" &&
            data.userRole === "User"
          )
            navigate(window.location.pathname);
          else if (
            (window.location.pathname === "/report" ||
              window.location.pathname === "/users") &&
            data.userRole === "Admin"
          ) {
            navigate(window.location.pathname);
          } else navigate("/home");
        }
      } else if (!user) {
        navigate("/");
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    callApi();
  }, [isTokenVerified, user]);

  return <div>{children}</div>;
};

export default MainLayout;
