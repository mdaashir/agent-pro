---
description: 'Python coding standards following PEP 8 and modern best practices'
applyTo: '**/*.py'
---

# Python Instructions

Follow these Python coding standards and best practices for all Python files.

## Code Style (PEP 8)

### Indentation

- Use 4 spaces per indentation level
- Never mix tabs and spaces
- Continuation lines should align wrapped elements

```python
# ✅ Good
def long_function_name(
    var_one, var_two, var_three,
    var_four):
    print(var_one)

# ✅ Good - hanging indent
result = some_function(
    argument_one,
    argument_two,
    argument_three
)
```

### Line Length

- Maximum line length: **79 characters** for code
- Maximum line length: **72 characters** for comments and docstrings

```python
# ✅ Good - line break before binary operator
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction
          - student_loan_interest)
```

### Blank Lines

- Two blank lines around top-level functions and classes
- One blank line around method definitions inside classes
- Use blank lines sparingly within functions

```python
# ✅ Good
import os
import sys


class MyClass:
    """My class docstring."""

    def __init__(self):
        self.value = 0

    def method_one(self):
        pass

    def method_two(self):
        pass


def top_level_function():
    pass


def another_function():
    pass
```

## Naming Conventions

### Variables and Functions

Use `snake_case` for variables and functions:

```python
# ✅ Good
user_name = "John"
total_count = 42

def calculate_total_price(items):
    pass

def send_email_notification(user, message):
    pass
```

### Classes

Use `PascalCase` for class names:

```python
# ✅ Good
class User:
    pass

class DatabaseConnection:
    pass

class HTTPRequest:  # Acronyms are capitalized
    pass
```

### Constants

Use `UPPER_SNAKE_CASE` for constants:

```python
# ✅ Good
MAX_RETRY_ATTEMPTS = 3
API_BASE_URL = "https://api.example.com"
DEFAULT_TIMEOUT = 30
```

### Private and Protected

Use single leading underscore for protected, double for private:

```python
# ✅ Good
class MyClass:
    def __init__(self):
        self.public_attr = "public"
        self._protected_attr = "protected"
        self.__private_attr = "private"

    def public_method(self):
        pass

    def _protected_method(self):
        pass

    def __private_method(self):
        pass
```

## Type Hints

### Always Use Type Hints for Function Signatures

```python
# ✅ Good
from typing import List, Dict, Optional, Union

def calculate_total(items: List[float], tax_rate: float = 0.0) -> float:
    """Calculate total price with tax."""
    subtotal = sum(items)
    return subtotal * (1 + tax_rate)

def get_user(user_id: str) -> Optional[Dict[str, any]]:
    """Retrieve user by ID, or None if not found."""
    # ...

def process_data(data: Union[str, bytes]) -> str:
    """Process data from string or bytes."""
    # ...
```

### Use Modern Type Hint Syntax (Python 3.10+)

```python
# ✅ Good - Python 3.10+
def get_user(user_id: str) -> dict[str, any] | None:
    """Retrieve user or None."""
    # ...

def process_items(items: list[int]) -> list[str]:
    """Process list of integers."""
    return [str(item) for item in items]

# ✅ Good - Type aliases
type UserID = str | int
type UserData = dict[str, any]

def fetch_user(user_id: UserID) -> UserData | None:
    # ...
```

### Use dataclasses for Data Containers

```python
# ✅ Good
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class User:
    """User data container."""
    id: str
    name: str
    email: str
    age: Optional[int] = None
    created_at: datetime = datetime.now()

    def __post_init__(self):
        """Validate after initialization."""
        if self.age is not None and self.age < 0:
            raise ValueError("Age cannot be negative")
```

### Use Protocol for Structural Typing

```python
# ✅ Good
from typing import Protocol

class Drawable(Protocol):
    """Protocol for drawable objects."""
    def draw(self) -> None:
        """Draw the object."""
        ...

def render(obj: Drawable) -> None:
    """Render any drawable object."""
    obj.draw()
```

## Imports

### Order and Grouping

```python
# ✅ Good organization
# 1. Standard library imports
import os
import sys
from datetime import datetime
from typing import List, Optional

# 2. Third-party imports
import numpy as np
import pandas as pd
from fastapi import FastAPI

# 3. Local application imports
from myapp.models import User
from myapp.utils import format_date
```

### Avoid Wildcard Imports

```python
# ❌ Avoid
from module import *

# ✅ Good
from module import function_one, function_two
from module import ClassOne
```

## Docstrings

### Use Google-style Docstrings

```python
# ✅ Good
def calculate_total(items: List[float], tax_rate: float = 0.0) -> float:
    """Calculate total price with tax.

    Args:
        items: List of item prices
        tax_rate: Tax rate as decimal (default: 0.0)

    Returns:
        Total price including tax

    Raises:
        ValueError: If tax_rate is negative

    Examples:
        >>> calculate_total([10.0, 20.0], 0.08)
        32.4
    """
    if tax_rate < 0:
        raise ValueError("Tax rate cannot be negative")

    subtotal = sum(items)
    return subtotal * (1 + tax_rate)
```

### Class Docstrings

```python
# ✅ Good
class ShoppingCart:
    """Shopping cart for managing items and calculating totals.

    Attributes:
        items: List of cart items
        discount_code: Optional discount code applied to cart

    Examples:
        >>> cart = ShoppingCart()
        >>> cart.add_item(CartItem("Product", 10.0, 2))
        >>> cart.get_total()
        20.0
    """

    def __init__(self):
        """Initialize empty shopping cart."""
        self.items: List[CartItem] = []
        self.discount_code: Optional[str] = None
```

## Error Handling

### Use Specific Exceptions

```python
# ✅ Good
def divide(a: float, b: float) -> float:
    """Divide two numbers."""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# ✅ Good - catch specific exceptions
try:
    result = divide(10, 0)
except ValueError as e:
    logger.error(f"Invalid input: {e}")
    raise
except Exception as e:
    logger.exception("Unexpected error occurred")
    raise
```

### Custom Exceptions

```python
# ✅ Good
class ValidationError(Exception):
    """Raised when validation fails."""
    pass

class NotFoundError(Exception):
    """Raised when resource is not found."""

    def __init__(self, resource_type: str, resource_id: str):
        self.resource_type = resource_type
        self.resource_id = resource_id
        super().__init__(
            f"{resource_type} with ID {resource_id} not found"
        )
```

### Context Managers for Resource Management

```python
# ✅ Good - automatic resource cleanup
with open("file.txt") as f:
    data = f.read()

# ✅ Good - custom context manager
from contextlib import contextmanager

@contextmanager
def database_connection(connection_string: str):
    """Context manager for database connection."""
    conn = create_connection(connection_string)
    try:
        yield conn
    finally:
        conn.close()

# Usage
with database_connection("postgresql://...") as conn:
    result = conn.execute("SELECT * FROM users")
```

## Pythonic Patterns

### List Comprehensions

```python
# ✅ Good - list comprehension
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# ✅ Good - dict comprehension
user_map = {user.id: user for user in users}

# ✅ Good - set comprehension
unique_names = {user.name for user in users}
```

### Use enumerate() and zip()

```python
# ✅ Good
for i, item in enumerate(items):
    print(f"Index {i}: {item}")

for name, age in zip(names, ages):
    print(f"{name} is {age} years old")
```

### Use unpacking

```python
# ✅ Good
first, *middle, last = [1, 2, 3, 4, 5]
# first = 1, middle = [2, 3, 4], last = 5

# ✅ Good - dictionary unpacking
defaults = {"host": "localhost", "port": 8000}
config = {**defaults, "port": 9000}  # Override port
```

### Use f-strings for Formatting

```python
# ✅ Good
name = "John"
age = 30
message = f"{name} is {age} years old"

# ✅ Good - expressions in f-strings
price = 19.99
message = f"Total: ${price * 1.08:.2f}"  # "Total: $21.59"
```

## Functions and Methods

### Keep Functions Focused

```python
# ✅ Good - single responsibility
def validate_email(email: str) -> bool:
    """Validate email format."""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def send_email(to: str, subject: str, body: str) -> None:
    """Send email to recipient."""
    if not validate_email(to):
        raise ValueError(f"Invalid email: {to}")
    # Send email logic
```

### Use Default Arguments Carefully

```python
# ❌ Avoid - mutable default argument
def add_item(item, items=[]):  # DANGER!
    items.append(item)
    return items

# ✅ Good
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### Use \*args and \*\*kwargs

```python
# ✅ Good
def log_message(level: str, *args, **kwargs) -> None:
    """Log message with flexible arguments."""
    message = " ".join(str(arg) for arg in args)
    metadata = kwargs
    print(f"[{level}] {message} | {metadata}")

# Usage
log_message("INFO", "User", "logged in", user_id=123, ip="127.0.0.1")
```

## Classes

### Use Properties

```python
# ✅ Good
class Circle:
    """Circle with radius property."""

    def __init__(self, radius: float):
        self._radius = radius

    @property
    def radius(self) -> float:
        """Get circle radius."""
        return self._radius

    @radius.setter
    def radius(self, value: float) -> None:
        """Set circle radius."""
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self) -> float:
        """Calculate circle area."""
        return 3.14159 * self._radius ** 2
```

### Use classmethod and staticmethod

```python
# ✅ Good
class User:
    """User class with factory methods."""

    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    @classmethod
    def from_dict(cls, data: dict) -> "User":
        """Create user from dictionary."""
        return cls(data["name"], data["email"])

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format (doesn't need instance)."""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
```

## Async/Await

### Use async/await for Asynchronous Code

```python
# ✅ Good
import asyncio
import httpx

async def fetch_data(url: str) -> dict:
    """Fetch data from URL asynchronously."""
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

async def fetch_multiple(urls: List[str]) -> List[dict]:
    """Fetch multiple URLs concurrently."""
    tasks = [fetch_data(url) for url in urls]
    return await asyncio.gather(*tasks)
```

## Testing

### Use pytest

```python
# ✅ Good
import pytest
from myapp import calculate_total

def test_calculate_total_normal_case():
    """Test normal calculation."""
    result = calculate_total([10.0, 20.0], tax_rate=0.1)
    assert result == 33.0

def test_calculate_total_zero_tax():
    """Test with zero tax."""
    result = calculate_total([10.0, 20.0], tax_rate=0.0)
    assert result == 30.0

def test_calculate_total_negative_tax_raises():
    """Test that negative tax raises ValueError."""
    with pytest.raises(ValueError, match="cannot be negative"):
        calculate_total([10.0], tax_rate=-0.1)

@pytest.mark.parametrize("items,tax,expected", [
    ([10.0], 0.1, 11.0),
    ([10.0, 20.0], 0.0, 30.0),
    ([], 0.1, 0.0),
])
def test_calculate_total_parametrized(items, tax, expected):
    """Test multiple scenarios."""
    result = calculate_total(items, tax_rate=tax)
    assert result == pytest.approx(expected)
```

## Performance

### Use Generators for Large Datasets

```python
# ✅ Good - memory efficient
def read_large_file(filename: str):
    """Read file line by line using generator."""
    with open(filename) as f:
        for line in f:
            yield line.strip()

# Usage
for line in read_large_file("large_file.txt"):
    process(line)
```

### Use list, dict, set When Appropriate

```python
# ✅ Good - O(1) lookup
user_ids = {user.id for user in users}  # Set for membership testing
if user_id in user_ids:  # Fast lookup
    ...

# ✅ Good - dict for mapping
user_by_id = {user.id: user for user in users}
user = user_by_id.get(user_id)  # O(1) lookup
```

## General Rules

1. **Follow PEP 8** style guide
2. **Use type hints** for function signatures
3. **Write docstrings** for all public functions and classes
4. **Keep functions small** and focused
5. **Use list comprehensions** instead of loops when appropriate
6. **Use context managers** for resource management
7. **Catch specific exceptions** rather than bare except
8. **Use dataclasses** for simple data containers
9. **Write tests** for all non-trivial code
10. **Keep it Pythonic** - idiomatic Python is readable Python
