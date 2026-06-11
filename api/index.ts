import { bootstrap } from '../src/main';

let cachedServer: any;

export default async (req: any, res: any) => {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
};