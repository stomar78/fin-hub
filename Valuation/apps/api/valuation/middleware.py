import json
import time
import uuid
from typing import Callable
from django.http import HttpRequest, HttpResponse


class ProvenanceMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request_id = str(uuid.uuid4())
        start = time.perf_counter()
        # Attach to request for downstream usage
        request.META["X_REQUEST_ID"] = request_id
        try:
            response = self.get_response(request)
        finally:
            duration_ms = round((time.perf_counter() - start) * 1000.0, 2)
        # Add headers
        if isinstance(response, HttpResponse):
            response["X-Request-ID"] = request_id
            response["X-Response-Time-ms"] = str(duration_ms)
        # Basic structured log to stdout
        log = {
            "event": "http_request",
            "request_id": request_id,
            "method": request.method,
            "path": request.get_full_path(),
            "status": getattr(response, "status_code", None),
            "duration_ms": duration_ms,
            "client_ip": request.META.get("REMOTE_ADDR"),
        }
        print(json.dumps(log))
        return response
