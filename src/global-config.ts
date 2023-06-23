import { ConfigModule } from '@nestjs/config';

let configPath: string;

switch (process.env.NODE_ENV) {
  case 'prod':
    configPath = '.env.prod';
    break;
  case 'dev':
    configPath = '.env.dev';
    break;
  default:
    configPath = '.env';
    break;
}

ConfigModule.forRoot({
  envFilePath: configPath,
});


const checkEnvironmentFor = (variable: string) => {
  if (process.env.hasOwnProperty(variable)) return process.env[variable];

  throw `MISSING ${variable} VARIABLE IN PROCESS ENVIRONMENT`;
};

//Уровень запуска окружения(production, development)
export const NODE_ENV = process.env.NODE_ENV;
 //Порт приложения
export const PORT = Number(checkEnvironmentFor('PORT'));

/**
 * Уровень логгирования.
 * Если установить уровень debug - будут выводиться уровни:
 *   VERBOSE(Синий, отвечает за сетевое взаимодействие),
 *   DEBUG(Розовый, все что качается вычислений),
 *   LOG(Зеленый, запуск приложения и синхронизация кэшированных тегов с БД),
 *   ERROR
 *   WARN.
 * По умолчанию стоит уровень default, включающий только LOG, ERROR и WARN.
 */
export const LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'default';

//Версия приложения
export const APP_VERSION = process.env.APP_VERSION ? process.env.APP_VERSION : '1.0';
//Количество записей журнала возвращаемых на один запрос
export const RECORDS_ON_REQUEST = 50;
//Количество записей исторической таблицы возвращаемых на один запрос
export const HISTORY_DATA_LIMIT = 50;

console.log(`NODE_ENV: ${NODE_ENV}\nLOG_LEVEL: ${LOG_LEVEL}\nAPP_PORT: ${PORT}`);


