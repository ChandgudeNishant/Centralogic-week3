import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres://postgres:Nishant@123@localhost:5432/weatherdb');

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
