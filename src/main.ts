import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, transform: true }),
	);

	const allowedOrigins = process.env.FRONTEND_URL
		? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
		: '*';

	app.enableCors({
		origin: allowedOrigins,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});

	const port = process.env.SERVERPORT ?? 3000;
	await app.listen(port, '0.0.0.0');

	console.log(`Application running on: http://0.0.0.0:${port}/api`);
}

bootstrap();
