// import '../src/main';
// api/index.ts

import serverlessExpress from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();

    return serverlessExpress({
        app: expressApp,
    });
}

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }

    return cachedServer(req, res);
}