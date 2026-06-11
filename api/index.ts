import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from '../src/app.bootstrap';

let cachedServer: any;

async function bootstrap() {
    const app = await createApp();

    await app.init();

    return serverlessExpress({
        app: app.getHttpAdapter().getInstance(),
    });
}

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }

    return cachedServer(req, res);
}