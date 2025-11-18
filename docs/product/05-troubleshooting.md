# Troubleshooting Guide

This document helps customer service agents diagnose and resolve common customer issues.

## Table of Contents

1. [Access & Login Issues](#access--login-issues)
2. [Visibility Issues](#visibility-issues)
3. [Scheduling Problems](#scheduling-problems)
4. [Leave Management Issues](#leave-management-issues)
5. [Permission Problems](#permission-problems)
6. [Performance Issues](#performance-issues)
7. [Data Issues](#data-issues)
8. [Email & Notifications](#email--notifications)

## Access & Login Issues

### Issue: "I can't sign in"

**Symptoms:**
- Error when clicking "Sign in with Google"
- Redirected back to login page
- "Access denied" message

**Diagnosis Steps:**
1. Ask customer which browser they're using
2. Check if they're using the correct Google account
3. Verify they have internet connection
4. Check if they have pop-up blockers enabled

**Solutions:**
1. **Clear browser cache and cookies**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
   - Safari: Preferences → Privacy → Manage Website Data
2. **Try incognito/private mode**
   - This rules out extension conflicts
3. **Try different browser**
   - Recommend Chrome for best compatibility
4. **Check Google account**
   - Ensure they're using the correct Google account
   - Verify Google account is active
5. **Disable pop-up blockers**
   - OAuth requires pop-ups
6. **Contact support** if issue persists

**Escalation:** If none of these work, escalate to technical team with:
- Browser and version
- Error message screenshot
- Steps taken

### Issue: "I'm logged in but can't see my company"

**Symptoms:**
- Dashboard is empty
- "No companies" message
- Can't access any data

**Diagnosis Steps:**
1. Verify they created a company
2. Check if they're using the correct account
3. Verify company wasn't deleted
4. Check browser console for errors

**Solutions:**
1. **Check account**
   - Confirm they're logged in with the correct Google account
   - Ask if they have multiple Google accounts
2. **Create company**
   - If no company exists, guide them to create one
   - See [Getting Started Workflow](./04-user-workflows.md#getting-started-workflow)
3. **Check company selector**
   - If they have multiple companies, check the company selector dropdown
4. **Refresh page**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
5. **Check permissions**
   - Verify they have access to the company
   - If they were invited, check invitation status

**Escalation:** If company should exist but doesn't, check database access (technical team only)

## Visibility Issues

### Issue: "I can't see my schedule"

**Symptoms:**
- Schedule page is blank
- "No shifts" message when shifts exist
- Can't see team schedule

**Diagnosis Steps:**
1. Check date range selection
2. Verify team selection
3. Check permissions
4. Verify shifts exist for selected dates

**Solutions:**
1. **Check date range**
   - Ask customer what date range they're viewing
   - Shifts might be outside the selected range
   - Guide them to expand date range
2. **Verify team selection**
   - Confirm they're viewing the correct team
   - Check if they belong to multiple teams
3. **Check permissions**
   - Verify they have Read access to the team
   - If they were just added, they may need to refresh
4. **Check for filters**
   - Look for active filters (users, shift types)
   - Clear filters to see all shifts
5. **Refresh page**
   - Hard refresh: Ctrl+F5 or Cmd+Shift+R

**Escalation:** If shifts should be visible but aren't, check database (technical team)

### Issue: "I can't see team members"

**Symptoms:**
- Team members list is empty
- Can't find specific member
- Members missing after invitation

**Diagnosis Steps:**
1. Check if members were actually added
2. Verify invitation status
3. Check permissions
4. Verify team selection

**Solutions:**
1. **Check invitation status**
   - Navigate to team members page
   - Look for pending invitations
   - Verify invitation was sent to correct email
2. **Verify member accepted**
   - Check if invitation was accepted
   - Resend invitation if needed
3. **Check team selection**
   - Confirm viewing correct team
   - Check if member belongs to different team
4. **Refresh page**
   - Members may need to refresh after being added

**Escalation:** If member should be visible but isn't, check database (technical team)

## Scheduling Problems

### Issue: "Auto-fill isn't working"

**Symptoms:**
- Auto-fill doesn't start
- No solutions found
- Error messages during auto-fill

**Diagnosis Steps:**
1. Check if shift positions exist
2. Verify workers are available
3. Check for conflicts
4. Verify qualifications match
5. Check browser console for errors

**Solutions:**
1. **Verify shift positions exist**
   - Customer must create shift positions first
   - Auto-fill assigns workers to existing positions
2. **Check worker availability**
   - Ensure workers have no overlapping leave
   - Verify workers are assigned to the team
   - Check if workers have required qualifications
3. **Review problem slots**
   - Auto-fill shows which slots are problematic
   - Common issues:
     - Not enough qualified workers
     - Too many conflicts
     - Business rules violations
4. **Adjust requirements**
   - Reduce qualification requirements
   - Adjust shift times
   - Add more team members
5. **Check business rules**
   - Minimum rest periods might be too strict
   - Maximum inconvenience might be too low
   - Adjust rules in settings

**Escalation:** If auto-fill consistently fails with valid data, escalate to technical team

### Issue: "I can't assign a worker to a shift"

**Symptoms:**
- Dropdown doesn't show workers
- Assignment fails
- Error message when assigning

**Diagnosis Steps:**
1. Check if worker belongs to team
2. Verify worker has required qualifications
3. Check for conflicts
4. Verify permissions

**Solutions:**
1. **Check team membership**
   - Verify worker is a member of the team
   - If not, add them to the team first
2. **Check qualifications**
   - If shift requires qualifications, worker must have them
   - Add qualifications to worker if needed
   - Or remove qualification requirement from shift
3. **Check for conflicts**
   - Worker might have overlapping shift
   - Worker might have approved leave
   - System shows conflicts - resolve them first
4. **Check permissions**
   - Verify user has Write access to team
   - If they were just granted access, refresh page

**Escalation:** If assignment should work but doesn't, check database (technical team)

### Issue: "I can't publish my schedule"

**Symptoms:**
- Publish button doesn't work
- Error when publishing
- Schedule doesn't become visible

**Diagnosis Steps:**
1. Check for unpublished changes
2. Verify permissions
3. Check for conflicts
4. Verify schedule has content

**Solutions:**
1. **Check for changes**
   - Ensure there are actual changes to publish
   - System only publishes when there are changes
2. **Verify permissions**
   - User needs Write access to publish
   - Check permission level
3. **Resolve conflicts**
   - System may prevent publishing with critical conflicts
   - Resolve conflicts first
4. **Refresh and retry**
   - Sometimes a refresh helps
   - Try publishing again

**Escalation:** If publish should work but doesn't, check database and logs (technical team)

## Leave Management Issues

### Issue: "I can't submit a leave request"

**Symptoms:**
- Submit button doesn't work
- Error when submitting
- Request doesn't appear

**Diagnosis Steps:**
1. Check date selection
2. Verify leave type exists
3. Check for overlapping leave
4. Verify balance (if applicable)

**Solutions:**
1. **Check dates**
   - Ensure dates are valid (not in past, proper format)
   - Check date range is correct
2. **Verify leave type**
   - Ensure leave type exists in company settings
   - If custom type, verify it's configured
3. **Check for overlaps**
   - System prevents overlapping leave requests
   - Check existing leave in calendar
   - Adjust dates if needed
4. **Check balance**
   - If quota exists, verify sufficient balance
   - System warns but allows over-allocation
   - Manager can approve even if over quota
5. **Refresh and retry**
   - Sometimes a refresh helps
   - Try submitting again

**Escalation:** If request should submit but doesn't, check database (technical team)

### Issue: "I'm not receiving leave approval notifications"

**Symptoms:**
- No email when leave is approved/rejected
- Notifications not appearing in app

**Diagnosis Steps:**
1. Check email settings
2. Verify notification preferences
3. Check spam folder
4. Verify email address

**Solutions:**
1. **Check spam folder**
   - Notifications might be in spam
   - Mark as "Not Spam" if found
2. **Verify email address**
   - Check profile settings for correct email
   - Ensure email is verified in Google account
3. **Check notification settings**
   - Review user settings for notification preferences
   - Ensure leave notifications are enabled
4. **Check app notifications**
   - Notifications appear in app even if email fails
   - Check dashboard for pending items

**Escalation:** If notifications should work but don't, check email service (technical team)

### Issue: "Leave balance is incorrect"

**Symptoms:**
- Balance doesn't match expectations
- Balance not updating after approval
- Negative balance showing

**Diagnosis Steps:**
1. Check quota configuration
2. Verify approved leave
3. Check pending requests
4. Verify calculation logic

**Solutions:**
1. **Check quota settings**
   - Verify quota is configured correctly in company settings
   - Check quota period (yearly, monthly, etc.)
  2. **Review approved leave**
   - Check leave calendar for all approved leave
   - Verify dates are correct
   - Check for duplicate approvals
3. **Check pending requests**
   - Pending requests may be counted
   - Verify which requests are included in balance
4. **Recalculate balance**
   - Balance = Quota - Approved - Pending
   - Verify calculation manually
   - Contact support if calculation seems wrong

**Escalation:** If balance calculation is clearly wrong, escalate to technical team with details

## Permission Problems

### Issue: "I can't access a team/company"

**Symptoms:**
- "Access Denied" message
- Can't see team data
- Missing from team members list

**Diagnosis Steps:**
1. Check invitation status
2. Verify permissions
3. Check if removed from team
4. Verify account

**Solutions:**
1. **Check invitation**
   - Verify invitation was sent
   - Check if invitation was accepted
   - Resend invitation if needed
2. **Verify permissions**
   - Check permission level in team members
   - If Read only, they can view but not edit
   - If no access, they need to be added
3. **Check team membership**
   - Verify they're still a member
   - They may have been removed
   - Re-add if needed
4. **Verify account**
   - Ensure they're using correct Google account
   - Check if they have multiple accounts

**Escalation:** If permissions should exist but don't, check database (technical team)

### Issue: "I can't edit schedules even though I have Write access"

**Symptoms:**
- Edit buttons are disabled
- Can't create shifts
- "Insufficient permissions" message

**Diagnosis Steps:**
1. Verify permission level
2. Check team selection
3. Verify account
4. Check for cached permissions

**Solutions:**
1. **Verify permissions**
   - Check team members page for permission level
   - Ensure it shows Write (Level 2) or Owner (Level 3)
   - If Read (Level 1), they need higher permissions
2. **Refresh page**
   - Permissions may be cached
   - Hard refresh: Ctrl+F5 or Cmd+Shift+R
   - Log out and back in
3. **Check team selection**
   - Ensure viewing correct team
   - Permissions are team-specific
4. **Contact team owner**
   - They may need to update permissions
   - Owner can grant Write access

**Escalation:** If permissions are correct but access doesn't work, check database (technical team)

## Performance Issues

### Issue: "The page is loading slowly"

**Symptoms:**
- Long load times
- Spinning indicators
- Timeout errors

**Diagnosis Steps:**
1. Check internet connection
2. Check browser
3. Check data size
4. Check for errors

**Solutions:**
1. **Check internet connection**
   - Test connection speed
   - Try different network
   - Check if other sites load slowly
2. **Clear browser cache**
   - Old cached data can slow things down
   - Clear cache and cookies
   - Try incognito mode
3. **Check browser**
   - Ensure using recent browser version
   - Try different browser (Chrome recommended)
   - Disable browser extensions
4. **Reduce data load**
   - Narrow date range if viewing large schedule
   - Use filters to reduce visible data
   - Close other browser tabs
5. **Check for errors**
   - Open browser console (F12)
   - Look for error messages
   - Report errors to support

**Escalation:** If performance is consistently poor, check server status and logs (technical team)

### Issue: "Auto-fill is taking too long"

**Symptoms:**
- Auto-fill runs for extended time
- No solutions found after long wait
- Browser becomes unresponsive

**Diagnosis Steps:**
1. Check number of shifts
2. Check number of workers
3. Check rule complexity
4. Check for conflicts

**Solutions:**
1. **Reduce scope**
   - Schedule smaller date ranges
   - Break large schedules into smaller chunks
2. **Simplify requirements**
   - Reduce qualification requirements
   - Simplify business rules
   - Remove unnecessary constraints
3. **Add more workers**
   - More workers = more solutions
   - Reduces constraint conflicts
4. **Adjust heuristics**
   - Lower heuristic weights can find solutions faster
   - Balance quality vs. speed
5. **Stop and retry**
   - Sometimes stopping and restarting helps
   - Try different heuristic weights

**Escalation:** If auto-fill consistently fails or takes too long, check scheduler performance (technical team)

## Data Issues

### Issue: "My data disappeared"

**Symptoms:**
- Shifts missing
- Team members gone
- Schedule empty

**Diagnosis Steps:**
1. Check date range
2. Verify filters
3. Check if data was deleted
4. Verify account/company

**Solutions:**
1. **Check date range**
   - Data might be outside selected range
   - Expand date range
   - Check different time periods
2. **Check filters**
   - Active filters might hide data
   - Clear all filters
   - Check user filters
3. **Check for deletion**
   - Verify data wasn't accidentally deleted
   - Check if someone with Owner access deleted it
   - Check audit trail if available
4. **Verify account**
   - Ensure using correct account
   - Check if viewing correct company/team
5. **Check browser**
   - Try different browser
   - Clear cache and refresh

**Escalation:** If data should exist but doesn't, check database backups (technical team)

### Issue: "Duplicate data appearing"

**Symptoms:**
- Same shift appears twice
- Duplicate team members
- Repeated leave requests

**Diagnosis Steps:**
1. Check for accidental creation
2. Verify synchronization
3. Check for browser issues

**Solutions:**
1. **Refresh page**
   - Sometimes display issue, not actual duplicates
   - Hard refresh: Ctrl+F5 or Cmd+Shift+R
2. **Check for actual duplicates**
   - Verify in database if possible
   - Delete duplicates if they exist
3. **Check synchronization**
   - Multiple users editing simultaneously can cause issues
   - Refresh to get latest data
4. **Clear browser cache**
   - Cached data might show duplicates
   - Clear cache and refresh

**Escalation:** If duplicates persist, check database for actual duplicates (technical team)

## Email & Notifications

### Issue: "I'm not receiving email notifications"

**Symptoms:**
- No emails for leave requests
- No schedule change notifications
- Missing approval notifications

**Diagnosis Steps:**
1. Check email address
2. Check spam folder
3. Verify notification settings
4. Check email service status

**Solutions:**
1. **Check spam folder**
   - Most common issue
   - Mark as "Not Spam" if found
   - Add sender to contacts
2. **Verify email address**
   - Check profile settings
   - Ensure email is correct
   - Verify email in Google account
3. **Check notification settings**
   - Review user settings
   - Ensure notifications are enabled
   - Check which types are enabled
4. **Test email delivery**
   - Try requesting a password reset (if applicable)
   - Check if other emails from system arrive
   - Contact support if no emails arrive

**Escalation:** If email service is down, check email service status (technical team)

### Issue: "I'm receiving too many emails"

**Symptoms:**
- Email overload
- Duplicate notifications
- Unwanted notifications

**Solutions:**
1. **Adjust notification settings**
   - Review user settings
   - Disable unwanted notification types
   - Set notification frequency if available
2. **Use email filters**
   - Set up filters in email client
   - Organize notifications into folders
3. **Check for duplicates**
   - Verify if actually receiving duplicates
   - Report to support if duplicates exist

**Escalation:** If duplicates are system issue, check email service (technical team)

## General Troubleshooting Tips

### For Customer Service Agents

1. **Always verify the basics first:**
   - Correct account/email
   - Correct company/team selection
   - Internet connection
   - Browser and version

2. **Use the AI Assistant:**
   - Point customers to AI Assistant
   - It can often resolve issues automatically
   - Provides contextual help

3. **Check browser console:**
   - Ask customer to open console (F12)
   - Look for error messages
   - Screenshot errors for technical team

4. **Try standard fixes:**
   - Refresh page (hard refresh)
   - Clear cache
   - Try different browser
   - Log out and back in

5. **Document the issue:**
   - Note exact error messages
   - Record steps to reproduce
   - Check if issue affects multiple users
   - Gather browser/device information

### Escalation Criteria

Escalate to technical team when:
- Issue persists after standard fixes
- Data appears to be corrupted or missing
- Performance issues affect multiple users
- Security or access concerns
- Feature appears broken (not user error)
- Error messages indicate system problem

---

**Last Updated**: 2024
**Version**: 1.0.0


