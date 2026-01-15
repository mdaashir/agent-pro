---
name: multi-agent-orchestration
description: 'Comprehensive guide to building multi-agent systems, agent collaboration patterns, and orchestration strategies (2025-2026 standards)'
---

# Multi-Agent Orchestration

A comprehensive skill for designing, building, and orchestrating multiple AI agents working together to solve complex problems. Based on 2025-2026 best practices including GitHub Copilot Agent Mode, Agent HQ platform, and modern multi-agent frameworks.

## Table of Contents

1. [Agent Architecture Fundamentals](#agent-architecture-fundamentals)
2. [Orchestration Patterns](#orchestration-patterns)
3. [Agent Communication](#agent-communication)
4. [Task Delegation & Routing](#task-delegation--routing)
5. [State Management](#state-management)
6. [Error Handling & Resilience](#error-handling--resilience)
7. [Implementation Examples](#implementation-examples)
8. [Best Practices](#best-practices)

## Agent Architecture Fundamentals

### Single Agent vs Multi-Agent

**When to Use Single Agent:**

- Simple, well-defined tasks
- Sequential workflows
- Limited domain knowledge required
- Prototyping and MVP development

**When to Use Multi-Agent:**

- Complex, multi-domain problems
- Parallel task execution needed
- Specialized expertise required
- Enterprise-scale applications
- High reliability requirements

### Agent Capabilities Model

```typescript
interface AgentCapabilities {
  id: string;
  name: string;
  description: string;
  tools: string[];
  specialization: string[];
  maxConcurrency: number;
  costPerToken: number;
  responseTime: number;
}

const codeReviewAgent: AgentCapabilities = {
  id: 'code-reviewer',
  name: 'Code Review Specialist',
  description: 'Expert in code quality, security, and best practices',
  tools: ['read', 'search', 'codebase'],
  specialization: ['code-review', 'security', 'performance'],
  maxConcurrency: 3,
  costPerToken: 0.001,
  responseTime: 2000, // ms
};

const testingAgent: AgentCapabilities = {
  id: 'testing-specialist',
  name: 'Testing Specialist',
  description: 'Expert in test creation and coverage analysis',
  tools: ['read', 'edit', 'search', 'terminalCommand'],
  specialization: ['unit-testing', 'integration-testing', 'e2e-testing'],
  maxConcurrency: 5,
  costPerToken: 0.0008,
  responseTime: 3000,
};
```

## Orchestration Patterns

### 1. Sequential Orchestration

Tasks executed one after another, output of one feeds into the next.

```typescript
class SequentialOrchestrator {
  async execute(agents: Agent[], context: Context): Promise<Result> {
    let currentContext = context;
    const results: Result[] = [];

    for (const agent of agents) {
      const result = await agent.execute(currentContext);
      results.push(result);

      // Each agent's output becomes input for next
      currentContext = {
        ...currentContext,
        previousResult: result,
      };
    }

    return this.aggregateResults(results);
  }
}

// Usage: Code Review → Fix Issues → Generate Tests → Deploy
const workflow = new SequentialOrchestrator();
await workflow.execute(
  [codeReviewAgent, codeFixer, testGenerator, deploymentAgent],
  initialContext
);
```

### 2. Parallel Orchestration

Multiple agents work simultaneously on independent tasks.

```typescript
class ParallelOrchestrator {
  async execute(agents: Agent[], context: Context): Promise<Result[]> {
    // Execute all agents concurrently
    const promises = agents.map((agent) => agent.execute(context));

    // Wait for all to complete
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => ({
      agent: agents[index].id,
      status: result.status,
      value: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  }
}

// Usage: Analyze code quality, security, performance simultaneously
const parallelCheck = new ParallelOrchestrator();
await parallelCheck.execute([qualityAgent, securityAgent, performanceAgent], codeContext);
```

### 3. Hierarchical Orchestration

Master agent delegates to specialized sub-agents.

```typescript
interface Task {
  type: string;
  complexity: 'low' | 'medium' | 'high';
  data: any;
}

class MasterAgent {
  private specialists: Map<string, Agent>;

  constructor() {
    this.specialists = new Map([
      ['code-review', new CodeReviewAgent()],
      ['testing', new TestingAgent()],
      ['documentation', new DocumentationAgent()],
      ['refactoring', new RefactoringAgent()],
    ]);
  }

  async delegate(task: Task): Promise<Result> {
    // Analyze task and select appropriate specialist
    const specialist = this.selectSpecialist(task);

    if (!specialist) {
      throw new Error(`No specialist found for task: ${task.type}`);
    }

    // Delegate to specialist
    const result = await specialist.execute(task);

    // Validate and potentially delegate to another specialist
    if (this.requiresAdditionalWork(result)) {
      const nextTask = this.createFollowUpTask(result);
      return this.delegate(nextTask);
    }

    return result;
  }

  private selectSpecialist(task: Task): Agent | null {
    // Intelligent routing based on task characteristics
    if (task.type === 'code-review') {
      return this.specialists.get('code-review');
    } else if (task.type.includes('test')) {
      return this.specialists.get('testing');
    }
    // ... more routing logic
    return null;
  }

  private requiresAdditionalWork(result: Result): boolean {
    // Check if result requires follow-up work
    return result.suggestions?.length > 0 || result.errors?.length > 0;
  }

  private createFollowUpTask(result: Result): Task {
    // Create next task based on result
    return {
      type: 'refactoring',
      complexity: 'medium',
      data: result.suggestions,
    };
  }
}
```

### 4. Dynamic Orchestration (Agent HQ Pattern)

Agents self-organize based on task requirements.

```typescript
class AgentHQ {
  private availableAgents: Agent[];
  private taskQueue: Task[];
  private activeAssignments: Map<string, Agent>;

  constructor(agents: Agent[]) {
    this.availableAgents = agents;
    this.taskQueue = [];
    this.activeAssignments = new Map();
  }

  async orchestrate(tasks: Task[]): Promise<Result[]> {
    this.taskQueue = [...tasks];
    const results: Result[] = [];

    while (this.taskQueue.length > 0 || this.activeAssignments.size > 0) {
      // Assign tasks to available agents
      await this.assignTasks();

      // Wait for any agent to complete
      const completed = await this.waitForCompletion();
      results.push(...completed);
    }

    return results;
  }

  private async assignTasks(): Promise<void> {
    while (this.taskQueue.length > 0 && this.hasAvailableAgent()) {
      const task = this.taskQueue.shift()!;
      const agent = this.selectBestAgent(task);

      if (agent) {
        this.activeAssignments.set(task.id, agent);
        agent.execute(task); // Fire and forget, monitored separately
      }
    }
  }

  private selectBestAgent(task: Task): Agent | null {
    // Score agents based on:
    // - Specialization match
    // - Current load
    // - Historical performance
    // - Cost efficiency

    const scores = this.availableAgents.map((agent) => ({
      agent,
      score: this.calculateAgentScore(agent, task),
    }));

    scores.sort((a, b) => b.score - a.score);

    return scores[0]?.score > 0.5 ? scores[0].agent : null;
  }

  private calculateAgentScore(agent: Agent, task: Task): number {
    let score = 0;

    // Specialization match (40%)
    const specializationMatch = agent.capabilities.specialization.some((s) =>
      task.type.includes(s)
    );
    score += specializationMatch ? 0.4 : 0;

    // Load balancing (30%)
    const loadScore = 1 - agent.currentLoad / agent.capabilities.maxConcurrency;
    score += loadScore * 0.3;

    // Performance history (20%)
    const perfScore = agent.performanceHistory.successRate;
    score += perfScore * 0.2;

    // Cost efficiency (10%)
    const costScore = 1 - agent.capabilities.costPerToken / 0.01;
    score += Math.max(0, costScore) * 0.1;

    return score;
  }

  private hasAvailableAgent(): boolean {
    return this.availableAgents.some(
      (agent) => agent.currentLoad < agent.capabilities.maxConcurrency
    );
  }

  private async waitForCompletion(): Promise<Result[]> {
    // Wait for at least one agent to complete
    const activePromises = Array.from(this.activeAssignments.entries()).map(([taskId, agent]) => ({
      taskId,
      agent,
      promise: agent.waitForCompletion(),
    }));

    const completed = await Promise.race(activePromises.map((a) => a.promise));

    // Remove completed from active assignments
    this.activeAssignments.delete(completed.taskId);

    return [completed.result];
  }
}
```

## Agent Communication

### Message Passing

```typescript
interface Message {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'event';
  payload: any;
  timestamp: number;
  correlationId?: string; // For tracking request-response pairs
}

class MessageBus {
  private subscribers: Map<string, Set<(msg: Message) => void>>;
  private messageHistory: Message[];

  constructor() {
    this.subscribers = new Map();
    this.messageHistory = [];
  }

  subscribe(agentId: string, handler: (msg: Message) => void): void {
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, new Set());
    }
    this.subscribers.get(agentId)!.add(handler);
  }

  async publish(message: Message): Promise<void> {
    this.messageHistory.push(message);

    // Direct message
    if (message.to !== '*') {
      const handlers = this.subscribers.get(message.to);
      if (handlers) {
        handlers.forEach((handler) => handler(message));
      }
      return;
    }

    // Broadcast message
    this.subscribers.forEach((handlers, agentId) => {
      if (agentId !== message.from) {
        handlers.forEach((handler) => handler(message));
      }
    });
  }

  async request(from: string, to: string, payload: any): Promise<any> {
    const correlationId = this.generateId();

    return new Promise((resolve, reject) => {
      // Set up response handler
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      const responseHandler = (msg: Message) => {
        if (msg.correlationId === correlationId && msg.type === 'response') {
          clearTimeout(timeout);
          this.subscribers.get(from)!.delete(responseHandler);
          resolve(msg.payload);
        }
      };

      this.subscribe(from, responseHandler);

      // Send request
      this.publish({
        id: this.generateId(),
        from,
        to,
        type: 'request',
        payload,
        timestamp: Date.now(),
        correlationId,
      });
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Shared Context

```typescript
class SharedContext {
  private data: Map<string, any>;
  private locks: Map<string, string>; // key -> agentId holding lock
  private watchers: Map<string, Set<(value: any) => void>>;

  constructor() {
    this.data = new Map();
    this.locks = new Map();
    this.watchers = new Map();
  }

  async get(key: string): Promise<any> {
    return this.data.get(key);
  }

  async set(key: string, value: any, agentId: string): Promise<void> {
    // Check if locked by another agent
    const lockHolder = this.locks.get(key);
    if (lockHolder && lockHolder !== agentId) {
      throw new Error(`Key ${key} is locked by agent ${lockHolder}`);
    }

    this.data.set(key, value);

    // Notify watchers
    const watchers = this.watchers.get(key);
    if (watchers) {
      watchers.forEach((watcher) => watcher(value));
    }
  }

  async lock(key: string, agentId: string): Promise<boolean> {
    if (this.locks.has(key)) {
      return false;
    }

    this.locks.set(key, agentId);
    return true;
  }

  async unlock(key: string, agentId: string): Promise<void> {
    if (this.locks.get(key) === agentId) {
      this.locks.delete(key);
    }
  }

  watch(key: string, callback: (value: any) => void): () => void {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, new Set());
    }

    this.watchers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.watchers.get(key)?.delete(callback);
    };
  }
}
```

## Task Delegation & Routing

### Skill-Based Routing

```typescript
interface AgentSkill {
  name: string;
  proficiency: number; // 0-1
  examples: string[];
}

class SkillBasedRouter {
  private agents: Map<string, Agent>;
  private skillMatrix: Map<string, Map<string, number>>; // agentId -> skill -> proficiency

  constructor(agents: Agent[]) {
    this.agents = new Map(agents.map((a) => [a.id, a]));
    this.buildSkillMatrix(agents);
  }

  private buildSkillMatrix(agents: Agent[]): void {
    this.skillMatrix = new Map();

    agents.forEach((agent) => {
      const skills = new Map<string, number>();
      agent.skills.forEach((skill) => {
        skills.set(skill.name, skill.proficiency);
      });
      this.skillMatrix.set(agent.id, skills);
    });
  }

  selectAgent(requiredSkills: string[]): Agent | null {
    let bestAgent: Agent | null = null;
    let bestScore = 0;

    this.agents.forEach((agent) => {
      const agentSkills = this.skillMatrix.get(agent.id)!;

      // Calculate match score
      const score =
        requiredSkills.reduce((sum, skill) => {
          return sum + (agentSkills.get(skill) || 0);
        }, 0) / requiredSkills.length;

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    });

    return bestScore > 0.5 ? bestAgent : null;
  }
}
```

### Load Balancing

```typescript
class LoadBalancer {
  private agents: Agent[];
  private roundRobinIndex = 0;

  constructor(agents: Agent[]) {
    this.agents = agents;
  }

  // Round robin
  getNextAgent(): Agent {
    const agent = this.agents[this.roundRobinIndex];
    this.roundRobinIndex = (this.roundRobinIndex + 1) % this.agents.length;
    return agent;
  }

  // Least connections
  getLeastLoadedAgent(): Agent {
    return this.agents.reduce((least, current) => {
      return current.currentLoad < least.currentLoad ? current : least;
    });
  }

  // Weighted distribution
  getWeightedAgent(): Agent {
    const totalWeight = this.agents.reduce((sum, a) => sum + a.weight, 0);
    let random = Math.random() * totalWeight;

    for (const agent of this.agents) {
      random -= agent.weight;
      if (random <= 0) {
        return agent;
      }
    }

    return this.agents[this.agents.length - 1];
  }
}
```

## State Management

### Workflow State Machine

```typescript
enum WorkflowState {
  IDLE = 'idle',
  PLANNING = 'planning',
  EXECUTING = 'executing',
  REVIEWING = 'reviewing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

interface WorkflowTransition {
  from: WorkflowState;
  to: WorkflowState;
  condition?: (context: any) => boolean;
  action?: (context: any) => Promise<void>;
}

class WorkflowStateMachine {
  private state: WorkflowState = WorkflowState.IDLE;
  private transitions: WorkflowTransition[];

  constructor(transitions: WorkflowTransition[]) {
    this.transitions = transitions;
  }

  async transition(to: WorkflowState, context: any): Promise<boolean> {
    const validTransition = this.transitions.find((t) => t.from === this.state && t.to === to);

    if (!validTransition) {
      throw new Error(`Invalid transition: ${this.state} -> ${to}`);
    }

    // Check condition
    if (validTransition.condition && !validTransition.condition(context)) {
      return false;
    }

    // Execute action
    if (validTransition.action) {
      await validTransition.action(context);
    }

    this.state = to;
    return true;
  }

  getCurrentState(): WorkflowState {
    return this.state;
  }
}
```

## Error Handling & Resilience

### Retry Strategy

```typescript
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

class RetryStrategy {
  constructor(private config: RetryConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let attempt = 0;
    let delay = this.config.initialDelay;

    while (attempt < this.config.maxAttempts) {
      try {
        return await fn();
      } catch (error) {
        attempt++;

        if (!this.isRetryable(error) || attempt >= this.config.maxAttempts) {
          throw error;
        }

        await this.sleep(delay);
        delay = Math.min(delay * this.config.backoffMultiplier, this.config.maxDelay);
      }
    }

    throw new Error('Max retry attempts reached');
  }

  private isRetryable(error: any): boolean {
    return this.config.retryableErrors.some((retryable) => error.message?.includes(retryable));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

### Circuit Breaker

```typescript
enum CircuitState {
  CLOSED = 'closed', // Normal operation
  OPEN = 'open', // Failing, reject requests
  HALF_OPEN = 'half-open', // Testing if recovered
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private failureThreshold: number,
    private resetTimeout: number
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}
```

## Implementation Examples

### Example: PR Review Multi-Agent System

```typescript
class PRReviewOrchestrator {
  private agents = {
    codeQuality: new CodeQualityAgent(),
    security: new SecurityAgent(),
    performance: new PerformanceAgent(),
    testing: new TestingAgent(),
  };

  async reviewPullRequest(prNumber: number): Promise<ReviewResult> {
    // Phase 1: Parallel analysis
    const analysisResults = await Promise.all([
      this.agents.codeQuality.analyze(prNumber),
      this.agents.security.analyze(prNumber),
      this.agents.performance.analyze(prNumber),
      this.agents.testing.analyze(prNumber),
    ]);

    // Phase 2: Aggregate findings
    const aggregated = this.aggregateFindings(analysisResults);

    // Phase 3: Generate comprehensive review
    const review = await this.generateReview(aggregated);

    return review;
  }

  private aggregateFindings(results: AnalysisResult[]): AggregatedFindings {
    return {
      critical: results.flatMap((r) => r.critical),
      warnings: results.flatMap((r) => r.warnings),
      suggestions: results.flatMap((r) => r.suggestions),
      score: this.calculateOverallScore(results),
    };
  }
}
```

## Best Practices

### 1. Design Principles

- **Single Responsibility**: Each agent has one clear purpose
- **Loose Coupling**: Agents communicate through well-defined interfaces
- **High Cohesion**: Related capabilities grouped together
- **Fail Independently**: One agent failure doesn't cascade
- **Observable**: All agent actions are logged and traceable

### 2. Performance Optimization

- **Parallel Execution**: Run independent tasks simultaneously
- **Caching**: Share results between agents when possible
- **Load Balancing**: Distribute work evenly across agents
- **Resource Limits**: Prevent any single agent from consuming all resources

### 3. Cost Management

- **Agent Selection**: Choose most cost-effective agent for task
- **Result Caching**: Avoid redundant LLM calls
- **Token Optimization**: Minimize context size
- **Budget Tracking**: Monitor and limit spending per workflow

### 4. Quality Assurance

- **Testing**: Unit test individual agents and integration test workflows
- **Monitoring**: Track success rates, latency, and errors
- **Validation**: Verify agent outputs meet quality standards
- **Fallback**: Have backup plans when agents fail

## Summary

Multi-agent orchestration enables building sophisticated AI systems by:

1. **Specialization**: Each agent focuses on specific expertise
2. **Scalability**: Add agents to handle increased load
3. **Reliability**: Redundancy and fault tolerance
4. **Flexibility**: Dynamic workflows adapt to changing requirements
5. **Maintainability**: Modular design simplifies updates

Choose orchestration patterns based on your needs:

- **Sequential**: When order matters
- **Parallel**: For independent tasks
- **Hierarchical**: For complex delegation
- **Dynamic**: For adaptive, self-organizing systems
