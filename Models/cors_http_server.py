from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial

class CORSHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, CORSHTTPRequestHandler)
    print("Serving HTTP on port 8000...")
    httpd.serve_forever()
