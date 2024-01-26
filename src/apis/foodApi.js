import axios from "../AxiosCommon";

export const createFoodEntry = async ({
  userId,
  foodName,
  Calorie,
  dateTaken,
  price,
  timezone,
}) => {
  try {
    return await axios.post(
      "/foodEntry/create",
      {
        userId,
        foodName,
        Calorie,
        dateTaken,
        price,
        timezone,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.log("getUserByToken", err);
  }
};

export const updateFoodEntry = async ({
  userId,
  foodName,
  Calorie,
  dateTaken,
  price,
  timezone,
  foodId,
}) => {
  try {
    return await axios.put(
      `/foodEntry/${foodId}`,
      {
        userId,
        foodName,
        Calorie,
        dateTaken,
        price,
        timezone,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.log("getUserByToken", err);
  }
};

export const getFoodEntries = async ({
  userId,
  limit = 20,
  page = 1,
  startDate,
  endDate,
  role,
  populateUser,
}) => {
  try {
    return await axios.get("/foodEntry/user", {
      params: { userId, limit, page, startDate, endDate, role, populateUser },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("getFoodEntries", err);
  }
};

export const getUserFoodEntriesDays = async ({
  userId,
  limit = 20,
  page = 1,
  timezone,
  startDate,
  endDate,
  role,
}) => {
  try {
    return await axios.get("/foodEntry/user/days", {
      params: { userId, limit, page, timezone, startDate, endDate, role },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("getFoodEntries", err);
  }
};

export const deleteFoodEntry = async ({ id }) => {
  try {
    return await axios.delete(`/foodEntry/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("getFoodEntries", err);
  }
};
