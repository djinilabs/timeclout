# Discord Customer Service API

This API handles Discord slash commands for customer service operations, specifically user management.

## Endpoints

- `POST /discord/*` - Handles all Discord webhook interactions

## Commands

### `/adduser`

Adds a new user to the entity table so they can log in.

**Parameters:**

- `email` (required): The user's email address

**Example:**

```
/adduser email:user@example.com
```

**Response:**

- Success: "✅ User **user@example.com** has been successfully added and can now log in."
- Error: Various error messages for validation failures or existing users

## Security

- Discord webhook signature verification using Ed25519 cryptography
- Timestamp validation to prevent replay attacks (5-minute window)
- Email format validation
- Duplicate user prevention

## Environment Variables

- `DISCORD_PUBLIC_KEY`: Discord application public key for signature verification (hex format)
- `DISCORD_CS_USERS`: JSON array of Discord user IDs authorized to use customer service commands (e.g., `["123456789", "987654321"]`)

## Implementation Details

- Uses direct handler function (no Express router)
- Integrates with existing entity table
- Follows existing error handling patterns
- Minimal implementation focused on user creation only

## Testing

Run tests with:

```bash
npm test -- discord
```

## Future Enhancements

- Proper Ed25519 signature verification
- Additional user management commands
- Rate limiting
- Enhanced logging and monitoring
