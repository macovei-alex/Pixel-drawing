import http.server
import json
import os
import socketserver
from typing import Callable, override
from db import MongoController
import pandas as pd


class HttpServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        if os.path.exists("backend"):
            os.chdir("backend")
        self.routes: dict[str, Callable] = {
            "/test": self.test_GET,
            "/test-pixels": self.test_pixels_GET,
        }
        self.mongo: MongoController = MongoController()
        super().__init__(*args, directory=None, **kwargs)

    @override
    def do_GET(self):
        route_func: Callable = self.routes[self.path]
        if route_func:
            route_func()
        else:
            super().do_GET()

    @override
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def test_GET(self):
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"test get method")
        except Exception as e:
            self.send_error(500, str(e))

    def test_pixels_GET(self):
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            table_columns, table_rows = self.mongo.select_all()

            self.wfile.write(b"{\n\t\"head\": ")
            self.wfile.write(json.dumps(table_columns).encode())
            self.wfile.write(b",\n\t\"data\": ")
            self.wfile.write(json.dumps(table_rows).encode())
            self.wfile.write(b"\n}")
        except Exception as e:
            self.send_error(500, str(e))


PORT: int = 8000

try:
    with socketserver.TCPServer(("127.0.0.1", PORT), HttpServer) as httpd:
        print(f'Serving HTTP on port {PORT}')
        httpd.serve_forever()
except KeyboardInterrupt:
    print('Server stopped')
