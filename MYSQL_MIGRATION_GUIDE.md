# 🔄 H2 to MySQL Migration Guide

## Quick Setup

### Step 1: Add MySQL Dependency

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Remove or comment out H2 dependency:**
```xml
<!-- <dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency> -->
```

### Step 2: Update application.properties

Replace your current configuration with:

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/teleasha?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=Chandran@2006

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Step 3: Start MySQL

```bash
# Windows
net start MySQL80

# Or start from Services
```

### Step 4: Create Database (Optional)

MySQL will create it automatically, but you can do it manually:

```sql
CREATE DATABASE IF NOT EXISTS teleasha;
USE teleasha;
```

### Step 5: Run Application

```bash
mvn spring-boot:run
```

## ✅ Done!

Your application now uses MySQL instead of H2.

## 🔍 Verify Connection

Check console for:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

## 📊 View Data

Use MySQL Workbench or command line:
```bash
mysql -u root -p
USE teleasha;
SHOW TABLES;
```

## ⚙️ Configuration Options

### Different Database Name
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name?createDatabaseIfNotExist=true
```

### Different Port
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/teleasha?createDatabaseIfNotExist=true
```

### Different User
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🔄 Keep Both (Optional)

Use profiles to switch between H2 and MySQL:

**application-dev.properties** (H2):
```properties
spring.datasource.url=jdbc:h2:file:~/telemedicine/teleasha
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

**application-prod.properties** (MySQL):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/teleasha
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

**Run with profile:**
```bash
# Development (H2)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production (MySQL)
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 🐛 Troubleshooting

### Error: "Access denied for user 'root'"
- Check password in application.properties
- Verify MySQL user exists

### Error: "Communications link failure"
- Ensure MySQL is running
- Check port 3306 is correct
- Verify localhost is correct

### Error: "Unknown database 'teleasha'"
- Add `createDatabaseIfNotExist=true` to URL
- Or create database manually

### Error: "Driver class not found"
- Add MySQL dependency to pom.xml
- Run `mvn clean install`

## ✅ Success Indicators

- ✅ Application starts without errors
- ✅ Console shows "HikariPool" connection
- ✅ Tables created in MySQL
- ✅ Data persists after restart
- ✅ No H2 console errors

Your Spring Boot app now uses MySQL! 🎉
