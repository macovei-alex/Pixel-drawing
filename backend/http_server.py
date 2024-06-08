import http.server
import json
import os
import socketserver
from typing import Callable, override
import file_operations as fileops
import pandas as pd


class HttpServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        if os.path.exists("backend"):
            os.chdir("backend")
        self.routes: dict[str, Callable] = {
            "/test": self.test_GET,
            "/test-file": self.test_file_GET,
        }
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

    # def do_OPTIONS(self):
    #     self.send_response(200)
    #     self.send_header("Access-Control-Allow-Origin", "*")
    #     self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    #     self.send_header("Access-Control-Allow-Headers", "Content-Type")
    #     self.end_headers()

    def test_GET(self):
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"test get method")
        except Exception as e:
            self.send_error(500, str(e))

    def test_file_GET(self):
        try:
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            df: pd.DataFrame = fileops.read_csv("saves/test.csv")
            print(df.to_numpy())
            self.wfile.write(b"{\n\t\"head\": ")
            self.wfile.write(json.dumps(df.columns.tolist()).encode())
            self.wfile.write(b",\n\t\"data\": ")
            self.wfile.write(json.dumps(df.to_numpy().tolist()).encode())
            self.wfile.write(b"\n}")
        except Exception as e:
            self.send_error(500, str(e))


PORT: int = 8000

try:
    with socketserver.TCPServer(("localhost", PORT), HttpServer) as httpd:
        print(f'Serving HTTP on port {PORT}')
        httpd.serve_forever()
except KeyboardInterrupt:
    print('Server stopped')
