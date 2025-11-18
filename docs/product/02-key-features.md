# TimeClout Key Features Explained

This document provides detailed explanations of TimeClout's features to help customer service agents answer questions and guide customers.

## 1. Intelligent Shift Scheduling

### Smart Auto-Fill

**What it is**: AI-powered automatic shift assignment that creates optimal schedules in minutes.

**How it works**:
1. User selects a date range and clicks "Start Auto-Fill"
2. System analyzes:
   - Worker qualifications and availability
   - Leave schedules and existing commitments
   - Required skills for each shift
   - Work schedules and business rules
3. Scheduler generates multiple schedule solutions
4. Evaluates each solution using fairness heuristics:
   - Worker Inconvenience Equality (fair distribution of inconvenient shifts)
   - Worker Slot Equality (equal distribution of total hours)
   - Worker Slot Proximity (optimal shift timing)
   - Avoid Non-Work Day First Shift (protect weekend premium pay)
5. User can stop when satisfied with results
6. User reviews and applies the best solution

**Key Benefits**:
- Reduces scheduling time by up to 80%
- Ensures fair distribution of shifts
- Automatically handles qualification matching
- Prevents scheduling conflicts

**Common Customer Questions**:

**Q: "How long does auto-fill take?"**
A: Typically 2-5 minutes, but it runs continuously until you stop it. The longer it runs, the better the results get. You can stop it anytime you're satisfied with the schedule quality.

**Q: "Can I adjust the auto-fill results?"**
A: Yes! Auto-fill creates a draft schedule that you can review and manually adjust before publishing. You can drag and drop workers, add or remove shifts, and make any changes you need.

**Q: "What if auto-fill can't find a solution?"**
A: The system will show you which shifts are problematic (e.g., not enough qualified workers, too many conflicts). You can adjust the shifts, add more workers, or modify requirements to resolve the issues.

### Drag & Drop Interface

**What it is**: Visual calendar-based scheduling where you can drag workers to shifts or move shifts between days.

**How it works**:
1. View schedule in calendar format
2. Drag a worker's name to a shift position to assign them
3. Drag a shift position to a different day to move it
4. System validates in real-time:
   - Qualification matches
   - No overlapping shifts
   - No leave conflicts
5. Visual feedback shows conflicts immediately

**Key Benefits**:
- Intuitive - no training required
- Fast manual adjustments
- Visual understanding of coverage
- Works on mobile devices

**Common Customer Questions**:

**Q: "Can I drag shifts on mobile?"**
A: Yes, the interface is touch-optimized and works on mobile browsers. You can tap and drag just like on desktop.

**Q: "What happens if I drag someone to a shift they're not qualified for?"**
A: The system will show a warning indicator. You can still assign them, but the conflict will be highlighted so you know to address it.

### Position Templates

**What it is**: Reusable shift templates for consistent scheduling patterns.

**How it works**:
1. Create a template with:
   - Shift name (e.g., "Morning Shift")
   - Time range
   - Required qualifications
   - Inconvenience level
   - Color coding
2. Save template for reuse
3. Drag template to calendar days to create shifts
4. Customize individual shifts as needed

**Key Benefits**:
- Create once, use many times
- Consistency across schedules
- Faster schedule creation
- Easy updates across all similar shifts

**Common Customer Questions**:

**Q: "Can I create templates for different days of the week?"**
A: Yes! You can create day templates that include multiple shift positions. For example, a "Monday Template" with all the shifts needed on Mondays.

**Q: "Can I edit a template after creating shifts from it?"**
A: Editing a template doesn't change existing shifts. You'd need to update those shifts individually, or create a new template and replace the old shifts.

### Conflict Detection

**What it is**: Automatic identification of scheduling problems before they become issues.

**How it works**:
- Real-time validation as you create or modify schedules
- Checks for:
  - Overlapping shifts (same worker, same time)
  - Qualification mismatches (worker lacks required skills)
  - Leave conflicts (worker has approved leave)
  - Business rule violations (minimum rest periods, etc.)
- Visual indicators show conflicts:
  - Red borders for critical conflicts
  - Yellow warnings for potential issues
  - Tooltips explain the problem

**Key Benefits**:
- Prevents scheduling errors
- Saves time on manual checking
- Reduces last-minute scrambles
- Ensures compliance

**Common Customer Questions**:

**Q: "Why is this shift showing a conflict?"**
A: Hover over the conflict indicator to see details. Common reasons: worker has leave, shift overlaps with another assignment, or worker lacks required qualifications.

**Q: "Can I publish a schedule with conflicts?"**
A: You can, but it's not recommended. The system will warn you, and you should resolve conflicts before publishing to avoid problems.

### Publish & Revert

**What it is**: Draft schedules with review and approval workflow.

**How it works**:
1. Create and edit schedule in draft mode
2. Review changes before making them live
3. Click "Publish" to notify all team members
4. Schedule becomes visible to everyone
5. Can revert to previous version if needed
6. Complete audit trail of all changes

**Key Benefits**:
- Safe experimentation
- Team review before publication
- Easy rollback if mistakes are made
- Complete change history

**Common Customer Questions**:

**Q: "What happens when I publish a schedule?"**
A: All team members receive email notifications, and the schedule becomes the "live" version. Any previous published version is saved so you can revert if needed.

**Q: "How far back can I revert?"**
A: You can revert to any previously published version. The system keeps a history of all published schedules.

## 2. Leave Management

### Multiple Leave Types

**What it is**: Support for various types of time off requests.

**Leave Types Supported**:
- Vacation (default)
- Sick Leave (default)
- Parental Leave (default)
- Meeting (default)
- Training (default)
- Custom types (configurable per company)

**How it works**:
1. Company admin configures leave types in settings
2. Each leave type can have:
   - Approval requirements (auto-approved or needs manager approval)
   - Quota limits (e.g., 20 vacation days per year)
   - Accrual rules
3. Employees select leave type when requesting time off
4. System tracks balances and enforces quotas

**Common Customer Questions**:

**Q: "Can I add custom leave types?"**
A: Yes! Company owners can add custom leave types in company settings. You can configure approval requirements and quotas for each type.

**Q: "Can I create a 'Holiday' leave type?"**
A: Yes! You can create custom leave types in company settings. If you want a separate "Holiday" type for company holidays, you can add it as a custom leave type and configure it differently from "Vacation".

### Approval Workflows

**What it is**: Configurable approval processes with manager notifications.

**How it works**:
1. Employee submits leave request
2. System checks if approval is needed (based on leave type settings)
3. If approval needed:
   - Manager receives email notification
   - Request appears in manager's dashboard
   - Manager can approve or reject with comments
4. If auto-approved:
   - Leave is immediately approved
   - Balance is updated
5. Employee receives email notification of decision

**Key Benefits**:
- Streamlined approval process
- No lost requests
- Clear communication
- Audit trail

**Common Customer Questions**:

**Q: "Who gets notified when I request leave?"**
A: Your direct manager (or managers with write access to your team) receives an email notification. You'll also receive a confirmation email.

**Q: "How long does approval take?"**
A: That depends on your manager, but the system sends immediate notifications. Most managers respond within 24-48 hours. You can check the status in your leave calendar.

**Q: "Can I cancel a leave request?"**
A: Yes, you can delete a pending leave request. If it's already approved, you may need to contact your manager to cancel it.

### Leave Balance Tracking

**What it is**: Monitor quotas and remaining allowances for each employee.

**How it works**:
1. Company admin sets quotas per leave type (e.g., 20 vacation days/year)
2. System tracks:
   - Approved leave used
   - Pending leave requests
   - Remaining balance
3. Visual indicators show:
   - Current balance
   - Pending requests
   - Quota limits
4. System prevents over-allocation

**Common Customer Questions**:

**Q: "Where can I see my leave balance?"**
A: In your leave calendar, you'll see your balance for each leave type. You can also check it when creating a new leave request.

**Q: "What happens if I request more leave than I have available?"**
A: The system will warn you, but you can still submit the request. Your manager will see the over-allocation and can decide whether to approve it.

**Q: "How are leave balances calculated?"**
A: Balances are calculated based on your quota minus approved and pending leave. The system shows you exactly how much you've used and how much remains.

### Calendar Integration

**What it is**: Visual leave calendar with holiday integration.

**How it works**:
1. View leave calendar showing:
   - All leave requests (approved and pending)
   - Color coding by leave type
   - Holiday calendar integration
   - Team-wide visibility
2. Subscribe to leave calendar in external calendar apps using subscription URLs
3. Calendar automatically syncs with TimeClout

**Common Customer Questions**:

**Q: "Can I sync my schedule to my personal calendar?"**
A: Yes! You can subscribe to your team's calendar using subscription URLs. Go to your team page, click "Calendar integrations" tab, and copy the subscription URL. Then subscribe to it in Google Calendar, Outlook, or Apple Calendar. The calendar will automatically update when schedules change.

**Q: "How do holidays work?"**
A: You can configure holiday calendars by country/region in team settings. Holidays will appear in the calendar and are considered when scheduling.

## 3. Team Management

### Multi-Level Organization

**What it is**: Hierarchical structure for companies with multiple departments or locations.

**Structure**:
- **Company**: Top-level organization
- **Units**: Departments, locations, or divisions
- **Teams**: Specific work groups within units
- **Members**: Individual employees assigned to teams

**How it works**:
1. Create company (top level)
2. Create units within company (e.g., "North Location", "Sales Department")
3. Create teams within units (e.g., "Morning Shift", "Evening Shift")
4. Add members to teams
5. Each level can have its own settings and permissions

**Common Customer Questions**:

**Q: "Do I need to create units, or can I just have teams?"**
A: You can create teams directly under a company if you don't need the unit level. Units are optional and useful for larger organizations with multiple departments or locations.

**Q: "Can a team member belong to multiple teams?"**
A: Yes! A user can be a member of multiple teams. They'll see schedules for all teams they belong to.

### Role-Based Permissions

**What it is**: Granular access control for different user roles.

**Permission Levels**:
- **Level 1 (Read)**: View schedules and data only
- **Level 2 (Write)**: Create and modify schedules, manage team members
- **Level 3 (Owner)**: Full control including permissions and deletion

**How it works**:
1. When inviting a team member, select their permission level
2. Permissions can be set at company, unit, or team level
3. Users with higher-level permissions can grant permissions to others
4. System enforces permissions on all operations

**Common Customer Questions**:

**Q: "What's the difference between Write and Owner permissions?"**
A: Write allows creating and editing schedules and team members. Owner adds the ability to delete resources, manage permissions, and configure settings.

**Q: "Can I change someone's permissions later?"**
A: Yes, if you have Owner permissions, you can update any team member's permission level at any time.

**Q: "What if I accidentally gave someone too much access?"**
A: You can downgrade their permissions immediately. The system will prevent them from performing actions they no longer have permission for.

### Qualification Management

**What it is**: Define and assign skills/qualifications to team members.

**How it works**:
1. Create qualification types (e.g., "Certified Nurse", "Forklift License")
2. Assign qualifications to team members
3. Require qualifications for specific shifts
4. Auto-fill only assigns qualified workers
5. System validates qualifications when manually assigning

**Common Customer Questions**:

**Q: "Do I need to set up qualifications?"**
A: Only if you have shifts that require specific skills or certifications. If all workers can do all shifts, you don't need qualifications.

**Q: "What happens if I assign an unqualified worker to a shift?"**
A: The system will show a warning, but you can still assign them. This is useful for training situations or when you know they're qualified but haven't updated their profile.

**Q: "Can qualifications expire?"**
A: Currently, qualifications don't have expiration dates, but you can manually remove them when they expire. This is a feature we're considering for the future.

### Member Invitations

**What it is**: Seamless team member onboarding with email invitations.

**How it works**:
1. Navigate to team members section
2. Click "Invite Member"
3. Enter email address and select permission level
4. System sends invitation email
5. Invitee clicks link and creates account (or logs in if they already have one)
6. They're automatically added to the team

**Common Customer Questions**:

**Q: "What if someone doesn't receive the invitation email?"**
A: Check spam folder first. You can resend the invitation from the team members page. If they still don't receive it, they can contact support.

**Q: "Can I invite someone who already has a TimeClout account?"**
A: Yes! If they already have an account, they'll just be added to your team. They don't need to create a new account.

**Q: "What if I invited the wrong person?"**
A: You can delete the invitation if it hasn't been accepted yet. If they've already joined, you can remove them from the team.

## 4. Analytics & Reporting

### Schedule Statistics

**What it is**: Visual statistics and insights about your team's schedule distribution.

**Statistics Available**:
- **Inconvenience Deviation**: Shows how evenly inconvenient shifts are distributed across team members
- **Schedule Type Distribution**: Breakdown of shift types and their frequency
- **Time Distribution**: Analysis of shift timing and duration patterns
- **By Duration View**: Summary view showing shifts organized by length (hours)

**How it works**:
1. Navigate to your team's schedule
2. Click the "Stats" tab in the calendar view
3. View statistics for the selected month
4. Statistics update automatically based on current schedule

**Common Customer Questions**:

**Q: "Where can I see the statistics?"**
A: Statistics are available in the schedule view. Navigate to your team's schedule, and click the "Stats" tab to see various analytics about shift distribution.

**Q: "What time period do the statistics cover?"**
A: Statistics are calculated for the currently selected month in the schedule view. Change the month to see statistics for different time periods.

**Q: "Can I export statistics data?"**
A: Currently, statistics are view-only in the application. Export functionality is planned for a future release.

## 5. AI-Powered Assistant

**What it is**: Built-in AI assistant that understands your application context.

**How it works**:
1. Click AI assistant icon (bottom right of screen)
2. Assistant understands:
   - Current page you're on
   - What you're trying to do
   - Your organization structure
3. Ask questions or request help
4. Get contextual, relevant answers
5. Follow step-by-step guidance

**Common Customer Questions**:

**Q: "Is the AI assistant always available?"**
A: Yes! The AI assistant is available 24/7 and works in both English and Portuguese.

**Q: "What can I ask the assistant?"**
A: You can ask about features, how to perform tasks, what something means, or get help with specific problems. The assistant understands TimeClout's features and can guide you through workflows.

**Q: "Does the assistant have access to my data?"**
A: The assistant can see the current page you're on and your organization structure to provide contextual help, but it doesn't store or share your data.

## 6. Enterprise Features

### Multi-Company Support

**What it is**: Manage multiple organizations from a single platform.

**How it works**:
1. Create multiple companies in your account
2. Switch between companies using the company selector
3. Each company has isolated data and settings
4. Share user accounts across companies (useful for consultants)

**Common Customer Questions**:

**Q: "Can I manage multiple companies?"**
A: Yes! If you're a consultant or manage multiple businesses, you can create and switch between multiple companies in your account.

**Q: "Is data shared between companies?"**
A: No, each company's data is completely isolated. You can't see one company's data when logged into another.

### Email Notifications

**What it is**: Automated alerts for leave requests and schedule changes.

**Notification Types**:
- Leave request submitted
- Leave request approved/rejected
- Schedule published
- Shift assignment changes
- Coverage alerts

**Common Customer Questions**:

**Q: "Can I turn off email notifications?"**
A: Yes, you can configure notification preferences in your user settings. You can choose which types of notifications you want to receive.

**Q: "I'm not receiving emails. What should I check?"**
A: Check your spam folder first. Also verify your email address in your profile settings. If you're still not receiving emails, contact support.

### iCal Integration

**What it is**: Subscribe to team schedules and leave calendars in external calendar applications.

**How it works**:
1. Navigate to team page
2. Click "Calendar integrations" tab
3. Copy the subscription URL for shifts or leaves
4. Subscribe to the URL in your calendar app:
   - **Google Calendar**: Click + next to "Other calendars" > "From URL" and paste the URL
   - **Apple Calendar**: File > New Calendar Subscription and paste the URL
   - **Outlook**: Settings > Calendar > Add calendar > Subscribe from web and paste the URL
5. Calendar automatically updates when schedules change

**Common Customer Questions**:

**Q: "Can I set up automatic calendar sync?"**
A: Yes! The subscription URLs automatically sync with your calendar app. When schedules change in TimeClout, your calendar app will update automatically (usually within a few hours, depending on your calendar app's sync frequency).

**Q: "Will my calendar update when the schedule changes?"**
A: Yes! Since you're subscribing to a live URL, your calendar app will automatically pull updates when schedules change in TimeClout. No need to re-export or re-import.

---

**Last Updated**: 2024
**Version**: 1.0.0

