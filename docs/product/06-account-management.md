# Account Management Guide

This document explains how to manage user accounts, permissions, and organizational structure in TimeClout.

## Table of Contents

1. [User Accounts](#user-accounts)
2. [Organizational Structure](#organizational-structure)
3. [Permissions System](#permissions-system)
4. [Team Member Management](#team-member-management)
5. [Invitations](#invitations)
6. [Settings Management](#settings-management)

## User Accounts

### Account Creation

**How accounts are created:**
1. User signs up with Google OAuth at timeclout.com
2. Account is automatically created upon first login
3. No separate password - uses Google authentication
4. Email address comes from Google account

**Key Points:**
- One Google account = One TimeClout account
- Email address is primary identifier
- Account persists across companies
- Users can belong to multiple companies

### Account Information

**What's stored:**
- Email address (from Google)
- Name (from Google profile)
- Account creation date
- Last login information
- User settings and preferences

**What users can update:**
- Display name (in profile settings)
- Notification preferences
- Language preferences
- Timezone (if applicable)

### Account Deletion

**For regular users:**
- Users can request account deletion
- Contact support@timeclout.com
- Account deletion removes:
  - User profile
  - Personal settings
  - Does NOT remove them from teams (they become "orphaned" members)

**For company owners:**
- Must delete company first
- Then can delete account
- Deleting company removes all associated data

## Organizational Structure

### Hierarchy

```
Company (Top Level)
├── Units (Optional - Departments/Locations)
│   ├── Teams (Work Groups)
│   │   ├── Members (Users)
│   │   └── Shifts (Scheduled Work)
│   └── Settings
└── Settings
```

### Company

**What it is:**
- Top-level organization
- Contains all units, teams, and data
- Has company-wide settings
- Isolated from other companies

**Creating a company:**
1. Click "Create Company" in dashboard
2. Enter company name
3. Creator becomes Owner automatically
4. Company is created immediately

**Company settings:**
- Work schedules
- Leave types and policies
- Timezone
- Locale/language
- Custom leave types

**Deleting a company:**
- Only Owners can delete
- Deletes ALL associated data:
  - Units and teams
  - Shifts and schedules
  - Leave requests
  - All member associations
- Cannot be undone
- Requires confirmation

### Units

**What it is:**
- Optional organizational level
- Represents departments, locations, or divisions
- Contains teams
- Useful for larger organizations

**When to use units:**
- Multiple locations (e.g., "North Location", "South Location")
- Multiple departments (e.g., "Sales", "Operations")
- Need to group teams logically
- Want separate settings per unit

**Creating a unit:**
1. Navigate to company
2. Click "Create Unit"
3. Enter unit name
4. Unit is created immediately

**Unit settings:**
- Can have unit-specific settings
- Inherits company settings by default
- Can override company settings

**Deleting a unit:**
- Only Owners can delete
- Deletes all teams within unit
- Cannot be undone

### Teams

**What it is:**
- Work group within company or unit
- Contains members and shifts
- Has team-specific settings
- Core scheduling unit

**Creating a team:**
1. Navigate to company or unit
2. Click "Create Team"
3. Enter team name
4. Team is created immediately

**Team settings:**
- Work schedules (can override company/unit)
- Qualifications
- Shift templates
- Team-specific leave policies

**Deleting a team:**
- Only Owners can delete
- Deletes all shifts and schedules
- Removes all member associations
- Cannot be undone

## Permissions System

### Permission Levels

**Level 1 - Read:**
- Can view schedules and data
- Cannot make any changes
- Cannot create or edit shifts
- Cannot manage members
- Good for: Employees who just need to see schedules

**Level 2 - Write:**
- All Read permissions, plus:
- Can create and edit shifts
- Can assign workers to shifts
- Can manage team members (add/remove)
- Can create leave requests for others
- Cannot delete resources
- Cannot manage permissions
- Good for: Shift supervisors, team leads

**Level 3 - Owner:**
- All Write permissions, plus:
- Can delete resources (shifts, teams, etc.)
- Can manage permissions
- Can configure settings
- Can delete company/unit/team
- Good for: Managers, administrators

### Permission Scope

**Company Level:**
- Applies to entire company
- Can see all units and teams
- Can manage company settings
- Can create units and teams

**Unit Level:**
- Applies to specific unit
- Can see all teams in unit
- Can manage unit settings
- Can create teams in unit

**Team Level:**
- Applies to specific team
- Can see only that team
- Can manage team settings
- Can manage team members

### Granting Permissions

**When inviting:**
1. Navigate to team members
2. Click "Invite Member"
3. Select permission level
4. Permission is granted when they accept

**For existing members:**
1. Navigate to team members
2. Click on member
3. Click "Edit Permissions"
4. Select new permission level
5. Save

**Who can grant permissions:**
- Only Owners can grant permissions
- Can grant up to their own level
- Cannot grant higher than own level

### Permission Inheritance

**How it works:**
- Permissions are explicit (not inherited)
- Company Owner doesn't automatically have Unit Owner
- Must grant permissions at each level
- Exception: Company Owner can see all data (read-only)

**Example:**
- User is Company Owner (Level 3)
- User is NOT automatically Unit Owner
- Must explicitly grant Unit Owner permission
- But can see all units (read access)

## Team Member Management

### Adding Members

**Method 1: Invitation (Recommended)**
1. Navigate to team members
2. Click "Invite Member"
3. Enter email
4. Select permission level
5. Send invitation
6. Member accepts and joins automatically

**Method 2: Direct Add (If they have account)**
1. Navigate to team members
2. Click "Add Member"
3. Search for user by email
4. Select permission level
5. Add to team

### Removing Members

**How to remove:**
1. Navigate to team members
2. Find member
3. Click "Remove from Team"
4. Confirm removal

**What happens:**
- Member is removed from team
- Loses access to team data
- Account is NOT deleted
- Can be re-added later

**Note:** Cannot remove yourself if you're the only Owner

### Updating Member Information

**What can be updated:**
- Permission level
- Qualifications
- Work schedule preferences
- Notification preferences

**How to update:**
1. Navigate to team member
2. Click "Edit"
3. Make changes
4. Save

## Invitations

### Sending Invitations

**Process:**
1. Navigate to team/unit/company
2. Click "Invite Member" or "Invite User"
3. Enter email address
4. Select permission level
5. Click "Send Invitation"

**What happens:**
- Invitation email is sent
- Invitation appears in "Pending" list
- Invitation has expiration (typically 7 days)
- Can be resent if needed

### Accepting Invitations

**For new users:**
1. Receive email with invitation link
2. Click link
3. Sign up with Google OAuth
4. Account created automatically
5. Added to team/unit/company
6. Welcome email sent

**For existing users:**
1. Receive email with invitation link
2. Click link (or log in first)
3. Added to team/unit/company
4. Notification sent

### Managing Invitations

**View pending invitations:**
- Navigate to team/unit/company members
- See "Pending Invitations" section
- Shows email, permission level, sent date

**Resend invitation:**
1. Find invitation in pending list
2. Click "Resend"
3. New email sent

**Cancel invitation:**
1. Find invitation in pending list
2. Click "Cancel"
3. Invitation removed
4. User cannot accept (if not already accepted)

**Invitation expiration:**
- Invitations expire after set period (typically 7 days)
- Expired invitations can be resent
- User cannot accept expired invitation

## Settings Management

### Company Settings

**Who can manage:**
- Company Owners only

**Settings available:**
- Company name
- Work schedules (default)
- Leave types and policies
- Timezone
- Locale/language
- Custom leave types
- Notification preferences

**How to update:**
1. Navigate to company settings
2. Click "Edit" or "Configure"
3. Make changes
4. Save

### Unit Settings

**Who can manage:**
- Unit Owners only

**Settings available:**
- Unit name
- Work schedules (can override company)
- Unit-specific leave policies
- Other unit-specific configurations

**How to update:**
1. Navigate to unit settings
2. Click "Edit"
3. Make changes
4. Save

### Team Settings

**Who can manage:**
- Team Owners only

**Settings available:**
- Team name
- Work schedules (can override unit/company)
- Qualifications
- Shift templates
- Team-specific leave policies
- Notification preferences

**How to update:**
1. Navigate to team settings
2. Click "Edit"
3. Make changes
4. Save

### User Settings

**Who can manage:**
- User themselves (for own settings)
- Team Owners (for team-specific settings)

**Settings available:**
- Display name
- Email preferences
- Notification preferences
- Language preferences
- Timezone
- Work schedule preferences

**How to update:**
1. Navigate to profile/settings
2. Click "Edit"
3. Make changes
4. Save

## Common Scenarios

### Scenario 1: New Employee Onboarding

**Steps:**
1. Manager navigates to team members
2. Clicks "Invite Member"
3. Enters employee email
4. Selects "Write" permission (or appropriate level)
5. Sends invitation
6. Employee receives email
7. Employee clicks link and creates account
8. Employee is automatically added to team
9. Manager adds qualifications if needed
10. Employee is ready to be scheduled

**Time:** 5 minutes total

### Scenario 2: Promoting a Team Member

**Steps:**
1. Navigate to team members
2. Find member to promote
3. Click on member
4. Click "Edit Permissions"
5. Change from "Read" to "Write" (or "Write" to "Owner")
6. Save
7. Member's access updates immediately

**Time:** 1 minute

### Scenario 3: Removing Access

**Steps:**
1. Navigate to team members
2. Find member to remove
3. Click "Remove from Team"
4. Confirm removal
5. Member loses access immediately
6. (Optional) Delete their account if no longer needed

**Time:** 1 minute

### Scenario 4: Restructuring Organization

**Steps:**
1. Create new unit (if needed)
2. Create new teams in unit
3. Move members to new teams:
   - Remove from old team
   - Add to new team
4. Update permissions as needed
5. Migrate shifts if necessary (manual process)

**Time:** 15-30 minutes depending on size

## Best Practices

### Permission Management

1. **Principle of Least Privilege:**
   - Grant minimum necessary permissions
   - Start with Read, upgrade as needed
   - Review permissions regularly

2. **Regular Audits:**
   - Review who has access periodically
   - Remove access for former employees
   - Update permissions as roles change

3. **Clear Ownership:**
   - Ensure each team has at least one Owner
   - Document who has Owner access
   - Have backup Owners

### Team Structure

1. **Keep it Simple:**
   - Don't create unnecessary units
   - Use units only if you have multiple departments/locations
   - Flat structure is easier to manage

2. **Logical Grouping:**
   - Group teams by function or location
   - Make structure intuitive
   - Document your structure

3. **Naming Conventions:**
   - Use clear, descriptive names
   - Be consistent
   - Avoid abbreviations unless standard

### Member Management

1. **Onboarding:**
   - Send invitations promptly
   - Set appropriate permissions from start
   - Add qualifications immediately
   - Provide training/resources

2. **Offboarding:**
   - Remove access immediately when employee leaves
   - Consider deleting account if not needed elsewhere
   - Document removal for audit purposes

3. **Updates:**
   - Keep member information current
   - Update qualifications as they change
   - Adjust permissions as roles evolve

---

**Last Updated**: 2024
**Version**: 1.0.0

