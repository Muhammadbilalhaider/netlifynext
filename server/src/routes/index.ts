import { Express } from 'express';
import { authRoute } from './authRoute';
import { userRoute } from './userRoute';
import { categoriesRoute } from './categoriesRoute';
import { countryRoute } from './countryRoute';
import { stateRoute } from './stateRoute';
import { cityRoute } from './cityRoute';
import { companyRoute } from './companiesRoute';
import { technologiesRoute } from './technologiesRoute';
import { globalSettingsRoute } from './globalSettingsRoute';
import { configurationRoute } from './configurationRoute';
import { stripeRoute } from './stripeRoute';
import { dashBoardRoute } from './dashboard';
import { jobRoute } from './jobRoute';


export const configureRoutes = (app: Express): void => {

  const apiPrefix = '/api_v1';

  app.use(`${apiPrefix}/auth`, authRoute());
  app.use(`${apiPrefix}/user`, userRoute());
  app.use(`${apiPrefix}/categories`, categoriesRoute());
  app.use(`${apiPrefix}/country`, countryRoute());
  app.use(`${apiPrefix}/state`, stateRoute());
  app.use(`${apiPrefix}/city`, cityRoute());
  app.use(`${apiPrefix}/company`, companyRoute());
  app.use(`${apiPrefix}/technology`, technologiesRoute());
  app.use(`${apiPrefix}/globalSetting`, globalSettingsRoute());
  app.use(`${apiPrefix}/configuration`, configurationRoute());
  app.use(`${apiPrefix}/stripe`, stripeRoute());
  app.use(`${apiPrefix}/dashboard`, dashBoardRoute());
  app.use(`${apiPrefix}/job`, jobRoute());

};