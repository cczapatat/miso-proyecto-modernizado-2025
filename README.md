# Group 4

## Generate Dockers

### Users

```bash
cd users_ms &&
docker build -t us-central1-docker.pkg.dev/miso-modernizacion-2025/miso-modernizacion/users-ms:1.0.1 . &&
docker push us-central1-docker.pkg.dev/miso-modernizacion-2025/miso-modernizacion/users-ms:1.0.1 &&
cd ..
```

### Exercises

```bash
cd exercises_ms &&
docker build -t us-central1-docker.pkg.dev/miso-modernizacion-2025/miso-modernizacion/exercises-ms:1.0.0 . &&
docker push us-central1-docker.pkg.dev/miso-modernizacion-2025/miso-modernizacion/exercises-ms:1.0.0 &&
cd ..
```

### Web

```bash
cd web &&
docker build -t us-central1-docker.pkg.dev/miso-modernizacion-2025/miso-modernizacion/web:1.0.0 . &&
docker push us-central1-docker.pkg.dev/miso-modernizacion-2025/miso-modernizacion/web:1.0.0 &&
cd ..
```
