import axios from "axios";

const BASE_POST_HEADERS = {
  "Content-Type": "application/json",
};

const weatherApiCache = {};

const weatherApi = axios.create({
  baseURL: "https://api.open-meteo.com/v1/forecast",
});

const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://skialpp.fly.dev",
});

export const fetchWeather = async (latitude: number, longitude: number) => {
  const URL = `?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,cloud_cover,wind_speed_10m&hourly=temperature_2m,snow_depth&daily=snowfall_sum`;
  const { data } = await weatherApi.get(URL);
  return data;
};

export const test = async () => {
  const { data } = await api.get("users/protected");
  return data;
};

export const logout = async () => {
  const { data } = await api.get("users/logout");
  return data;
};

export const login = async (user: { password: string; username: string }) => {
  const { data } = await api.post(
    "users/login",
    {
      username: user.username,
      password: user.password,
    },
    {
      headers: BASE_POST_HEADERS,
    },
  );

  return data;
};

export const getAllRecords = async (userId: string) => {
  const { data } = await api.get(`records/${userId}`);
  return data;
};

export const getRecord = async (recordId: string) => {
  const { data } = await api.get(`records/single/${recordId}`);
  return data;
};

export const saveRecord = async ({
  trackJson,
  userId,
  startDate,
  endDate,
  distanceTravelled,
}: {
  trackJson: string;
  userId: string;
  startDate: string;
  endDate: string;
  distanceTravelled: number;
}) => {
  const { data } = await api.post(
    "records",
    {
      trackJson,
      userId,
      startDate,
      endDate,
      distanceTravelled,
    },
    {
      headers: BASE_POST_HEADERS,
    },
  );

  return data;
};
