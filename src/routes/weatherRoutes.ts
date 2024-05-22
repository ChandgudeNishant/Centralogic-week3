import { Router } from 'express';
import { saveWeatherMapping } from '../controllers/weatherController';
import { weatherDashboard } from '../controllers/dashboardController';
import { mailWeatherData } from '../controllers/mailingController';

const router = Router();

router.post('/api/SaveWeatherMapping', saveWeatherMapping);
router.get('/api/weatherDashboard', weatherDashboard);
router.post('/api/mailWeatherData', mailWeatherData);

export default router;
