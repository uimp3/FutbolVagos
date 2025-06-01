export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'futbolvagos',
    clientId: 'django-backend',
    clientSecret: 'LYrZ8JWGg0ryBQdKY972Glt413xiAWMU',
    redirectUri: 'http://localhost:4200/login',
    logoutUrl: 'http://localhost:8080/realms/futbolvagos/protocol/openid-connect/logout?redirect_uri=http://localhost:4200/login'
  },
  apiUrl: 'http://localhost:8000/api'
};
