# User Workflows Guide

This document provides step-by-step guides for common customer tasks to help customer service agents walk customers through processes.

## Table of Contents

1. [Getting Started Workflow](#getting-started-workflow)
2. [Creating a Schedule](#creating-a-schedule)
3. [Using Auto-Fill](#using-auto-fill)
4. [Requesting Leave](#requesting-leave)
5. [Approving Leave Requests](#approving-leave-requests)
6. [Inviting Team Members](#inviting-team-members)
7. [Setting Up Qualifications](#setting-up-qualifications)
8. [Managing Permissions](#managing-permissions)
9. [Exporting to Calendar](#exporting-to-calendar)

## Getting Started Workflow

### Step 1: Sign Up
1. Visit [timeclout.com](https://timeclout.com)
2. Click "Sign Up" or "Get Started"
3. Choose "Sign in with Google"
4. Select your Google account
5. Grant permissions if prompted

**Time**: 1-2 minutes

### Step 2: Create Company
1. After signing in, you'll see the dashboard
2. Click "Create Company" button
3. Enter company name
4. Click "Create"

**Time**: 1 minute

### Step 3: Set Up Organization Structure

**Option A: Simple Structure (No Units)**
1. Click "Create Team"
2. Enter team name (e.g., "Morning Shift")
3. Click "Create"

**Option B: Complex Structure (With Units)**
1. Click "Create Unit"
2. Enter unit name (e.g., "North Location")
3. Click "Create"
4. Click on the unit
5. Click "Create Team" within the unit
6. Enter team name
7. Click "Create"

**Time**: 2-5 minutes

### Step 4: Configure Basic Settings

**Work Schedule:**
1. Navigate to Company Settings
2. Click "Work Schedules"
3. Define standard working hours for each day
4. Set which days are work days
5. Save

**Leave Types:**
1. Navigate to Company Settings
2. Click "Leave Types"
3. Review default leave types (Vacation, Sick, etc.)
4. Add custom leave types if needed
5. Configure approval requirements for each type
6. Save

**Time**: 5-10 minutes

### Step 5: Invite First Team Members
1. Navigate to your team
2. Click "Team Members" tab
3. Click "Invite Member"
4. Enter email address
5. Select permission level (Write recommended for first member)
6. Click "Send Invitation"

**Time**: 2 minutes per member

**Total Time to Value**: 15-30 minutes

## Creating a Schedule

### Manual Schedule Creation

**Step 1: Navigate to Schedule**
1. Go to your team page
2. Click "Schedule" tab
3. Select date range using calendar controls

**Step 2: Create Shift Positions**
1. Click "Create Shift" button
2. Fill in shift details:
   - **Name**: Optional shift name (e.g., "Morning Shift")
   - **Day**: Select date
   - **Time**: Set start and end times
   - **Required Qualifications**: Select if needed
   - **Inconvenience Level**: Set multiplier (1.0 = normal, higher = more inconvenient)
   - **Color**: Optional color coding
3. Click "Create"

**Alternative: Use Template**
1. If you have shift templates, drag one to a calendar day
2. Shift is created with template settings
3. Edit if needed

**Step 3: Assign Workers**
1. Click on a shift position
2. Select "Assign Worker" from menu
3. Choose worker from dropdown
4. System validates:
   - Qualifications match
   - No conflicts
   - Business rules compliance
5. Save

**Alternative: Drag and Drop**
1. Drag worker name to shift position
2. System validates automatically
3. Visual feedback shows conflicts

**Step 4: Review Schedule**
1. Check for:
   - Coverage gaps (unfilled shifts)
   - Conflicts (highlighted in red/yellow)
   - Fairness (review statistics in the Stats tab if needed)
2. Make adjustments as needed

**Step 5: Publish Schedule**
1. Click "Publish" button
2. Confirm publication
3. Team members receive email notifications
4. Schedule becomes live

**Time**: 10-30 minutes for weekly schedule

## Using Auto-Fill

### Step 1: Prepare for Auto-Fill
1. Navigate to team schedule
2. Create shift positions for the date range you want to schedule
3. Ensure:
   - Workers have qualifications assigned (if shifts require them)
   - Leave requests are up to date
   - Work schedules are configured

### Step 2: Configure Auto-Fill (Optional)
1. Click "Auto-Fill" button
2. Review heuristic weights:
   - **Worker Inconvenience Equality**: Fairness priority (default: 1.0)
   - **Worker Slot Equality**: Equal hours distribution (default: 1.0)
   - **Worker Slot Proximity**: Optimal timing (default: 1.0)
   - **Avoid Non-Work Day First Shift**: Weekend protection (default: 1.0)
3. Adjust weights based on priorities:
   - Higher = more important
   - Lower = less important
4. Review business rules:
   - Minimum rest between shifts
   - Maximum inconvenience per worker
   - Minimum shifts per week

### Step 3: Start Auto-Fill
1. Click "Start Auto-Fill"
2. Watch progress in real-time:
   - **Cycle Count**: Number of iterations
   - **Valid Schedules Found**: Solutions generated
   - **Current Best Score**: Quality metric
   - **Problem Slots**: Conflicts identified

### Step 4: Monitor Progress
1. Let it run for 2-5 minutes (or longer for better results)
2. Review metrics:
   - Fairness score (lower is better)
   - Distribution score
   - Coverage completeness
3. Check for problem slots

### Step 5: Stop and Review
1. Click "Stop" when satisfied
2. Review the best solution:
   - Check assignments
   - Verify fairness
   - Look for any issues
3. Make manual adjustments if needed

### Step 6: Apply Solution
1. Click "Apply" to assign workers
2. Schedule is saved in draft mode
3. Review one more time
4. Publish when ready

**Time**: 2-5 minutes (auto-fill) + review time

## Requesting Leave

### Single Day Leave Request

**Step 1: Navigate to Leave Calendar**
1. Go to your leave calendar (or team view)
2. Click "Request Leave" button

**Step 2: Fill in Request Details**
1. Select **Leave Type**: Vacation, Sick, Personal, etc.
2. Select **Date**: Choose the day
3. Enter **Reason**: Optional but recommended
4. Review **Balance**: Check remaining leave for this type

**Step 3: Submit Request**
1. Click "Submit"
2. System checks for conflicts
3. If auto-approved: Leave is immediately approved
4. If needs approval: Manager is notified

**Step 4: Track Status**
1. View request in leave calendar
2. Status shows: Pending, Approved, or Rejected
3. Receive email notifications for status changes

**Time**: 2 minutes

### Multi-Day Leave Request

**Step 1: Navigate to Leave Calendar**
1. Go to your leave calendar
2. Click "Request Leave"

**Step 2: Fill in Request Details**
1. Select **Leave Type**
2. Select **Date Range**: Start and end dates
3. Enter **Reason**
4. Review **Balance**: Ensure you have enough days

**Step 3: Submit Request**
1. Click "Submit"
2. System validates:
   - No overlapping leave
   - Sufficient balance (warns if not)
   - Business rules compliance

**Step 4: Track Status**
1. View in calendar (spans multiple days)
2. Check approval status
3. Receive notifications

**Time**: 2-3 minutes

### Bulk Single-Day Requests

**Step 1: Navigate to Leave Calendar**
1. Go to your leave calendar
2. Click "Request Leave"

**Step 2: Select Multiple Days**
1. Choose "Multiple Days" mode
2. Select individual dates (not a range)
3. Useful for: Training days, meetings, etc.

**Step 3: Fill in Details**
1. Select **Leave Type**
2. Enter **Reason** (applies to all days)
3. Review dates selected

**Step 4: Submit**
1. Click "Submit"
2. System creates separate requests for each day
3. All follow same approval workflow

**Time**: 3-5 minutes

## Approving Leave Requests

### Step 1: Receive Notification
1. Check email for leave request notification
2. Or navigate to dashboard/team view
3. Pending requests are highlighted

### Step 2: Review Request
1. Click on the leave request
2. Review details:
   - Employee name
   - Leave type
   - Date(s)
   - Reason
   - Current balance
   - Remaining balance after approval

### Step 3: Check Schedule Impact
1. View team schedule for the requested dates
2. Assess coverage:
   - Are there enough workers?
   - Will it create gaps?
   - Can shifts be adjusted?

### Step 4: Make Decision
1. Click "Approve" or "Reject"
2. Add optional comments:
   - Approval: "Approved, enjoy your vacation!"
   - Rejection: "Sorry, we need coverage that week. Can you choose different dates?"

### Step 5: Confirm
1. System updates leave balance
2. Employee receives email notification
3. Leave appears in calendar
4. Schedule auto-fill respects approved leave

**Time**: 1-2 minutes per request

## Inviting Team Members

### Step 1: Navigate to Team Members
1. Go to your team page
2. Click "Team Members" tab

### Step 2: Send Invitation
1. Click "Invite Member" button
2. Enter **Email Address**
3. Select **Permission Level**:
   - **Read**: View-only access
   - **Write**: Can create/edit schedules
   - **Owner**: Full control
4. Click "Send Invitation"

### Step 3: Invitee Receives Email
1. Invitee receives email with invitation link
2. They click the link

### Step 4: Invitee Joins
1. If new user: Creates account with Google OAuth
2. If existing user: Logs in with existing account
3. They're automatically added to the team
4. They receive welcome email

### Step 5: Set Up New Member (Optional)
1. Add qualifications if needed
2. Configure work schedule preferences
3. They're ready to be scheduled

**Time**: 2 minutes to send invitation, 3-5 minutes for invitee to join

## Setting Up Qualifications

### Step 1: Define Qualification Types
1. Navigate to team settings
2. Click "Qualifications"
3. Review existing qualifications or create new ones
4. Common examples:
   - "Certified Nurse"
   - "Forklift License"
   - "Food Handler Certificate"
   - "Manager Certification"

### Step 2: Assign to Team Members
1. Navigate to team members
2. Click on a member
3. Click "Edit Qualifications"
4. Select qualifications they have
5. Save

### Step 3: Require for Shifts
1. When creating a shift, select "Required Qualifications"
2. Choose which qualifications are needed
3. Auto-fill will only assign qualified workers
4. Manual assignment will show warnings for unqualified workers

**Time**: 5-10 minutes to set up, 1 minute per member

## Managing Permissions

### Step 1: Understand Permission Levels
- **Level 1 (Read)**: View schedules and data only
- **Level 2 (Write)**: Create and modify schedules, manage team members
- **Level 3 (Owner)**: Full control including permissions and deletion

### Step 2: View Current Permissions
1. Navigate to team members
2. See permission level next to each member
3. Your own permission level is shown

### Step 3: Change Permissions
1. Click on a team member
2. Click "Edit Permissions" (if you have Owner access)
3. Select new permission level
4. Save

### Step 4: Verify Changes
1. Member's access updates immediately
2. They may need to refresh their browser
3. System enforces new permissions on all operations

**Time**: 1 minute per member

## Subscribing to Calendar

### Step 1: Navigate to Calendar Integrations
1. Go to your team page
2. Click "Calendar integrations" tab

### Step 2: Copy Subscription URL
1. You'll see two subscription URLs:
   - **Team shifts calendar**: Shows all scheduled shifts
   - **Team leaves calendar**: Shows all leave requests
2. Click the copy button next to the URL you want
3. URL is copied to your clipboard

### Step 3: Subscribe in Calendar App

**Google Calendar:**
1. Open Google Calendar
2. Click the + next to "Other calendars" (on the left sidebar)
3. Select "From URL"
4. Paste the subscription URL
5. Click "Add calendar"
6. Calendar appears in your list and updates automatically

**Apple Calendar:**
1. Open Calendar app
2. Go to File → New Calendar Subscription
3. Paste the subscription URL
4. Click "Subscribe"
5. Configure refresh frequency (recommended: every hour)
6. Click "OK"
7. Calendar appears and updates automatically

**Outlook:**
1. Open Outlook
2. Go to Settings (gear icon) → Calendar
3. Click "Add calendar" → "Subscribe from web"
4. Paste the subscription URL
5. Enter a calendar name
6. Click "Import"
7. Calendar appears and updates automatically

### Step 4: Automatic Updates
1. Your calendar app will automatically sync with TimeClout
2. Updates typically appear within a few hours (depending on your calendar app's sync frequency)
3. No need to re-subscribe or re-import

**Time**: 2-3 minutes

---

**Last Updated**: 2024
**Version**: 1.0.0

