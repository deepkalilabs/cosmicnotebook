from fastapi import Depends, HTTPException, status, Request, WebSocket
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.websockets import WebSocketDisconnect
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from typing import Dict, Any, Optional, Callable, TypeVar, Generic
import logging
from functools import wraps
from helpers.backend.supabase.client import get_supabase_client

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
        if any(request.url.path.startswith(path) for path in self.excluded_paths):
            logger.debug(f"Skipping auth for excluded path {request.url.path}")
            response = await call_next(request)
            return response

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning("Missing Authorization header")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Authorization header",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        token = auth_header.split("Bearer ")[1]
        logger.debug(f"Processing authentication for token: {token[:10]}...")
        user = await self.verify_token(token)
        logger.debug("Token verification successful")
      
        request.state.user = user
        response = await call_next(request)
        response.headers["X-User-ID"] = user["id"]
        response.headers["X-User-Email"] = user["email"]
        logger.debug(f"Added user {user['id']} to response headers")
        return response

    @staticmethod
    async def verify_token(token: str) -> Dict[str, Any]:
        if not token or token == "undefined":
            logger.warning("Token is empty or undefined")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing bearer token or undefined",
            )

        logger.debug(f"Verifying token: {token[:10]}...")
        
        try:
            payload = supabase.auth.get_user(token)
            if not getattr(payload, 'user', None):
                logger.error(f"Authentication failed: {payload.error}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"{payload.error}",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            load = payload.user.dict()
            logger.debug("Token verification successful")
            return load
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid bearer token",
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