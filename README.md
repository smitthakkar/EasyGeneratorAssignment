# EasyGeneratorAssignment
Easy Generator Assignment

## Setup 

Solution

The solution is a full stack web application which utilizes docker for containerization, NestJS for backend, MongoDB for database, React with Vite as frontend and Nginx as web server.

The API documentation can be found at [Swaggerdocs](http://localhost:3001/api/docs)


![API Docs](/docs/images/api-docs.png)

```
/auth/signup
requires username, name and password

/auth/signin
requires username and password

```

---

Database structure

<b>User Table </b>: 
To store the user infomation

| Column |	Type	| Description|	Constraints|
|---|---|---|---|
username	|String	|Unique username of the user.|	Required, Unique
name|	String |	Full name of the user.	|Required
password|	String	|Hashed password for the user.	|Required


<b>UserSession Table</b>: To store the session level information

| Column             | Type    | Description                                                     | Constraints                     |
|--------------------|---------|-----------------------------------------------------------------|---------------------------------|
| username           | String  | Username associated with the session.                           | Required                        |
| token              | String  | Unique token for the session.                                   | Required, Unique                |
| createdAt          | Date    | Timestamp when the session was created.                         | Required, Default: Current Time |
| updatedAt          | Date    | Timestamp when the session was last updated.                    | Required, Default: Current Time |
| expireAfterSeconds | Integer | Time-to-live (TTL) index on updatedAt for automatic expiration. | Expires 1 hour after updatedAt  |


## Considerations
1. Unique index to disallow duplicates
2. Session table incase we want to have multi device login, we can manage sessions to renew etc seperately.
3. TTL ensures that session information i.e. token is deleted once used


---
### Considerations

Backend
1. Input validation is added to minimize errors
2. Nestjs Rate limiting is being used to enable ratelimiting for apis. Currently, its in memory, but we have the provision to plugin a persistence strategy for it.
3. Logging has been implemented to track activity

---
## Frontend
Frontend is built in react and vite and nextui. The boilerplate has been obtained from [nextui-cli](https://nextui.org/docs/guide/installation)

For state management we have used [Zustand](https://github.com/pmndrs/zustand) as its a lightweight library for state management.

### Signup

![alt text](/docs/images/signup.png)

### Signin
![Signin](/docs/images/login.png)

### Logout
![Logout](/docs/images/logout.png)

# How to run

The application is dockerized, simply clone and run the following command in root

```
docker-compose up --build
```

Limitations and todos for the application due to time constraints
1. Logout api is not created due to which we don't destroy session on backend.
2. The reason for maintaining session is that when we get a jwt token to validate, in addition to checking its signature we also need to check if its a valid token via db. This is because in a scenario, we logout the user, the jwt in theory will be active till its ttl, which can be misused, thus we need to check in db as well. Optimizations would include checking before ttl and keeping ttl in db to remove expired tokens.
3. Code coverage can be improve only basic tests are considered.
4. Salt for hashing the passwords can be implemented, currently we only have length based one-way hash