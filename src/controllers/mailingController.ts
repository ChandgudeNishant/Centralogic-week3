import { Request, Response } from 'express';
import { transporter } from '../utils/mailer';
import Weather from '../models/weather';
import { Op } from 'sequelize';

export const mailWeatherData = async (req: Request, res: Response) => {
  const cities = req.body;

  try {
    const weatherDataPromises = cities.map(async (city: { city: any; }) => {
      return await Weather.findOne({
        where: { city: { [Op.iLike]: city.city } },
        order: [['time', 'DESC']],
      });
    });

    const weatherData = await Promise.all(weatherDataPromises);

    // Filter out null values (if any city data is not found)
    const filteredData = weatherData.filter((data) => data !== null);

    // Create email content
    const emailContent = `
      <h2>Weather Data</h2>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>City</th>
            <th>Country</th>
            <th>Date</th>
            <th>Weather</th>
          </tr>
        </thead>
        <tbody>
          ${filteredData
            .map(
              (data) => `
            <tr>
              <td>${data.id}</td>
              <td>${data.city}</td>
              <td>${data.country}</td>
              <td>${data.time}</td>
              <td>${data.weather}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    // Send email
    await transporter.sendMail({
      from: '"Weather App" nishantchandgude0@gmail.com', // Replace with your email
      to: 'macrex6273@gmail.com', // Replace with recipient's email
      subject: 'Weather Data',
      html: emailContent,
    });

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
};
