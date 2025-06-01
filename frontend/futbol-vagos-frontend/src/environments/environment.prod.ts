export const environment = {
  production: true,
  keycloak: {
    url: 'http://localhost:8080', // TODO: Cambiar por la URL de producción
    realm: 'futbolvagos',
    clientId: 'django-backend',
    clientSecret: 'LYrZ8JWGg0ryBQdKY972Glt413xiAWMU', // TODO: Cambiar por el secret de producción
    redirectUri: 'http://localhost:4200/login' // TODO: Cambiar por la URL de producción
  },
  apiUrl: 'http://localhost:8000/api'  // TODO: Cambiar por la URL de producción
}; 