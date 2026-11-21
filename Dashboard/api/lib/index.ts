
import App from './app';
import ConfigController from './controllers/config.controller';
import WeatherController from './controllers/weather.controller';
import AuthController from './controllers/auth.controller';
import IndexController from './controllers/index.controller';

const app = new App([
    new AuthController(),
    new WeatherController(),
    new ConfigController(),
    new IndexController(),
]);

app.listen();
