---
name: graphql-microservices
description: 'GraphQL Federation, microservices patterns, SAGA, CQRS, event-driven architecture, and service mesh (2025-2026 standards)'
---

# GraphQL & Microservices Architecture

Comprehensive guide to building modern distributed systems with GraphQL Federation, microservices patterns, event-driven architecture, and service mesh integration based on 2025-2026 industry standards.

## Table of Contents

1. [GraphQL Federation 2.10](#graphql-federation-210)
2. [Microservices Design Patterns](#microservices-design-patterns)
3. [Event-Driven Architecture](#event-driven-architecture)
4. [SAGA Pattern](#saga-pattern)
5. [CQRS Pattern](#cqrs-pattern)
6. [Service Mesh](#service-mesh)
7. [API Gateway Patterns](#api-gateway-patterns)

## GraphQL Federation 2.10

### What's New in Federation 2.10 (Feb 2025)

**Key Features:**

- AI-agent integration via MCP (Model Context Protocol)
- Event-driven subscriptions at scale
- Declarative API orchestration
- Enhanced batch operations
- Better schema composition

### Federated Schema Design

```graphql
# Products subgraph
extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.10"
    import: ["@key", "@shareable", "@external", "@requires", "@provides"]
  )

type Product @key(fields: "id") {
  id: ID!
  name: String!
  price: Float!
  reviews: [Review!]! @provides(fields: "rating")
}

type Query {
  product(id: ID!): Product
  products(limit: Int = 10): [Product!]!
}

# Reviews subgraph
extend schema @link(url: "https://specs.apollo.dev/federation/v2.10", import: ["@key", "@external"])

type Product @key(fields: "id") {
  id: ID! @external
  reviews: [Review!]!
  averageRating: Float!
}

type Review {
  id: ID!
  product: Product!
  rating: Int!
  comment: String
  author: User!
}

extend type Query {
  review(id: ID!): Review
}

# Users subgraph
type User @key(fields: "id") {
  id: ID!
  email: String!
  name: String!
  reviews: [Review!]!
}
```

### Apollo Gateway Setup

```typescript
import { ApolloServer } from '@apollo/server';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'products', url: 'http://products:4001/graphql' },
      { name: 'reviews', url: 'http://reviews:4002/graphql' },
      { name: 'users', url: 'http://users:4003/graphql' },
    ],
    pollIntervalInMs: 10000, // Poll every 10s for schema changes
  }),

  // Custom query plan logging
  experimental_didResolveQueryPlan({ queryPlan, requestContext }) {
    if (requestContext.operationName !== 'IntrospectionQuery') {
      console.log('Query Plan:', JSON.stringify(queryPlan, null, 2));
    }
  },

  // Custom data source
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        // Forward auth headers
        request.http?.headers.set('authorization', context.token || '');

        // Enable Apollo tracing
        request.http?.headers.set('apollo-federation-include-trace', 'ftv1');
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  plugins: [ApolloServerPluginInlineTrace()],
});

await server.start();
```

### GraphQL Subscriptions (Real-Time)

```typescript
// Subgraph with subscriptions
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const typeDefs = `
  type Subscription {
    orderUpdated(userId: ID!): Order!
    newNotification(userId: ID!): Notification!
  }

  type Order {
    id: ID!
    status: OrderStatus!
    items: [OrderItem!]!
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
  }
`;

const resolvers = {
  Subscription: {
    orderUpdated: {
      subscribe: (_, { userId }) => {
        return pubsub.asyncIterator([`ORDER_UPDATED_${userId}`]);
      },
    },
    newNotification: {
      subscribe: (_, { userId }) => {
        return pubsub.asyncIterator([`NOTIFICATION_${userId}`]);
      },
    },
  },
  Mutation: {
    updateOrderStatus: async (_, { orderId, status }, { user }) => {
      const order = await updateOrder(orderId, status);

      // Publish to subscribers
      await pubsub.publish(`ORDER_UPDATED_${order.userId}`, {
        orderUpdated: order,
      });

      return order;
    },
  },
};
```

## Microservices Design Patterns

### 1. Service Mesh Pattern (Istio)

```yaml
# Istio service mesh configuration
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - match:
        - headers:
            end-user:
              exact: jason
      route:
        - destination:
            host: reviews
            subset: v2 # Canary for specific user
    - route:
        - destination:
            host: reviews
            subset: v1
          weight: 90
        - destination:
            host: reviews
            subset: v2
          weight: 10 # 10% canary traffic

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

### 2. Circuit Breaker Pattern (Resilience4j)

```typescript
import { CircuitBreaker, CircuitBreakerConfig } from 'resilience4j';

// Configure circuit breaker
const config: CircuitBreakerConfig = {
  failureRateThreshold: 50, // Open if 50% failures
  waitDurationInOpenState: 60000, // Wait 60s before half-open
  permittedNumberOfCallsInHalfOpenState: 3,
  slidingWindowSize: 10,
  minimumNumberOfCalls: 5,
};

const circuitBreaker = new CircuitBreaker('orders-service', config);

// Use circuit breaker
async function callOrdersService(orderId: string) {
  return circuitBreaker.execute(async () => {
    const response = await fetch(`http://orders-service/orders/${orderId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  });
}

// Handle circuit breaker events
circuitBreaker.on('stateChange', (state) => {
  console.log(`Circuit breaker state: ${state}`);

  if (state === 'OPEN') {
    // Alert operations team
    alerting.send({
      service: 'orders-service',
      message: 'Circuit breaker opened due to failures',
      severity: 'critical',
    });
  }
});

circuitBreaker.on('fallback', (error) => {
  // Return cached data or default
  return getCachedOrder(orderId) || getDefaultOrder();
});
```

### 3. API Gateway Pattern (Backend for Frontend)

```typescript
// API Gateway with BFF pattern
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Mobile BFF - Optimized for mobile clients
app.use(
  '/mobile/api',
  createProxyMiddleware({
    router: async (req) => {
      // Route based on request
      if (req.path.startsWith('/products')) {
        return 'http://products-service-mobile:3001';
      } else if (req.path.startsWith('/orders')) {
        return 'http://orders-service-mobile:3002';
      }
      return 'http://api-service:3000';
    },
    pathRewrite: { '^/mobile/api': '' },
    onProxyReq: (proxyReq, req) => {
      // Add mobile-specific headers
      proxyReq.setHeader('X-Client-Type', 'mobile');
      proxyReq.setHeader('X-Device-Id', req.headers['x-device-id'] || '');
    },
  })
);

// Web BFF - Optimized for web clients
app.use(
  '/web/api',
  createProxyMiddleware({
    router: async (req) => {
      if (req.path.startsWith('/products')) {
        return 'http://products-service-web:3001';
      } else if (req.path.startsWith('/orders')) {
        return 'http://orders-service-web:3002';
      }
      return 'http://api-service:3000';
    },
    pathRewrite: { '^/web/api': '' },
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader('X-Client-Type', 'web');
    },
  })
);

// API Composition
app.get('/api/product/:id/complete', async (req, res) => {
  const { id } = req.params;

  // Fetch from multiple services in parallel
  const [product, reviews, inventory] = await Promise.all([
    fetch(`http://products-service/products/${id}`).then((r) => r.json()),
    fetch(`http://reviews-service/reviews?productId=${id}`).then((r) => r.json()),
    fetch(`http://inventory-service/inventory/${id}`).then((r) => r.json()),
  ]);

  // Compose response
  res.json({
    ...product,
    reviews,
    stock: inventory.quantity,
    available: inventory.quantity > 0,
  });
});
```

## Event-Driven Architecture

### Event Bus (RabbitMQ/Kafka)

```typescript
// Event publisher
import { connect, Channel } from 'amqplib';

class EventBus {
  private channel: Channel | null = null;

  async connect() {
    const connection = await connect('amqp://localhost');
    this.channel = await connection.createChannel();

    // Declare exchange
    await this.channel.assertExchange('events', 'topic', { durable: true });
  }

  async publish(eventType: string, data: any) {
    if (!this.channel) throw new Error('Not connected');

    const event = {
      id: generateId(),
      type: eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    this.channel.publish('events', eventType, Buffer.from(JSON.stringify(event)), {
      persistent: true,
    });

    console.log(`Published event: ${eventType}`, event);
  }
}

// Event subscriber
class EventSubscriber {
  async subscribe(eventPattern: string, handler: (event: any) => Promise<void>) {
    const connection = await connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange('events', 'topic', { durable: true });

    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, 'events', eventPattern);

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString());

      try {
        await handler(event);
        channel.ack(msg);
      } catch (error) {
        console.error('Error handling event:', error);
        // Reject and requeue (with exponential backoff in production)
        channel.nack(msg, false, true);
      }
    });
  }
}

// Usage
const eventBus = new EventBus();
await eventBus.connect();

// Publish events
await eventBus.publish('order.created', {
  orderId: '123',
  userId: '456',
  total: 99.99,
});

// Subscribe to events
const subscriber = new EventSubscriber();

await subscriber.subscribe('order.*', async (event) => {
  console.log('Order event received:', event);

  if (event.type === 'order.created') {
    await sendOrderConfirmationEmail(event.data);
  } else if (event.type === 'order.shipped') {
    await sendShippingNotification(event.data);
  }
});
```

## SAGA Pattern

### Choreography-Based SAGA

```typescript
// Order service publishes event
async function createOrder(orderData: OrderData) {
  const order = await db.orders.create({
    ...orderData,
    status: 'PENDING',
  });

  // Publish event
  await eventBus.publish('order.created', {
    orderId: order.id,
    userId: order.userId,
    items: order.items,
    total: order.total,
  });

  return order;
}

// Payment service listens and processes
await subscriber.subscribe('order.created', async (event) => {
  const { orderId, userId, total } = event.data;

  try {
    // Process payment
    const payment = await processPayment(userId, total);

    // Publish success event
    await eventBus.publish('payment.completed', {
      orderId,
      paymentId: payment.id,
      amount: total,
    });
  } catch (error) {
    // Publish failure event
    await eventBus.publish('payment.failed', {
      orderId,
      reason: error.message,
    });
  }
});

// Inventory service listens to payment success
await subscriber.subscribe('payment.completed', async (event) => {
  const { orderId } = event.data;
  const order = await getOrder(orderId);

  try {
    // Reserve inventory
    await reserveInventory(order.items);

    // Publish success
    await eventBus.publish('inventory.reserved', { orderId });
  } catch (error) {
    // Publish failure - triggers compensation
    await eventBus.publish('inventory.failed', {
      orderId,
      reason: error.message,
    });
  }
});

// Order service handles compensation
await subscriber.subscribe('inventory.failed', async (event) => {
  const { orderId } = event.data;

  // Update order status
  await db.orders.update(orderId, { status: 'CANCELLED' });

  // Trigger payment refund
  await eventBus.publish('payment.refund', { orderId });
});
```

### Orchestration-Based SAGA (Temporal.io)

```typescript
import { proxyActivities, sleep } from '@temporalio/workflow';
import type * as activities from './activities';

const { reserveInventory, processPayment, shipOrder } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3,
  },
});

// Workflow defines the saga
export async function orderWorkflow(orderData: OrderData): Promise<string> {
  let inventoryReserved = false;
  let paymentProcessed = false;

  try {
    // Step 1: Reserve inventory
    await reserveInventory(orderData.items);
    inventoryReserved = true;

    // Step 2: Process payment
    await processPayment(orderData.userId, orderData.total);
    paymentProcessed = true;

    // Step 3: Ship order
    const trackingNumber = await shipOrder(orderData.orderId);

    return trackingNumber;
  } catch (error) {
    // Compensation logic
    if (paymentProcessed) {
      await refundPayment(orderData.userId, orderData.total);
    }

    if (inventoryReserved) {
      await releaseInventory(orderData.items);
    }

    throw error;
  }
}
```

## CQRS Pattern

```typescript
// Command side (Write)
class CreateOrderCommand {
  constructor(
    public userId: string,
    public items: OrderItem[],
    public shippingAddress: Address
  ) {}
}

class OrderCommandHandler {
  async handle(command: CreateOrderCommand): Promise<string> {
    // Validate command
    this.validate(command);

    // Create order
    const order = await db.orders.create({
      userId: command.userId,
      items: command.items,
      shippingAddress: command.shippingAddress,
      status: 'PENDING',
      createdAt: new Date(),
    });

    // Publish domain event
    await eventBus.publish('OrderCreated', {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      total: order.total,
    });

    return order.id;
  }

  private validate(command: CreateOrderCommand) {
    if (!command.items || command.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    // ... more validation
  }
}

// Query side (Read) - Denormalized views
class OrderQueryHandler {
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    // Read from read-optimized view
    return await readDb.orderDetails.findOne({ orderId });
  }

  async getUserOrders(userId: string): Promise<OrderSummary[]> {
    // Read from denormalized view
    return await readDb.userOrders.find({ userId });
  }
}

// Event handler updates read models
await subscriber.subscribe('OrderCreated', async (event) => {
  const { orderId, userId, items, total } = event.data;

  // Update OrderDetails view
  await readDb.orderDetails.create({
    orderId,
    userId,
    items,
    total,
    status: 'PENDING',
    createdAt: new Date(),
  });

  // Update UserOrders view
  await readDb.userOrders.create({
    userId,
    orderId,
    total,
    status: 'PENDING',
    createdAt: new Date(),
  });
});
```

## Service Mesh

### Istio Configuration

```yaml
# Traffic management
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: myapp-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - '*.example.com'
    - port:
        number: 443
        name: https
        protocol: HTTPS
      tls:
        mode: SIMPLE
        credentialName: example-com-cert
      hosts:
        - '*.example.com'

---
# Retry policy
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: orders
spec:
  hosts:
    - orders
  http:
    - retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure,refused-stream
      route:
        - destination:
            host: orders
            port:
              number: 8080

---
# Mutual TLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT

---
# Authorization policy
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: orders-policy
spec:
  selector:
    matchLabels:
      app: orders
  rules:
    - from:
        - source:
            principals: ['cluster.local/ns/default/sa/web-frontend']
      to:
        - operation:
            methods: ['GET', 'POST']
            paths: ['/orders/*']
```

## Best Practices

### 1. Microservices

- **Single responsibility** per service
- **Database per service** (no shared databases)
- **API versioning** for backward compatibility
- **Distributed tracing** (OpenTelemetry)
- **Service discovery** (Consul, Eureka)
- **Health checks** and circuit breakers

### 2. GraphQL Federation

- **Schema versioning** with @link directive
- **Avoid N+1 queries** with DataLoader
- **Implement caching** (Redis, Apollo Cache)
- **Monitor query complexity**
- **Use subscriptions** sparingly (resource intensive)

### 3. Event-Driven

- **Idempotent handlers** (handle duplicates)
- **Event versioning** for schema evolution
- **Dead letter queues** for failed events
- **Event sourcing** for audit trail
- **Saga pattern** for distributed transactions

## Summary

Modern distributed systems combine:

- **GraphQL Federation** for unified API
- **Microservices** for scalability
- **Event-Driven** for decoupling
- **SAGA** for distributed transactions
- **CQRS** for read/write optimization
- **Service Mesh** for observability

Choose patterns based on your needs:

- **Small teams** → Modular monolith
- **Medium scale** → Microservices + API gateway
- **Large scale** → Full federation + service mesh
- **Complex workflows** → Event-driven + SAGA
