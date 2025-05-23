import { NestFactory } from '@nestjs/core';
import { TspModule } from './tsp/tsp.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const port = process.env.PORT ?? 3000;
    const prefix = 'api';

    const app = await NestFactory.create(TspModule);

    // Establecer prefijo global
    app.setGlobalPrefix(prefix);

    // Aplicar validación global con class-validator
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(port);
    Logger.log(`Application is running on: http://localhost:${port}/${prefix}`);
}

void bootstrap();
