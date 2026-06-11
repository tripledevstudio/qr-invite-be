import serverlessExpress from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer: any;

async function bootstrap() {
    try {
        console.log('Creating Nest app');

        const app = await NestFactory.create(AppModule);

        console.log('Nest app created');

        app.setGlobalPrefix('api');

        await app.init();

        console.log('Nest app initialized');

        const expressApp = app.getHttpAdapter().getInstance();

        return serverlessExpress({
            app: expressApp,
        });
    } catch (error) {
        console.error('BOOTSTRAP ERROR:', error);
        throw error;
    }
}

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }

    return cachedServer(req, res);
}