
## Node Application

```
##Technologies

Nodejs
Express
Sequilize ORM (Object-relational mapping) 
Mysql

## Create .env File in root directory "interview"

```
MYSQLDB_USER=root
MYSQLDB_ROOT_PASSWORD=123456
MYSQLDB_DATABASE=interview
MYSQLDB_LOCAL_PORT=3307
MYSQLDB_DOCKER_PORT=3306
NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=8080
USING_DOCKER=true
JWT_SECRET=test@Token
FRONTEND_LINK=http://localhost:3000/

## Setup config/database.json file inside project directory (interview)

```
"username": "root",
"password": "123456",
"database": "interview",
"host": "localhost",
"dialect": "mysql"
```

# Docker Compose Nodejs and MySQL

## Run the System

We can easily run the whole with only a single command:

```bash
docker-compose up
```

Docker will pull the MySQL and Node.js images (if our machine does not have it before).

The services can be run on the background with command:

```bash
docker-compose up -d
```

## Stop the System

Stopping all the running containers is also simple with a single command:

```bash
docker-compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:

```bash
docker-compose down --rmi all
```

## Access URL

```
For Node/express Server: http://localhost:6868/
For phpmyadmin: http://localhost:11819/
```

## Database Connection With TablePlus

```
UserName: root
Password: 123456
Port: 3307
```

## Database Connection inside Docker

```
UserName: root
Password: 123456
Port: 3306
```

## Create Migration sample command

```
    npx sequelize-cli model:generate --name User --attributes firstName:string, email:string
```

## Run Migration

```bash
npx sequelize-cli db:migrate
```

## Run Seed

```bash
npx sequelize-cli db:seed:all
```

## Database Migration

-   `Visit: [https://sequelize.org/docs/v6/other-topics/migrations/]`
