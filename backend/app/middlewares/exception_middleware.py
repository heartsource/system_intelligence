from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse


class CustomException(Exception):
        def __init__(self, e: any) -> None:
                self.e = e

# Exception handler function
async def custom_exception_handler(request: Request, exec: CustomException):
        if exec.e.args[0] is not None:
            if isinstance(exec.e.args[0], Exception):
                   return JSONResponse(
                    status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content= {
                            "status": "error",
                            "data": str(exec.e)
                    }
            )
            return JSONResponse(
                    status_code= exec.e.args[0]['status_code'],
                    content= {
                            "status": "error",
                            "data": exec.e.args[0]['message']
                    }
            )
        return JSONResponse(
               status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
               content= {
                            "status": "error",
                            "data": "Internal Server Error"
                    }
        )


def add_exception_handlers(app: FastAPI):

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        # logger.error(f"HTTP Exception: {exc.detail}")
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        # logger.error(f"Unexpected Exception: {exc}")
        return JSONResponse(status_code=500, content={"detail": "An unexpected error occurred"})