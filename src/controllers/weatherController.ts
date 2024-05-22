import axios from 'axios';
import { Request, Response } from 'express';
import Weather from '../models/weather';
import dotenv from 'dotenv';

dotenv.config();

const geoCodingApiUrl = 'https://api.api-ninjas.com/v1/geocoding';
const weatherApiUrl = 'https://weatherapi-com.p.rapidapi.com/current.json';
const weatherApiKey = process.env.RAPIDAPI_KEY;
const geoCodingApiKey = process.env.GEOCODING_API_KEY;

export const saveWeatherMapping = async (req: Request, res: Response) => {
  const cities = req.body;
  const results = [];

  for (const city of cities) {
    try {

      // GeoCoding API request
      const geoResponse = await axios.get(geoCodingApiUrl, {
        params: { city: city.city, country: city.country },
        headers: { 'X-Api-Key': geoCodingApiKey },
      });

      if (geoResponse.status !== 200) {
        console.error(`GeoCoding API error for ${city.city}: ${geoResponse.statusText}`);
        res.status(geoResponse.status).send(`Error fetching geocoding data for ${city.city}`);
        return;
      }

      const coordinates = geoResponse.data[0];

      // Weather API request
      const weatherResponse = await axios.get(weatherApiUrl, {
        params: { q: `${coordinates.latitude},${coordinates.longitude}` },
        headers: {
          'X-RapidAPI-Key': weatherApiKey,
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
        },
      });

      if (weatherResponse.status !== 200) {
        console.error(`Weather API error for ${city.city}: ${weatherResponse.statusText}`);
        res.status(weatherResponse.status).send(`Error fetching weather data for ${city.city}`);
        return;
      }

      const weatherData = weatherResponse.data.current;
      const newWeather = await Weather.create({
        city: city.city,
        country: city.country,
        weather: weatherData.condition.text,
        time: new Date(),
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
      });

      results.push(newWeather);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Axios error fetching data for ${city.city}:`, error.response?.data || error.message);
      } else {
        console.error(`Unknown error fetching data for ${city.city}:`, error);
      }
      res.status(500).send(`Error fetching weather data for ${city.city}`);
      return;
    }
  }

  res.status(200).json(results);
};
