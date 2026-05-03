# Build stage
FROM maven:3-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
# Build the WAR and explicitly copy the H2 driver to a known location
RUN mvn package -DskipTests && \
    mvn dependency:copy -Dartifact=com.h2database:h2:2.3.232 -DoutputDirectory=target/lib

# Run stage
FROM icr.io/appcafe/open-liberty:beta
# Clean out default apps to avoid naming conflicts from stale layers
USER root
RUN rm -rf /config/dropins/* /config/apps/*
USER 1001

# Copy the WAR file to apps/
COPY --from=build --chown=1001:0 /app/target/komowai.war /config/apps/
# Copy the server configuration
COPY --from=build --chown=1001:0 /app/src/main/liberty/config/server.xml /config/
# Copy H2 driver to the liberty lib folder
COPY --from=build --chown=1001:0 /app/target/lib/ /config/lib/

# Ensure the data directory exists for H2 persistence
USER root
RUN mkdir -p /data && chown -R 1001:0 /data
USER 1001

RUN configure.sh
