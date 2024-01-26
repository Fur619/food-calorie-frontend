import axios from "../AxiosCommon";

export const getUserByToken = async () => {
  try {
    return await axios.get("/users/getUserByToken", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("getUserByToken", err);
  }
};

export const getUserCalorieWarnings = async ({
  id,
  timezone,
  page = 1,
  limit = 10,
  date,
}) => {
  try {
    return await axios.get("/users/warning/calorie", {
      params: { id, page, limit, timezone, date },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("getUserByToken", err);
  }
};

export const getUserMonthlyPriceWarnings = async ({
  id,
  timezone,
  page = 1,
  limit = 10,
  date,
}) => {
  try {
    return await axios.get("/users/warning/price", {
      params: { id, page, limit, timezone, date },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("getUserByToken", err);
  }
};

export const getAllUsers = async ({ userName, limit, page = 1 }) => {
  try {
    return await axios.get("/users/allUsers", {
      params: {
        userName,
        limit,
        page,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("allUsers", err);
  }
};

export const getAllUsersReport = async ({ userId }) => {
  try {
    return await axios.get(`/users/report${userId ? `/${userId}` : ""}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("allUsers", err);
  }
};

export const createUser = async ({ userName, email }) => {
  return await axios.post(
    `/users/create`,
    {
      userName,
      email,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getUserToken = async ({ email }) => {
  try {
    return await axios.get(`/users/getUserToken`, {
      params: { email },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("allUsers", err);
  }
};

export const deleteUser = async ({ id }) => {
  try {
    return await axios.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log("deleteUser", err);
  }
};
