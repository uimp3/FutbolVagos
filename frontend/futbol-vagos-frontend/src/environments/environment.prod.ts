export const environment = {
  production: true,
  keycloak: {
    url: 'http://localhost:8080', // TODO: Cambiar por la URL de producción
    realm: 'futbolvagos',
    clientId: 'django-backend',
    clientSecret: 'du7lIyTy3ErygORxsriADbA6rorAB2fv', // TODO: Cambiar por el secret de producción
    redirectUri: 'http://localhost:8081/login' // TODO: Cambiar por la URL de producción
  },
  apiUrl: 'http://localhost:8000/api'  // TODO: Cambiar por la URL de producción
}; 