import { TspDistanceResponseDto } from 'src/tsp/dtos/response/generate-cities.response.dto';
export class TspSolver {
    constructor(
        private readonly cities: string[],
        private readonly distances: TspDistanceResponseDto[],
    ) {}

    public solve(): { route: string[]; totalDistance: number } {
        if (this.cities.length === 0) return { route: [], totalDistance: 0 };

        const visited = new Set<string>();
        const route: string[] = [];
        let totalDistance = 0;

        let currentCity = this.cities[0];
        visited.add(currentCity);
        route.push(currentCity);

        while (visited.size < this.cities.length) {
            let nearestCity: string | null = null;
            let minDistance = Infinity;

            for (const dist of this.distances) {
                const fromMatch =
                    dist.from === currentCity && !visited.has(dist.to);
                const toMatch =
                    dist.to === currentCity && !visited.has(dist.from);

                if (fromMatch && dist.distance < minDistance) {
                    minDistance = dist.distance;
                    nearestCity = dist.to;
                } else if (toMatch && dist.distance < minDistance) {
                    minDistance = dist.distance;
                    nearestCity = dist.from;
                }
            }

            if (nearestCity) {
                visited.add(nearestCity);
                route.push(nearestCity);
                totalDistance += minDistance;
                currentCity = nearestCity;
            } else {
                break;
            }
        }

        const startCity = route[0];
        const returnDistance = this.findDistance(currentCity, startCity);
        if (returnDistance !== null) {
            route.push(startCity);
            totalDistance += returnDistance;
        }

        return { route, totalDistance: Number(totalDistance.toFixed(2)) };
    }

    private findDistance(cityA: string, cityB: string): number | null {
        for (const dist of this.distances) {
            if (
                (dist.from === cityA && dist.to === cityB) ||
                (dist.from === cityB && dist.to === cityA)
            ) {
                return dist.distance;
            }
        }
        return null;
    }
}
