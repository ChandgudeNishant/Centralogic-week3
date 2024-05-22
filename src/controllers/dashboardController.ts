import { Request, Response } from 'express';
import Weather from '../models/weather';
import { Op } from 'sequelize';

// Define an interface for the accumulator object
interface WeatherMap {
  [key: string]: Weather;
}

export const weatherDashboard = async (req: Request, res: Response) => {
  const { city } = req.query;

  try {
    if (city) {
      const weatherData = await Weather.findAll({
        where: { city: { [Op.iLike]: `%${city}%` } },
      });

      const formattedData = weatherData.map(data => ({
        id: data.id,
        city: data.city,
        country: data.country,
        date: data.time,
        weather: data.weather,
      }));

      res.status(200).json(formattedData);
    } else {
      const allWeatherData = await Weather.findAll({
        order: [['time', 'DESC']],
      });

      const latestWeatherData = allWeatherData.reduce((acc: WeatherMap, curr: Weather) => {
        if (!acc[curr.city]) {
          acc[curr.city] = curr;
        }
        return acc;
      }, {} as WeatherMap);

      const formattedData = Object.values(latestWeatherData).map(data => ({
        id: data.id,
        city: data.city,
        country: data.country,
        date: data.time,
        weather: data.weather,
      }));

      res.status(200).json(formattedData);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Error fetching weather data');
  }
};
