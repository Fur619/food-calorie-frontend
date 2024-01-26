import { createContext } from "react";

export const AppContext = createContext({
  user: null,
  setUser(user) {},
  isTokenVerified: false,
  setIsTokenVerified(token) {},
  isLoading: true,
  setIsLoading(loading) {},
  noOfCalorieWarnings: 0,
  setNoOfCalorieWarnings(total) {},
  noOfPriceWarnings: 0,
  setNoOfPriceWarnings(total) {},
});
