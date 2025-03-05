from fastapi import HTTPException, status, Request, WebSocket
from fastapi.security import HTTPBearer
from fastapi.websockets import WebSocketDisconnect
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from typing import Dict, Any
import logging
from functools import wraps
from helpers.backend.supabase.client import get_supabase_client
from datetime import datetime
import time
import jwt

logger = logging.getLogger(__name__)

supabase = get_supabase_client()


# Set up HTTP Bearer security scheme
security = HTTPBearer(auto_error=True)


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Simple middleware to do authentication for all included routes including websockets.

    NOTE: Only use indpendency injection if you need to do route specific logic.
    """


    def __init__(self, app):
        super().__init__(app)
        self.excluded_paths = [
            #NOTE: 
            # Add excluded paths that should not be authenticated. 
            #Example: "/docs",
            #         "/openapi.json",
            #         "/auth/login",
            #         "/auth/logout",
            #         "/auth/callback",
        ]
        
    async def dispatch(self, request: Request, call_next):
        logger.info(f"Processing request for path: {request.url.path}")
        
        if any(request.url.path.startswith(path) for path in self.excluded_paths):
            logger.debug(f"Skipping auth for excluded path {request.url.path}")
            response = await call_next(request)
            return response

        auth_header = request.headers.get("Authorization")
        logger.info(f"Received Authorization header: {auth_header}")

        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning(f"Invalid or missing Authorization header: {auth_header}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Authorization header",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        token = auth_header.split("Bearer ")[1]
        logger.info(f"Extracted token (first 20 chars): {token[:20]}...")
        
        try:
            logger.info("Attempting to verify token...")
            user = await self.verify_token(token)
            logger.info(f"Token verified successfully for user: {user.get('email', 'unknown')}")
            
            request.state.user = user
            response = await call_next(request)
            response.headers["X-User-ID"] = user["id"]
            response.headers["X-User-Email"] = user["email"]
            logger.info(f"Request processed successfully for user {user['id']}")
            return response
            
        except Exception as e:
            logger.error(f"Error during token verification: {str(e)}")
            logger.error(f"Full token that failed: {token}")
            logger.error(f"Token length: {len(token)}")
            # Print full exception details
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            raise

    @staticmethod
    async def verify_token(token: str) -> Dict[str, Any]:
        logger.info("Starting token verification...")
        
        if not token or token == "undefined":
            logger.warning("Token is empty or undefined")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing bearer token or undefined",
            )

        try:
            # Decode token without verification to check claims
            decoded = jwt.decode(token, options={"verify_signature": False})
            current_time = int(time.time())
            
            # Log token timing details
            logger.info(f"Token timing: current={current_time}, exp={decoded.get('exp')}, iat={decoded.get('iat')}")
            logger.info(f"Token expires in: {decoded.get('exp', 0) - current_time} seconds")
            logger.info(f"Token was issued: {current_time - decoded.get('iat', 0)} seconds ago")
            
            if decoded.get('exp', 0) <= current_time:
                logger.error(f"Token expired at {datetime.fromtimestamp(decoded['exp'])} (current time: {datetime.fromtimestamp(current_time)})")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired",
                )

            logger.info("Calling Supabase auth.get_user...")
            payload = supabase.auth.get_user(token)
            logger.info(f"Supabase response received: {payload}")
            
            if not payload or not getattr(payload, 'user', None):
                logger.error(f"Invalid payload structure: {payload}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token structure",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            load = payload.user.dict()
            logger.info(f"Successfully verified user: {load.get('email', 'unknown')}")
            return load
            
        except Exception as e:
            logger.error(f"Token verification failed with exception: {str(e)}")
            logger.error(f"Exception type: {type(e)}")
            logger.error(f"Token that failed verification: {token}")
            # Print full exception details
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid bearer token: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    async def verify_websocket(self, websocket: WebSocket) -> Dict[str, Any]:
        """
        Verify the websocket connection and store the user data in scope.

        Args: 
            websocket (WebSocket): The websocket instance connection.

        Returns:
            Dict[str, Any]: The user data.

        Raises:
            WebsocketException: If the authentication fails.
        """
        auth_header = websocket.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            await websocket.close(code=1008, reason="Missing Authorization header")
            raise WebSocketDisconnect(code=1008, reason="Missing Authorization header")

        token = auth_header.split("Bearer ")[1]
        try:
            user_response = supabase.auth.get_user(token)
            if user_response.error or not user_response.user:
                await websocket.close(code=1008, reason="Invalid bearer token")
                raise HTTPException(status_code=401, detail="Invalid bearer token")
            return user_response.user.dict()
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            await websocket.close(code=1008, reason="Invalid bearer token")
            raise HTTPException(status_code=401, detail="Invalid bearer token")