import { Injectable, NotImplementedException } from '@nestjs/common';
import { TspSolveResponseDto } from './dtos/response/solve.response.dto';
import { TspSolveRequestDto } from './dtos/request/solve.request.dto';
import {
    TspGenerateCitiesResponseDto,
    TspDistanceResponseDto,
} from './dtos/response/generate-cities.response.dto';
import { TspGenerateCitiesRequestDto } from './dtos/request/generate-cities.request.dto';
import { WorldGenerator } from './domain/world-generator/world-generator';
import { TspSolver } from './domain/tsp-solver/tsp-solver';

/**
 * The TspService class is a NestJS service responsible for implementing the
 * core logic of solving the Traveling Salesman Problem (TSP) and generating
 * random city coordinates.
 */
@Injectable()
export class TspService {
    solve(payload: TspSolveRequestDto): TspSolveResponseDto {
        // To do
        // - Implement TSP solver

        const solver = new TspSolver(payload.cities, payload.distances);
        const result = solver.solve();

        return {
            route: result.route,
            totalDistance: result.totalDistance,
        };
    }

    generateCities(
        payload: TspGenerateCitiesRequestDto,
    ): TspGenerateCitiesResponseDto {
        const worldGenerator = new WorldGenerator(payload.numOfCities, {
            x: payload.worldBoundX,
            y: payload.worldBoundY,
        });

        worldGenerator.generateCities();

        // To do
        // - Calculate distance between cities

        const cities = worldGenerator.getWorld().cities;

        const cityNames = cities.map((city) => city.name);

        const distances: TspDistanceResponseDto[] = [];

        for (let i = 0; i < cities.length; i++) {
            for (let j = i + 1; j < cities.length; j++) {
                const fromCity = cities[i];
                const toCity = cities[j];

                const dx = fromCity.coordinates.x - toCity.coordinates.x;
                const dy = fromCity.coordinates.y - toCity.coordinates.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                distances.push({
                    from: fromCity.name,
                    to: toCity.name,
                    distance: Number(distance.toFixed(2)),
                });
            }
        }

        return {
            cities: cityNames,
            distances,
        };
    }
}
