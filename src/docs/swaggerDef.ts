import { version } from '../../package.json';

const swaggerDef = {
  openapi: '3.0.3',
  info: {
    title: 'API Documentation',
    description: 'API Documentation based on the OpenAPI 3.0 specification',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      email: 'xwlee2009@gmail.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    version,
  },
  externalDocs: {
    description: 'Find out more',
    url: 'http://swagger.io',
  },
  servers: [
    {
      url: `http://localhost:8080/v1`,
    },
  ],
};

export default swaggerDef;
