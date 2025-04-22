# TikTok Tracker - User Documentation

## Overview

TikTok Tracker is a full-stack application designed to help you manage your TikTok following list based on your For You Page (FYP) activity. The application tracks your engagement with accounts that appear on your FYP and automatically identifies accounts you haven't interacted with for a specified period (default: 30 days). You can then choose to unfollow these inactive accounts individually or in batches.

## Features

- **TikTok Account Integration**: Connect your TikTok account to track your FYP activity
- **Engagement Tracking**: Monitor likes and FYP appearances for accounts you follow
- **Automated Following Management**: Automatically identify inactive accounts for unfollowing
- **Batch Unfollow**: Unfollow multiple inactive accounts at once
- **Notification System**: Get alerts about pending unfollows, especially for large batches
- **Analytics Dashboard**: Visualize your engagement patterns
- **Customizable Settings**: Adjust inactivity periods and notification thresholds

## Getting Started

### Account Setup

1. **Register**: Create a new account with your email and password
2. **Login**: Sign in to your account
3. **Connect TikTok**: Follow the instructions to connect your TikTok account:
   - Log in to TikTok in your browser
   - Open Developer Tools (F12 or right-click and select "Inspect")
   - Go to the "Application" tab
   - Select "Cookies" in the left sidebar
   - Find the "ms_token" and "sessionid" cookies
   - Copy their values into the connection form

### Using the Dashboard

The dashboard provides an overview of your TikTok activity:
- Total accounts you're following
- Number of inactive accounts
- Engagement statistics
- Activity chart

### Managing Your Following List

#### Following List
- View all accounts you're following
- Sort by username, last engagement, or followed date
- Search for specific accounts
- Unfollow accounts directly from this page

#### Inactive Accounts
- View accounts with no engagement in your specified timeframe
- Select multiple accounts for batch unfollowing
- Ignore specific accounts to keep following them

### Settings

Customize your experience with these settings:
- **Inactivity Period**: Set how many days of inactivity before an account is considered inactive (default: 30 days)
- **Notification Threshold**: Set the minimum number of inactive accounts that triggers a notification before batch unfollowing (default: 20 accounts)
- **Email Notifications**: Toggle email notifications for important events
- **Automatic Checking**: Enable/disable daily checks for inactive accounts

## Automated Following Management

The application includes automated processes that run in the background:
- **Daily Check**: Every day, the system checks for accounts that have been inactive for your specified period
- **Weekly Sync**: Once a week, the system syncs with TikTok to update your following list and engagement data
- **Auto-Unfollow**: If enabled, the system can automatically unfollow accounts that have been inactive for your specified period

## Notifications

The application sends notifications for various events:
- Inactive accounts detected
- Batch unfollow recommendations
- Successful data syncs
- System alerts and errors

## Privacy & Security

Your TikTok credentials are securely stored and only used to access your TikTok data. The application does not store your TikTok password, only the session tokens needed to access the API.

## Troubleshooting

If you encounter issues:
1. Check your TikTok connection settings
2. Ensure your session tokens are up to date
3. Try manually triggering a data sync
4. Check the notifications panel for any error messages

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- TikTok account

## Limitations

- TikTok's API has rate limits that may affect how frequently data can be synced
- The application can only track engagement that occurs while it has access to your account
- Some TikTok features may change over time, requiring updates to the application
