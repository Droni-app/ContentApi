// for AdonisJS v6
import path from 'node:path'
import url from 'node:url'
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../', // for AdonisJS v6
  title: 'Content Api',
  version: '1.0.0', // use info instead
  description: 'API para gestión de contenido',
  tagIndex: 1,
  productionEnv: 'production', // optional
  info: {
    title: 'Content Api',
    version: '1.0.0',
    description: 'API para gestión de contenido',
  },
  snakeCase: true,
  debug: true, // set to true, to get some useful debug output
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT', // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  }, // optional
  authMiddlewares: ['auth', 'auth:api'], // optional
  defaultSecurityScheme: 'BearerAuth', // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
}
