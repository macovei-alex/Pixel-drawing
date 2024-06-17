import http.server
import os
import socketserver
from typing import Callable, override
from middleware import Middleware
from data_manipulator import DataManipulator
from db_controller import MongoController


class HttpServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs) -> None:
        if os.path.exists("backend"):
            os.chdir("backend")
        self.routes: dict[str, Callable] = {
            "/test": self.test_GET,
            "/test-pixels": self.test_pixels_GET,
            "/pixels": self.pixels_GET,
        }
        self.middleware = Middleware(list(self.routes.keys()))
        self.mongo: MongoController = MongoController()
        super().__init__(*args, directory=None, **kwargs)

    @override
    def do_GET(self) -> None:
        pure_route, params = self.middleware.split_route_params(self.path)
        route_func: Callable = self.routes[pure_route]
        if route_func:
            try:
                route_func() if len(params) == 0 else route_func(params)
            except Exception as e:
                self.send_error(500, str(e))
        else:
            super().do_GET()

    @override
    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def test_GET(self) -> None:
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"test get method")
        except Exception as e:
            self.send_error(500, str(e))

    def test_pixels_GET(self) -> None:
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            table = self.mongo.select_all()
            self.wfile.write(DataManipulator.encode_pixels(table))

        except Exception as e:
            self.send_error(500, str(e))

    def pixels_GET(self, params: list[str]) -> None:
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            table = self.mongo.select_all(params[0])
            self.wfile.write(DataManipulator.encode_pixels(table))

        except Exception as e:
            self.send_error(500, str(e))


PORT: int = 55055

try:
    with socketserver.TCPServer(("127.0.0.1", PORT), HttpServer) as httpd:
        print(f'Serving HTTP on port {PORT}')
        httpd.serve_forever()
except KeyboardInterrupt:
    print('Server stopped')
