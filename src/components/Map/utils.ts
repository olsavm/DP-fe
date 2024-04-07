import banikov from "../../../assets/geodata/slovakia/banikov.json";
import baranec from "../../../assets/geodata/slovakia/baranec.json";
import bradavica from "../../../assets/geodata/slovakia/bradavica.json";
import chopok from "../../../assets/geodata/slovakia/chopok.json";
import derese from "../../../assets/geodata/slovakia/derese.json";
import divaVeza from "../../../assets/geodata/slovakia/diva-veza.json";
import dumbier from "../../../assets/geodata/slovakia/dumbier.json";
import gerlach from "../../../assets/geodata/slovakia/gerlach.json";
import hrubaKopa from "../../../assets/geodata/slovakia/hruba-kopa.json";
import hrubaVeza from "../../../assets/geodata/slovakia/hruba-veza.json";
import jalovskaKopa from "../../../assets/geodata/slovakia/jalovska-kopa.json";
import javovovyStit from "../../../assets/geodata/slovakia/javorovy-stit.json";
import kondratovaKopa from "../../../assets/geodata/slovakia/kondratova-kopa.json";
import krivan from "../../../assets/geodata/slovakia/krivan.json";
import ladovyStit from "../../../assets/geodata/slovakia/ladovy-stit.json";
import lomnickyStit from "../../../assets/geodata/slovakia/lomnicky-stit.json";
import ostryRohac from "../../../assets/geodata/slovakia/ostry-rohac.json";
import placlivo from "../../../assets/geodata/slovakia/placlivo.json";
import proslop from "../../../assets/geodata/slovakia/prislop.json";
import prostrednyHrot from "../../../assets/geodata/slovakia/prostredny-hrot.json";
import slavkovskyStit from "../../../assets/geodata/slovakia/slavkovsky-stit.json";
import velickyStit from "../../../assets/geodata/slovakia/velicky-stit.json";
import vychodnaVysoka from "../../../assets/geodata/slovakia/vychodna-vysoka.json";
import { Feature } from "../../types/types";
import { fetchWeatherApi } from "openmeteo";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export const getWeatherData = async (latitude: number, longitude: number) => {
  const params = {
    latitude,
    longitude,
    current: [
      "rain",
      "snowfall",
      "cloud_cover",
      "wind_speed_10m",
      "wind_direction_10m",
    ],
    hourly: ["temperature_2m", "snow_depth"],
    daily: ["uv_index_max", "snowfall_sum"],
    timezone: "Europe/Berlin",
  };
  return await fetchWeatherApi(WEATHER_API_URL, params);
};

export const getGeoData = (): Feature[] => {
  const res = [];
  res.push(banikov);
  res.push(baranec);
  res.push(bradavica);
  res.push(chopok);
  res.push(derese);
  res.push(divaVeza);
  res.push(dumbier);
  res.push(gerlach);
  res.push(hrubaKopa);
  res.push(hrubaVeza);
  res.push(jalovskaKopa);
  res.push(javovovyStit);
  res.push(kondratovaKopa);
  res.push(krivan);
  res.push(ladovyStit);
  res.push(lomnickyStit);
  res.push(ostryRohac);
  res.push(placlivo);
  res.push(proslop);
  res.push(prostrednyHrot);
  res.push(slavkovskyStit);
  res.push(velickyStit);
  res.push(vychodnaVysoka);

  return res;
};
