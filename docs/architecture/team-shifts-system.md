# TimeHaupt Team Shifts & Scheduling System

## Overview

The TimeHaupt Team Shifts & Scheduling System is the core business logic that powers intelligent shift scheduling, team management, and workforce optimization. This system combines sophisticated algorithms, real-time collaboration, and AI-powered automation to create fair, efficient, and constraint-aware work schedules.

## 🏗️ Architecture Overview

### System Components

1. **Frontend Components**: React-based UI for schedule management
2. **Scheduler Engine**: Core algorithm implementation in `libs/scheduler/`
3. **Scheduler Worker**: Background processing for long-running operations
4. **GraphQL API**: Data access and business logic layer
5. **Database Layer**: DynamoDB storage for schedules and team data
6. **Business Logic**: Team management and schedule validation

### Design Principles

- **Fairness First**: Ensure equal distribution of work and inconvenience
- **Constraint-Aware**: Respect business rules, qualifications, and availability
- **Real-Time Collaboration**: Multiple users can edit schedules simultaneously
- **Draft/Publish Workflow**: Review changes before making them live
- **AI-Powered Optimization**: Automated shift assignment with human oversight

## 📅 Core Scheduling Concepts

### Shift Position

A **shift position** represents a work slot that needs to be filled:

```typescript
interface ShiftPosition {
  pk: string; // Team reference
  sk: string; // Day + unique identifier
  day: string; // Date (YYYY-MM-DD)
  name?: string; // Shift name/description
  color?: string; // Display color
  requiredSkills: string[]; // Required qualifications
  schedules: ShiftPositionSchedule[]; // Work hours and inconvenience
  assignedTo?: string; // Assigned worker reference
  version: number; // Version for optimistic locking
}
```

### Shift Schedule

Each shift position can have multiple work periods:

```typescript
interface ShiftPositionSchedule {
  startHourMinutes: number[]; // Start times in minutes (e.g., [9, 0] = 9:00 AM)
  endHourMinutes: number[]; // End times in minutes (e.g., [17, 0] = 5:00 PM)
  inconveniencePerHour: number; // Multiplier for inconvenience calculation
}
```

### Team Structure

Teams are organized hierarchically:

```
Company
├── Units
│   └── Teams
│       ├── Team Members (Users)
│       ├── Shift Positions
│       └── Day Templates
```

## 🤖 Scheduler Algorithm

### Core Algorithm: Brute Force Search

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
- Penalizes schedules where some workers get significantly more shifts

**Configuration**:

```typescript
heuristics: {
  "Worker Slot Equality": 1.0  // Multiplier for this heuristic
}
```

**Business Impact**: Ensures balanced workload distribution

### 3. Worker Slot Proximity

**Goal**: Optimize shift timing for worker convenience

**How it works**:

- Calculates deviation from estimated optimal shift proximity/frequency
- Considers worker preferences and natural work patterns
- Penalizes schedules with poor timing distribution

**Configuration**:

```typescript
heuristics: {
  "Worker Slot Proximity": 0.8  // Multiplier for this heuristic
}
```

**Business Impact**: Improves worker satisfaction and reduces fatigue

## 📋 Validation Rules

### Core Business Rules

#### 1. Minimum Frequency Rule

**Purpose**: Ensure workers get minimum required shifts per week

**Configuration**:

```typescript
rules: {
  minimumFrequency: {
    minimumShiftsPerWeek: 3,
    minimumShiftsPerMonth: 12
  }
}
```

#### 2. Maximum Inconvenience Rule

**Purpose**: Prevent excessive inconvenience for any worker

**Configuration**:

```typescript
rules: {
  maximumInconvenience: {
    maxInconveniencePerWeek: 20,
    maxInconveniencePerMonth: 80
  }
}
```

#### 3. Minimum Shifts Per Week Rule

**Purpose**: Ensure adequate coverage and worker engagement

**Configuration**:

```typescript
rules: {
  minimumShiftsInStandardWorkdayPerWeek: {
    minimumShifts: 2,
    standardWorkdayStart: 8, // 8:00 AM
    standardWorkdayEnd: 18   // 6:00 PM
  }
}
```

## 🔧 Configuration & Customization

### Scheduler Options

```typescript
interface SchedulerOptions {
  startDay: string; // Start date for scheduling
  endDay: string; // End date for scheduling
  respectLeaveSchedule: boolean; // Consider approved leave
  heuristics: Record<string, number>; // Heuristic weights
  rules: Partial<Record<RuleName, unknown>>; // Business rules
  workers: SlotWorker[]; // Available workers
  slots: Slot[]; // Shifts to be filled
  minimumRestSlotsAfterShift: Array<{
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }>;
}
```

### Heuristic Weighting

Users can customize the importance of each heuristic:

```typescript
const heuristics = {
  "Worker Inconvenience Equality": 1.0, // High priority
  "Worker Slot Equality": 0.8, // Medium priority
  "Worker Slot Proximity": 0.6, // Lower priority
};
```

### Rule Configuration

Business rules can be adjusted based on organizational needs:

```typescript
const rules = {
  minimumFrequency: {
    minimumShiftsPerWeek: 4, // Require 4 shifts per week
    minimumShiftsPerMonth: 16, // Require 16 shifts per month
  },
  maximumInconvenience: {
    maxInconveniencePerWeek: 15, // Max 15 inconvenience points per week
    maxInconveniencePerMonth: 60, // Max 60 inconvenience points per month
  },
};
```

## 🚀 Auto-Fill System

### Automated Shift Assignment

The auto-fill system automatically assigns workers to shifts based on:

1. **Qualifications**: Workers must have required skills
2. **Availability**: Workers must not have conflicting shifts
3. **Leave Schedule**: Workers must not be on approved leave
4. **Heuristics**: Assignment optimizes for fairness and efficiency

### Auto-Fill Process

```typescript
// 1. Prepare auto-fill parameters
const autoFillParams = await shiftsAutoFillParams({
  team: teamPk,
  startDay: "2024-03-01",
  endDay: "2024-03-31",
});

// 2. Execute auto-fill
const result = await assignShiftPositions({
  team: teamPk,
  assignments: autoFillParams.slots.map((slot) => ({
    shiftPositionId: slot.id,
    workerPk: slot.assignedWorkerPk,
  })),
});
```

### Auto-Fill Results

The system provides:

- **Assigned Workers**: Who was assigned to each shift
- **Coverage Analysis**: Which shifts remain unassigned
- **Qualification Gaps**: Skills needed for remaining shifts
- **Performance Metrics**: How well the assignment performed

## 📊 Schedule Management

### Draft/Publish Workflow

1. **Draft Mode**: Make changes without affecting live schedules
2. **Validation**: Check for conflicts and rule violations
3. **Review**: Team leads review proposed changes
4. **Publish**: Make changes live for all team members
5. **Revert**: Roll back to previous version if needed

### Version Control

Each schedule change creates a new version:

```typescript
interface ScheduleVersion {
  version: string; // Unique version identifier
  createdAt: string; // When the version was created
  createdBy: string; // Who created the version
  changes: ScheduleChange[]; // What changed in this version
  status: "draft" | "published" | "reverted";
}
```

### Conflict Resolution

The system handles concurrent edits through:

- **Optimistic Locking**: Version numbers prevent overwrites
- **Conflict Detection**: Identifies conflicting changes
- **Merge Strategies**: Automatic and manual conflict resolution
- **Audit Trail**: Complete history of all changes

## 🎨 Frontend Components

### Core Components

#### 1. TeamShiftsSchedule.tsx

- **Purpose**: Main schedule management interface
- **Features**: Calendar view, drag & drop, bulk operations
- **Size**: 41KB, 1194 lines

#### 2. ShiftsAutoFill.tsx

- **Purpose**: Automated shift assignment interface
- **Features**: Configuration, execution, progress tracking
- **Size**: 10KB, 326 lines

#### 3. TeamShiftsCalendar.tsx

- **Purpose**: Calendar visualization of schedules
- **Features**: Month/week/day views, filtering, navigation
- **Size**: 3.1KB, 97 lines

#### 4. CreateOrEditScheduleShiftPosition.tsx

- **Purpose**: Create and edit individual shifts
- **Features**: Form validation, qualification matching, time selection
- **Size**: 20KB, 554 lines

### User Interface Features

- **Drag & Drop**: Intuitive shift assignment and rescheduling
- **Real-Time Updates**: Live collaboration between team members
- **Filtering & Search**: Find specific shifts or workers quickly
- **Bulk Operations**: Assign multiple shifts at once
- **Visual Feedback**: Color coding and status indicators

## 🔄 Integration Points

### GraphQL API

The system exposes comprehensive GraphQL endpoints:

```graphql
type Query {
  shiftPositions(input: QueryShiftPositionsInput!): QueryShiftPositionsOutput!
  shiftsAutoFillParams(input: AutoFillParamsInput!): ShiftsAutoFillParams!
  team(teamPk: String!): Team!
}

type Mutation {
  createShiftPosition(input: CreateShiftPositionInput!): ShiftPosition!
  updateShiftPosition(input: UpdateShiftPositionInput!): ShiftPosition!
  assignShiftPositions(input: AssignShiftPositionsInput!): Boolean!
  publishShiftPositions(input: PublishShiftPositionsInput!): Boolean!
  revertShiftPositions(input: RevertShiftPositionsInput!): Boolean!
}
```

### Business Logic Integration

The system integrates with:

- **Team Management**: Member qualifications and permissions
- **Leave Management**: Worker availability and time-off
- **Permission System**: Access control for schedule operations
- **Notification System**: Alerts for schedule changes

### External Systems

- **Calendar Integration**: Export schedules to external calendars
- **Email Notifications**: Notify workers of schedule changes
- **Mobile Support**: Responsive design for mobile devices

## 📈 Performance & Scalability

### Algorithm Performance

- **Continuous Operation**: Runs indefinitely until stopped
- **Memory Management**: Efficient data structures for large schedules
- **Progress Tracking**: Real-time updates on search progress
- **Early Termination**: Can stop when acceptable solution found

### Scalability Considerations

- **Team Size**: Handles teams from 5 to 100+ workers
- **Schedule Duration**: Supports daily to yearly scheduling
- **Concurrent Users**: Multiple team members can edit simultaneously
- **Data Volume**: Efficient storage and retrieval of large schedules

### Optimization Strategies

- **Heuristic Weighting**: User-defined priorities for different goals
- **Rule Relaxation**: Configurable business rule strictness
- **Batch Processing**: Efficient handling of multiple operations
- **Caching**: Intelligent caching of frequently accessed data

## 🧪 Testing & Quality Assurance

### Testing Strategy

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: End-to-end workflow testing
3. **Performance Tests**: Algorithm efficiency validation
4. **User Acceptance Tests**: Real-world scenario validation

### Test Data Management

```typescript
// Create test team with workers
const testTeam = await createTeam({
  unitPk: "units/test-unit",
  name: "Test Team",
});

// Add test workers with qualifications
const worker1 = await createTeamMember({
  teamPk: testTeam.pk,
  name: "Test Worker 1",
  email: "worker1@test.com",
  permission: PERMISSION_LEVELS.READ,
});

// Create test shift positions
const shiftPosition = await createShiftPosition({
  team: testTeam.pk,
  day: "2024-03-15",
  requiredSkills: ["frontend"],
  schedules: [
    {
      startHourMinutes: [9, 0],
      endHourMinutes: [17, 0],
      inconveniencePerHour: 1.0,
    },
  ],
});
```

### Quality Metrics

- **Schedule Fairness**: Measure distribution equality
- **Constraint Satisfaction**: Verify business rule compliance
- **Performance**: Track algorithm execution time
- **User Satisfaction**: Monitor adoption and feedback

## 🚨 Common Issues & Solutions

### Issue: Auto-Fill Not Finding Solutions

**Symptoms**: Auto-fill runs indefinitely without finding valid schedules

**Causes**:

- Too many business rules conflicting with each other
- Insufficient workers with required qualifications
- Overly restrictive constraints

**Solutions**:

```typescript
// Relax business rules
const relaxedRules = {
  minimumFrequency: {
    minimumShiftsPerWeek: 2, // Reduce from 4 to 2
    minimumShiftsPerMonth: 8, // Reduce from 16 to 8
  },
};

// Add more flexible qualification matching
const flexibleQualifications = {
  allowPartialMatch: true,
  minimumMatchPercentage: 0.7,
};
```

### Issue: Unfair Work Distribution

**Symptoms**: Some workers get significantly more shifts or inconvenient times

**Causes**:

- Heuristic weights not properly balanced
- Business rules overriding fairness goals
- Insufficient worker availability

**Solutions**:

```typescript
// Adjust heuristic weights
const balancedHeuristics = {
  "Worker Inconvenience Equality": 1.5, // Increase fairness priority
  "Worker Slot Equality": 1.2, // Increase equality priority
  "Worker Slot Proximity": 0.5, // Reduce timing priority
};

// Add fairness rules
const fairnessRules = {
  maxShiftsDifference: 2, // Max 2 shifts difference between workers
  maxInconvenienceDifference: 10, // Max 10 inconvenience points difference
};
```

### Issue: Schedule Conflicts

**Symptoms**: Workers assigned to overlapping shifts or during leave

**Causes**:

- Leave schedule not properly integrated
- Concurrent edits creating conflicts
- Validation rules not enforced

**Solutions**:

```typescript
// Ensure leave schedule integration
const schedulerOptions = {
  respectLeaveSchedule: true,
  leaveBufferMinutes: 30, // 30-minute buffer around leave
};

// Add conflict detection
const conflictDetection = {
  checkOverlaps: true,
  checkLeaveConflicts: true,
  checkQualificationMismatches: true,
};
```

## 🔮 Future Enhancements

### Planned Features

1. **Machine Learning Integration**: Learn from user preferences and patterns
2. **Advanced Optimization**: Genetic algorithms and simulated annealing
3. **Predictive Analytics**: Forecast scheduling needs and conflicts
4. **Mobile App**: Native mobile applications for workers
5. **API Integrations**: Connect with external HR and payroll systems

### Technical Improvements

1. **Performance Optimization**: Faster algorithm execution
2. **Real-Time Collaboration**: Enhanced multi-user editing
3. **Advanced Reporting**: Comprehensive analytics and insights
4. **Workflow Automation**: Automated approval and notification processes
5. **Data Export**: Multiple format support for external systems

## 🤝 Contributing to the Scheduling System

### Development Guidelines

1. **Algorithm Changes**: Maintain fairness and efficiency principles
2. **UI Components**: Follow existing design patterns and accessibility standards
3. **Testing**: Comprehensive test coverage for all new features
4. **Documentation**: Update this document for any architectural changes
5. **Performance**: Monitor and optimize for large-scale usage

### Adding New Heuristics

```typescript
// 1. Create heuristic function
export const newHeuristic: ShiftScheduleHeuristic = {
  name: "New Heuristic",
  eval: (schedule: ShiftSchedule) => {
    // Calculate heuristic score
    let score = 0;
    // ... calculation logic
    return score;
  },
};

// 2. Add to heuristics array
export const heuristics = [
  workerInconvenienceEqualityHeuristic,
  workerSlotProximityHeuristic,
  workerSlotEqualityHeuristic,
  newHeuristic, // Add new heuristic
];

// 3. Update types and documentation
```

### Adding New Validation Rules

```typescript
// 1. Create rule function
export const newRule: ValidationRule = {
  id: "newRule",
  name: (ruleOptions: unknown) => "New Rule Description",
  function: (schedule, workers, ruleOptions) => {
    // Validate schedule
    const valid = /* validation logic */;
    return [valid, problemInSlotId];
  }
};

// 2. Add to rules array
const rules: ValidationRule[] = [
  minimumFrequency,
  maximumInconvenience,
  minimumShiftsInStandardWorkdayPerWeek,
  newRule  // Add new rule
];

// 3. Update rule types and configuration
```

---

**Version**: 1.0.0  
**Maintainer**: Development Team  
**Last Updated**: March 2024
