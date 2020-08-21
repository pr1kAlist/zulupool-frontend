import { EAppRoutes } from "enums/app-routes";

export function routeToUrl(route: EAppRoutes): string {
    return `/${route}`;
}
