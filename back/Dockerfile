FROM openjdk:11
COPY ${DEPENDENCY} /
COPY . ./app
# set working directory
WORKDIR /app

RUN ./gradlew bootJar --no-daemon
ENTRYPOINT ["java", "-Xmx3000m","-Xms3000m", "-jar", "/app/build/libs/mempoolexplorerBackend-0.0.1-SNAPSHOT.jar"]
