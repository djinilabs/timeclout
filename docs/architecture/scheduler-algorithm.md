# TT3 Scheduler Algorithm & Heuristics

## Overview

The TT3 scheduler is an AI-powered shift scheduling system that uses a brute force search approach to automatically assign workers to shifts while optimizing for fairness, efficiency, and business constraints. This document explains how the scheduler works, its key components, and how to configure it for optimal results.

## 🔍 Core Algorithm: Brute Force Search

The scheduler uses a **brute force search** approach that continuously generates and evaluates shift schedules:

1. **Random Generation**: Creates random initial schedules
2. **Validation**: Applies business rules to filter valid schedules
3. **Scoring**: Evaluates schedules using multiple heuristics
4. **Selection**: Keeps top-performing schedules
5. **Continuous Search**: Generates new schedules indefinitely
6. **User Control**: Continues until the user manually stops the process

### Key Characteristics

- **Non-deterministic**: Each run may produce slightly different results
- **Multi-objective**: Balances multiple competing goals
- **Constraint-aware**: Respects business rules and worker availability
- **Continuous**: Runs indefinitely until manually stopped

## 🎯 Heuristics System

The scheduler uses three primary heuristics to evaluate schedule quality:

### 1. Worker Inconvenience Equality

**Goal**: Ensure fair distribution of inconvenient shifts across workers

**How it works**:

- Calculates inconvenience score for each worker based on shift timing
- Measures deviation from equal distribution
- Penalizes schedules where some workers get significantly more inconvenient shifts

**Configuration**:

```typescript
heuristics: {
  "Worker Inconvenience Equality": 1.0  // Multiplier for this heuristic
}
```

**Business Impact**: Prevents worker burnout and ensures fair treatment

### 2. Worker Slot Equality

**Goal**: Distribute total work hours evenly across workers

**How it works**:

- Counts total shifts assigned to each worker
- Measures deviation from equal distribution
- Balances workload across team members

**Configuration**:

```typescript
heuristics: {
  "Worker Slot Equality": 1.0  // Multiplier for this heuristic
}
```

**Business Impact**: Prevents overwork and underutilization

### 3. Worker Slot Proximity

**Goal**: Optimize the frequency and timing of shifts for each worker

**How it works**:

- Calculates the deviation from estimated optimal shift proximity/frequency
- Measures how well the actual shift distribution matches expected patterns
- Penalizes schedules that deviate significantly from optimal timing

**Configuration**:

```typescript
heuristics: {
  "Worker Slot Proximity": 1.0  // Multiplier for this heuristic
}
```

**Business Impact**: Improves worker efficiency and reduces travel time

## ⚖️ Heuristic Configuration

### Priority Multipliers

Users define the weight of each heuristic in the final score calculation:

```typescript
heuristics: {
  "Worker Inconvenience Equality": 2.0,  // High priority
  "Worker Slot Equality": 1.5,           // Medium priority
  "Worker Slot Proximity": 1.0           // Standard priority
}
```

### Tuning Guidelines

| Business Goal           | Recommended Heuristic Weights                                   |
| ----------------------- | --------------------------------------------------------------- |
| **Fairness First**      | Inconvenience Equality: 2.0, Slot Equality: 1.5, Proximity: 1.0 |
| **Efficiency First**    | Proximity: 2.0, Inconvenience Equality: 1.5, Slot Equality: 1.0 |
| **Balanced Approach**   | All heuristics: 1.0                                             |
| **Custom Optimization** | Adjust based on specific business needs                         |

## 🔒 Business Rules & Constraints

The scheduler enforces business rules to ensure schedules are valid and practical:

### 1. Minimum Frequency Rule

**Purpose**: Prevent workers from being scheduled too frequently

**Configuration**:

```typescript
rules: {
  minimumFrequency: 24 * 60 * 60; // 24 hours in seconds
}
```

**Effect**: Ensures minimum rest period between shifts

### 2. Maximum Inconvenience Rule

**Purpose**: Prevent individual workers from accumulating excessive inconvenience

**Configuration**:

```typescript
rules: {
  maximumInconvenience: 100; // Maximum inconvenience score per worker
}
```

**Effect**: Protects worker well-being and prevents burnout

### 3. Minimum Shifts Per Week Rule

**Purpose**: Ensure workers get adequate work hours

**Configuration**:

```typescript
rules: {
  minimumShiftsInStandardWorkdayPerWeek: 3;
}
```

**Effect**: Maintains worker engagement and income stability

## 🚀 Scheduler Configuration

### Basic Configuration

```typescript
const schedulerOptions = {
  startDay: "2024-03-15",
  endDay: "2024-03-20",
  keepTopSolutionsCount: 10,
  heuristics: {
    "Worker Inconvenience Equality": 1.0,
    "Worker Slot Equality": 1.0,
    "Worker Slot Proximity": 1.0,
  },
  rules: {
    minimumFrequency: 24 * 60 * 60,
    maximumInconvenience: 100,
    minimumShiftsInStandardWorkdayPerWeek: 3,
  },
  workers: workerList,
  slots: shiftSlots,
  minimumRestSlotsAfterShift: [
    {
      inconvenienceLessOrEqualThan: 100,
      minimumRestMinutes: 60,
    },
  ],
  respectLeaveSchedule: true,
  locale: "en",
};
```

### Advanced Configuration

#### Rest Period Management

```typescript
minimumRestSlotsAfterShift: [
  {
    inconvenienceLessOrEqualThan: 50, // Low inconvenience shifts
    minimumRestMinutes: 30, // 30 minutes rest
  },
  {
    inconvenienceLessOrEqualThan: 100, // Medium inconvenience shifts
    minimumRestMinutes: 60, // 1 hour rest
  },
  {
    inconvenienceLessOrEqualThan: 200, // High inconvenience shifts
    minimumRestMinutes: 120, // 2 hours rest
  },
];
```

#### Solution Quality Control

```typescript
keepTopSolutionsCount: 20,  // Keep more solutions for better optimization
```

## 📊 Performance Characteristics

The scheduler runs continuously until manually stopped, with performance characteristics that depend on:

- **Number of Workers**: More workers increase computation complexity
- **Number of Shifts**: More shifts expand the solution space
- **Rule Complexity**: More rules increase validation overhead
- **Heuristic Count**: Additional heuristics have minimal performance impact

### Performance Tuning

```typescript
// For faster results (lower quality)
keepTopSolutionsCount: 5;

// For better results (slower)
keepTopSolutionsCount: 20;
```

## 🔧 Integration with Frontend

### Auto-Fill Workflow

The scheduler integrates with the frontend through the `ShiftsAutoFill` component:

```typescript
const client = new SchedulerWorkerClient();
client.start(schedulerOptions, (progress) => {
  // Handle real-time progress updates
  onProgress(progress);
});
```

### Progress Monitoring

The scheduler provides real-time progress updates:

- **Cycle Count**: Number of optimization iterations
- **Computed Schedules**: Valid schedules found
- **Discarded Reasons**: Why schedules were rejected
- **Problem Slots**: Specific shift conflicts identified

## 🧪 Testing & Validation

### Unit Tests

The scheduler includes comprehensive unit tests covering:

- Heuristic calculations
- Rule validation
- Schedule generation
- Performance characteristics

### Test Configuration

```typescript
// Test with minimal data for fast execution
const testOptions = {
  startDay: "2024-03-15",
  endDay: "2024-03-16",
  keepTopSolutionsCount: 3,
  workers: mockWorkers,
  slots: mockSlots,
  // ... other options
};
```

## 🚨 Common Issues & Solutions

### Issue: Scheduler Takes Too Long

**Causes**:

- Too many workers/shifts
- Complex rule combinations
- High `keepTopSolutionsCount`

**Solutions**:

- Reduce `keepTopSolutionsCount`
- Simplify rules
- Break scheduling into smaller time periods

### Issue: Poor Schedule Quality

**Causes**:

- Imbalanced heuristic weights
- Conflicting business rules
- Insufficient optimization time

**Solutions**:

- Adjust heuristic weights
- Review and simplify rules
- Increase `keepTopSolutionsCount`

### Issue: Inconsistent Results

**Causes**:

- Random schedule generation
- Different input data
- Timing variations

**Solutions**:

- Use consistent input data
- Set appropriate timeouts
- Consider deterministic mode for testing

## 🔮 Future Enhancements

### Planned Improvements

1. **Machine Learning Integration**: Learn from historical schedule quality
2. **Predictive Analytics**: Anticipate worker availability issues
3. **Multi-Objective Optimization**: Advanced Pareto frontier analysis
4. **Real-time Adaptation**: Dynamic rule adjustment based on conditions

### Custom Heuristics

The system is designed to support custom heuristics:

```typescript
interface CustomHeuristic {
  name: string;
  eval: (schedule: ShiftSchedule) => number;
  description: string;
}
```

## 📚 Related Documentation

- [GraphQL Resolvers](./graphql-resolvers.md) - How scheduler integrates with API
- [Database Schema](./database-schema.md) - Data structures for workers and shifts
- [Testing Strategy](./testing-strategy.md) - How to test scheduler functionality

## 🤝 Contributing to the Scheduler

### Adding New Heuristics

1. Create heuristic function in `libs/scheduler/src/heuristics/`
2. Add to heuristics array in `index.ts`
3. Update tests and documentation
4. Consider performance impact

### Adding New Rules

1. Create rule function in `libs/scheduler/src/rules/`
2. Add to rules array in `index.ts`
3. Update validation logic
4. Add comprehensive tests

### Performance Optimization

1. Profile heuristic calculations
2. Optimize rule validation
3. Consider caching strategies
4. Benchmark improvements

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: Development Team
