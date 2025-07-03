# Use an official Java runtime as a parent image
# FROM mcr.microsoft.com/openjdk/jdk:17-ubuntu
FROM maven:3.8.3-amazoncorretto-17

# Set the working directory in the container
WORKDIR /app

# Copy the source code into the container
COPY src src
COPY pom.xml pom.xml

# Specify the command to run the entrypoint script
# Run the Maven build to package the application
RUN mvn clean package -DskipTests

#Run the application
# CMD ["java", "-jar", "target/your-application.jar"]
# For now, just check the maven version
CMD ["mvn", "--version"]
#Will be mvn spring-boot:run. !