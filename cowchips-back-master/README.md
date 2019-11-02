# cowchips-back

## API Documenation
https://documenter.getpostman.com/view/5922949/RztppShv

## Developer Setup

1. Download [mongodb](https://www.mongodb.com/download-center/community "MongoDB Community Download") for your computer
2. Follow prompts to set up
3. If service is not already running, run the following command as admin in a terminal

   ```bash net start MongoDB```
4. **Suggested:** Download one of the following
  
   * Download [MongoDB Compass](https://www.mongodb.com/products/compass "MongoDB Compass"). Be sure to set Versions to a Community Edition Version
  
   * Download [Robo 3T](https://robomongo.org/download "Robo 3T").
  
5. Create file .env in the root directory
6. Copy information from .env-dist into .env
7. Fill in the information with your system specific info (most should be the same)
8. Run the following command to initialize db with a pre-created admin user with all permissions set

   ```bash npm run initdb```
   
   The admin credentials for the pre-created admin are 
   ```javascript 
   { email: "a@gmail.com", password: "password" }
   ```
   
## Structure
   * **[src](#src)**
   
   * **[test](#testroutes)**

   * **.babelrc** - contains configuration information for babel

   * **.env-dist** - contains a template for the environment variables the .env file should contain

   * **.eslintignore** - files to be ignored by the ecmascript linter

   * **.eslintrc.js** - eslint rules and configuration 

   * **.travis.yml** - travis configuration and instructions for Travis CI

   * **ecosystem.config.js** - configuration for PM2

   * **jest.config.js** - jest configuration file
   
   
## src
  
   * **config** - Global configuration variables.
  
   * **controllers** - Define objects that are instantiated by the routes and make calls to the models.
   
   * **mailing/mailer.js** - Define an object to carry out mailing operations. Includes template management and bulk email sending
  
   * **middleware** - Executes before a request is passed to the routes Objects. This allows request parsing and decrease in code repetition.
  
   * **models** - Static objects that perform operations MongoDB collections and documents, used by controllers.
  
   * **routes** - Define the API endpoint URL extensions and request type. Invoke controller methods. The main object is in router.js, which instantiates all routes and is instantiated by server.js.
  
   * **schemas** - Define format of a MongoDB document for each collection.
  
   * **security/security.js** - Defines permissions and methods for encryption and authentication.
  
   * **validators** - Provide formats and methods for validation of data used by the models.
   
   * **errors.js** - Defines numerous custom errors used by the backend.
  
   * **response.js** - Defines a method for sending error messages and all HTTP Status Codes used by the server.
  
   * **server.js** - Main script executed when the server starts. Performs all environment setup and server instantiation.
  
## test/routes

   * **helpers** - Define helpers, 1 for each model and 1 shared, which provide helper methods for database instantiation and cleanup. Also provides other repeated functions.
   
   * ***.test.js** - Define the tests for each route subset in the src/routes folder. All tests **must cleanup** after themselves.
