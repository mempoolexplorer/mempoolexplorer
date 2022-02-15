FROM openjdk:11
COPY ${DEPENDENCY} /
ENTRYPOINT ["java", "-Xmx1500m","-Xms1500m", "-jar", "/app/mempoolexplorerBackend-0.0.1-SNAPSHOT.jar"]
