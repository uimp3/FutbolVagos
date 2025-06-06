export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'futbolvagos',
    clientId: 'django-backend',
    clientSecret: 'du7lIyTy3ErygORxsriADbA6rorAB2fv',
    redirectUri: 'http://localhost:8081',
    logoutUrl: 'http://localhost:8081/login'
  },
  apiUrl: 'http://localhost:8000/api'
};
