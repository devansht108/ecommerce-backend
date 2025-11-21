## Auth API 
### 1. Register
POST /api/auth/register  
Body:
{
  "name": "",
  "email": "",
  "password": ""
}

### 2. Login
POST /api/auth/login  
Body:
{
  "email": "",
  "password": ""
}

### 3. Get Current User
GET /api/auth/me  
Header:
Authorization: Bearer <token>

### 4. Update Profile
PATCH /api/users/profile  
Header:
Authorization: Bearer <token>
