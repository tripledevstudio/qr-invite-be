import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

// src/app.bootstrap.ts
export async function createApp() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.setGlobalPrefix('api');

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    return app;
}