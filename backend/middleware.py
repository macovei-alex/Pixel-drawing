class Middleware:
    def __init__(self, routes: list[str]) -> None:
        self.routes = routes

    def split_route_params(self, route: str) -> tuple[str, list[str]]:
        route_and_params: list[str] = []
        while len(route) > 0:
            if route in self.routes:
                return route, route_and_params
            last_backslash = route.rfind("/")
            route_and_params.append(route[last_backslash + 1:])
            route = route[:last_backslash]
        return "", []
    