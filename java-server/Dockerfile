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
#This is at BUILD TIME
RUN mvn clean package
RUN mkdir screenshots

#Run the application
# CMD ["mvn", "spring-boot:run"]
CMD ["java", "-jar", "target/screenshot-server-0.1.0.jar"]