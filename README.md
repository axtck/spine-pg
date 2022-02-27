# Spine-pg

***Spine clone for Postgres***

---

## Technologies

- **Runtime**: NodeJS
- **Backend framework**: Express
- **Programming language**: TypeScript
- **Database**: Postgres (npm/pg NodeJS driver)
- **Logging**: Winston
- **Testing**: Jest
- **Mocking**: Sinon
- **Debugging**: VSCode Run and Debug
- **Dependency Injection**: Tsyringe
- **Decorators**: Reflect-metadata
- **Containerization**: Docker
- **Authentication method**: JWT
- **Design pattern**: Repository-Service-Controller
- **Linting**: ESLint

---

## Development

#### Database
* Set up the dev database (preferably with Docker).
> ``` docker run -d --name pg-spine -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e PGDATA=/var/lib/postgresql/data/pgdata -v $HOME/dockervols/pg-spine:/var/lib/postgresql/data -p 5433:5432 postgres:14-alpine```
