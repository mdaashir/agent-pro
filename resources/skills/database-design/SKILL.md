---
name: database-design
description: 'Design and optimize database schemas, queries, and migrations with best practices'
---

# Database Design Skill

This skill provides comprehensive guidance for designing efficient, scalable, and maintainable database schemas and queries.

## Capabilities

- Design normalized database schemas
- Write optimized SQL queries
- Create database indexes
- Design database migrations
- Implement relationships (one-to-many, many-to-many)
- Apply database design patterns
- Optimize query performance

## When to Use

Use this skill when:

- Designing new database schemas
- Optimizing slow queries
- Creating database migrations
- Modeling complex relationships
- Troubleshooting performance issues

## Schema Design Principles

### Normalization

**First Normal Form (1NF)**

- Eliminate repeating groups
- Each column contains atomic values
- Each row is unique

```sql
-- ❌ Bad - not atomic, repeating
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  phones VARCHAR(500)  -- '555-1234, 555-5678, 555-9012'
);

-- ✅ Good - atomic, normalized
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE user_phones (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  phone VARCHAR(20)
);
```

**Second Normal Form (2NF)**

- Meet 1NF requirements
- Remove partial dependencies

```sql
-- ❌ Bad - order_date depends only on order_id, not product_id
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT,
  order_date DATE,  -- Partial dependency
  PRIMARY KEY (order_id, product_id)
);

-- ✅ Good - separate tables
CREATE TABLE orders (
  id INT PRIMARY KEY,
  order_date DATE
);

CREATE TABLE order_items (
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);
```

**Third Normal Form (3NF)**

- Meet 2NF requirements
- Remove transitive dependencies

```sql
-- ❌ Bad - city depends on zip_code, not directly on user_id
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  zip_code VARCHAR(10),
  city VARCHAR(100)  -- Transitive dependency
);

-- ✅ Good - separate zip code data
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  zip_code VARCHAR(10) REFERENCES zip_codes(code)
);

CREATE TABLE zip_codes (
  code VARCHAR(10) PRIMARY KEY,
  city VARCHAR(100),
  state VARCHAR(2)
);
```

## Common Relationships

### One-to-Many

```sql
-- User has many orders
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Many-to-Many

```sql
-- Students and courses (many-to-many)
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  credits INT
);

-- Junction table
CREATE TABLE student_courses (
  student_id INT,
  course_id INT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  grade VARCHAR(2),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_student_courses_student ON student_courses(student_id);
CREATE INDEX idx_student_courses_course ON student_courses(course_id);
```

### Self-Referencing

```sql
-- Employee hierarchy (self-referencing)
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE INDEX idx_employees_manager ON employees(manager_id);
```

## Indexes

### When to Add Indexes

✅ **Add indexes for:**

- Primary keys (automatic)
- Foreign keys
- Columns used in WHERE clauses frequently
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Columns used for uniqueness

❌ **Avoid indexes on:**

- Small tables (< 1000 rows)
- Columns with low cardinality (few unique values)
- Columns that change frequently
- Wide columns (large text, blobs)

### Index Types

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date DESC);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Partial index (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Full-text index (PostgreSQL)
CREATE INDEX idx_posts_content ON posts USING GIN(to_tsvector('english', content));

-- Covering index (includes extra columns)
CREATE INDEX idx_orders_user_covering
  ON orders(user_id)
  INCLUDE (order_date, total_amount);
```

## Query Optimization

### Use EXPLAIN to Analyze Queries

```sql
-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 10;
```

### Avoid N+1 Queries

```sql
-- ❌ Bad - N+1 query problem
-- First query: get all users
SELECT * FROM users;

-- Then for each user (N queries):
SELECT * FROM orders WHERE user_id = ?;

-- ✅ Good - single query with JOIN
SELECT
  u.id,
  u.name,
  o.id as order_id,
  o.total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Or use subquery/CTE
WITH user_orders AS (
  SELECT
    user_id,
    COUNT(*) as order_count,
    SUM(total_amount) as total_spent
  FROM orders
  GROUP BY user_id
)
SELECT
  u.*,
  COALESCE(uo.order_count, 0) as order_count,
  COALESCE(uo.total_spent, 0) as total_spent
FROM users u
LEFT JOIN user_orders uo ON u.id = uo.user_id;
```

### Use Appropriate JOINs

```sql
-- INNER JOIN - only matching rows
SELECT u.name, o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN - all left table rows + matches
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- RIGHT JOIN - all right table rows + matches
SELECT u.name, o.total_amount
FROM orders o
RIGHT JOIN users u ON o.user_id = u.id;

-- FULL OUTER JOIN - all rows from both tables
SELECT u.name, o.total_amount
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

### Optimize WHERE Clauses

```sql
-- ❌ Bad - function on indexed column prevents index usage
SELECT * FROM users WHERE UPPER(email) = 'JOHN@EXAMPLE.COM';

-- ✅ Good - use index directly
SELECT * FROM users WHERE email = 'john@example.com';

-- ❌ Bad - implicit type conversion
SELECT * FROM orders WHERE user_id = '123';  -- user_id is INT

-- ✅ Good - correct type
SELECT * FROM orders WHERE user_id = 123;

-- ✅ Good - use IN for multiple values
SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5);

-- ✅ Good - use BETWEEN for ranges
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';
```

## Database Migrations

### Migration Best Practices

```sql
-- Migration: 001_create_users_table.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Migration: 002_add_user_profile.sql
CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  bio TEXT,
  avatar_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Migration: 003_add_user_status.sql
-- Add column with default value to avoid null issues
ALTER TABLE users
ADD COLUMN status VARCHAR(20) DEFAULT 'active' NOT NULL;

-- Add index for new column
CREATE INDEX idx_users_status ON users(status);

-- Migration: 004_modify_user_email.sql
-- Increase email column size
ALTER TABLE users
ALTER COLUMN email TYPE VARCHAR(255);

-- Migration: 005_rename_column.sql
ALTER TABLE users
RENAME COLUMN username TO user_name;

-- Rollback: drop_users_table.sql
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;
```

## Performance Patterns

### Pagination

```sql
-- ✅ Good - offset pagination (simple but slow for large offsets)
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;  -- Page 3

-- ✅ Better - cursor-based pagination (faster)
SELECT * FROM users
WHERE created_at < '2024-01-15 10:00:00'
ORDER BY created_at DESC
LIMIT 20;

-- ✅ Best - keyset pagination (most efficient)
SELECT * FROM users
WHERE (created_at, id) < ('2024-01-15 10:00:00', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

### Soft Deletes

```sql
-- Add deleted_at column
ALTER TABLE users
ADD COLUMN deleted_at TIMESTAMP NULL;

CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- "Delete" user (soft delete)
UPDATE users
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 123;

-- Query only active users
SELECT * FROM users
WHERE deleted_at IS NULL;

-- Create view for active users
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;
```

### Auditing

```sql
-- Audit log table
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  record_id INT NOT NULL,
  action VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);

-- Trigger function (PostgreSQL)
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to table
CREATE TRIGGER users_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

## Data Types

### Choose Appropriate Types

```sql
-- ✅ Good type choices
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,          -- Variable length string
  sku VARCHAR(50) UNIQUE NOT NULL,     -- Fixed pattern string
  price DECIMAL(10, 2) NOT NULL,       -- Exact decimal for money
  quantity INT NOT NULL DEFAULT 0,     -- Whole numbers
  weight DECIMAL(8, 2),                -- Decimal for measurements
  is_active BOOLEAN DEFAULT true,      -- Boolean flag
  description TEXT,                    -- Long text
  metadata JSONB,                      -- Structured data (PostgreSQL)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ❌ Avoid - inappropriate types
CREATE TABLE bad_products (
  id INT,                      -- Should be SERIAL
  price FLOAT,                 -- Imprecise for money
  quantity VARCHAR(10),        -- Should be INT
  is_active VARCHAR(5),        -- Should be BOOLEAN
  tags VARCHAR(1000)           -- Should be JSONB array or separate table
);
```

## Best Practices

1. **Normalize** data to 3NF, denormalize only when needed
2. **Use appropriate data types** for each column
3. **Add indexes** on foreign keys and frequently queried columns
4. **Use transactions** for related operations
5. **Implement constraints** (NOT NULL, UNIQUE, CHECK, FOREIGN KEY)
6. **Version migrations** and make them reversible
7. **Monitor query performance** with EXPLAIN
8. **Use connection pooling** for better resource management
9. **Implement soft deletes** for important data
10. **Add audit logging** for compliance and debugging
