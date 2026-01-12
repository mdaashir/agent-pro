---
name: api-development
description: 'Comprehensive skill for designing, implementing, and documenting RESTful APIs with best practices'
---

# API Development Skill

This skill provides comprehensive guidance for developing robust, secure, and well-documented RESTful APIs.

## Capabilities

- Design RESTful API endpoints following best practices
- Implement proper HTTP methods and status codes
- Add authentication and authorization
- Validate input and handle errors gracefully
- Generate API documentation (OpenAPI/Swagger)
- Write API tests
- Implement rate limiting and security measures

## When to Use

Use this skill when:

- Creating new API endpoints
- Designing API structure
- Adding security to APIs
- Writing API documentation
- Troubleshooting API issues

## API Design Principles

### Resource-Based URLs

```
# ✅ Good - noun-based, resource-oriented
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
PATCH  /api/users/{id}
DELETE /api/users/{id}

GET    /api/users/{id}/orders
POST   /api/users/{id}/orders

# ❌ Bad - verb-based
GET    /api/getUsers
POST   /api/createUser
POST   /api/deleteUser
```

### HTTP Methods

- **GET**: Retrieve resource(s) - Idempotent, Safe
- **POST**: Create new resource - Not idempotent
- **PUT**: Update/replace entire resource - Idempotent
- **PATCH**: Partially update resource - Not always idempotent
- **DELETE**: Remove resource - Idempotent

### HTTP Status Codes

**Success Codes (2xx)**

- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST (resource created)
- `204 No Content`: Successful DELETE or update with no response body

**Client Error Codes (4xx)**

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Resource state conflict
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded

**Server Error Codes (5xx)**

- `500 Internal Server Error`: Generic server error
- `502 Bad Gateway`: Upstream service error
- `503 Service Unavailable`: Temporary unavailability

## Implementation Examples

### FastAPI (Python)

```python
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

app = FastAPI(title="User API", version="1.0.0")
security = HTTPBearer()

# Data models
class UserCreate(BaseModel):
    """Schema for creating a user."""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    age: Optional[int] = Field(None, ge=0, le=150)

class UserResponse(BaseModel):
    """Schema for user response."""
    id: str
    name: str
    email: str
    age: Optional[int]
    created_at: str

class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    message: str
    details: Optional[dict] = None

# Endpoints
@app.post(
    "/api/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request"},
        422: {"model": ErrorResponse, "description": "Validation Error"}
    }
)
async def create_user(user: UserCreate):
    """Create a new user.

    - **name**: User's full name (required)
    - **email**: Valid email address (required)
    - **age**: User's age (optional, 0-150)
    """
    try:
        # Validation logic
        if await user_exists(user.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )

        # Create user
        new_user = await db.create_user(user)
        return new_user

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@app.get(
    "/api/users/{user_id}",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse, "description": "User Not Found"}
    }
)
async def get_user(user_id: str):
    """Retrieve user by ID."""
    user = await db.get_user(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )

    return user

@app.get("/api/users", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 10,
    sort_by: Optional[str] = None
):
    """List users with pagination."""
    if limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit cannot exceed 100"
        )

    users = await db.get_users(skip=skip, limit=limit, sort_by=sort_by)
    return users

@app.put("/api/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user: UserCreate):
    """Update user (replace entire resource)."""
    existing_user = await db.get_user(user_id)

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )

    updated_user = await db.update_user(user_id, user)
    return updated_user

@app.delete("/api/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str):
    """Delete user."""
    deleted = await db.delete_user(user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )

    return None
```

### Express (TypeScript)

```typescript
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Validation schemas
const userCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
});

type UserCreate = z.infer<typeof userCreateSchema>;

// Middleware for validation
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: 'ValidationError',
          message: 'Request validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// Error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'NotFound',
      message: err.message,
    });
  }

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}

// Routes
app.post('/api/users', validate(userCreateSchema), async (req, res, next) => {
  try {
    const userData: UserCreate = req.body;

    // Check if user exists
    const existing = await db.getUserByEmail(userData.email);
    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await db.createUser(userData);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.getUser(id);

    if (!user) {
      return res.status(404).json({
        error: 'NotFound',
        message: `User with ID ${id} not found`,
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

    const users = await db.getUsers({ skip, limit });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
```

## Authentication & Authorization

### JWT Authentication

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime, timedelta

security = HTTPBearer()
SECRET_KEY = "your-secret-key"  # Use environment variable
ALGORITHM = "HS256"

def create_token(user_id: str, role: str) -> str:
    """Create JWT token."""
    payload = {
        "sub": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token."""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def require_role(required_role: str):
    """Dependency to check user role."""
    def role_checker(token_data: dict = Depends(verify_token)):
        if token_data.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return token_data
    return role_checker

# Protected endpoint
@app.get("/api/admin/users", dependencies=[Depends(require_role("admin"))])
async def admin_list_users():
    """Admin-only endpoint."""
    return await db.get_all_users()
```

## Rate Limiting

```python
from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/users")
@limiter.limit("10/minute")
async def get_users(request: Request):
    """Limited to 10 requests per minute."""
    return await db.get_users()
```

## API Documentation

### OpenAPI/Swagger

FastAPI automatically generates OpenAPI documentation. Access at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

### Custom Documentation

```python
@app.get(
    "/api/users/{user_id}",
    summary="Get user by ID",
    description="Retrieve detailed information about a specific user",
    response_description="User details",
    responses={
        200: {
            "description": "Successful response",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123",
                        "name": "John Doe",
                        "email": "john@example.com"
                    }
                }
            }
        },
        404: {
            "description": "User not found"
        }
    }
)
async def get_user(user_id: str):
    ...
```

## Testing

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_create_user():
    """Test user creation."""
    response = client.post("/api/users", json={
        "name": "Test User",
        "email": "test@example.com",
        "age": 25
    })

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_create_user_validation_error():
    """Test validation error."""
    response = client.post("/api/users", json={
        "name": "",  # Invalid: empty name
        "email": "invalid-email"  # Invalid: bad email
    })

    assert response.status_code == 422

def test_get_nonexistent_user():
    """Test 404 response."""
    response = client.get("/api/users/nonexistent")
    assert response.status_code == 404
```

## Best Practices

1. **Use proper HTTP methods and status codes**
2. **Validate all input data**
3. **Implement authentication and authorization**
4. **Add rate limiting**
5. **Provide clear error messages**
6. **Version your API** (`/api/v1/...`)
7. **Use pagination** for list endpoints
8. **Document** your API thoroughly
9. **Test** all endpoints
10. **Handle errors** gracefully
