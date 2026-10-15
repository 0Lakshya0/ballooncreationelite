#!/usr/bin/env python3
"""Static server for the mockups folder — with caching switched off.

python's http.server answers with 304 Not Modified, which kept showing the owner
an old page after a rebuild. This one always sends the current file.

Run from mockups/:  python3 _serve.py [port] [folder]
"""
from __future__ import annotations

import functools
import http.server
import pathlib
import socketserver
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self) -> None:  # noqa: D102
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt: str, *args) -> None:  # keep the log short
        if '"GET / ' in (fmt % args) or ' 404 ' in (fmt % args):
            super().log_message(fmt, *args)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main() -> int:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
    folder = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else ".").resolve()
    handler = functools.partial(NoCacheHandler, directory=str(folder))
    with Server(("0.0.0.0", port), handler) as httpd:
        print(f"serving {folder} on 0.0.0.0:{port} (no-cache)", flush=True)
        httpd.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
