## Architecture Decisions

### Why MySQL and MongoDB?

**MySQL** is used for the main data because:

- We need relationships between users, cases, and assignments
- Data integrity matters (foreign keys keep things consistent)
- Transactions ensure data doesn't get corrupted

**MongoDB** is used for activity logs because:

- Logs are write-heavy and don't need relationships
- Each log can have different fields depending on the action
- It's faster for storing lots of log entries
- We never update or delete logs, just append them

### How Authentication & Roles Work

**Authentication:**

- User logs in with email/password
- Backend creates a JWT token and puts it in an HTTP-only cookie
- Browser automatically sends this cookie with every request
- Backend checks the cookie on each request to see who you are

**Role Enforcement:**

- Two global guards check every request: JwtAuthGuard (are you logged in?) and RolesGuard (do you have permission?)
- Service methods double-check permissions (users can only see their assigned cases)
- Admins can do everything, regular users are limited to their assignments

### What I Would Improve

**With more time I would add:**

- Automated tests (unit tests and API tests)
- Better error messages and validation
- Search and filtering on the cases list
- Ability to reassign cases to different users
- File uploads for case attachments
- Comments or notes on cases
- Email notifications when assigned a case
- Performance improvements (database indexes, caching)

### Time Taken

Approximately **1 hour** to build this system from scratch, including:

- Setting up the project structure
- Building all the features
- Testing everything works
- Writing this documentation
