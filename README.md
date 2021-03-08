# Snippets API

This API was built with NodeJS and Express framework. Few packages were used for additional functionalities: Moment is used for formatting and manipulating time; nodemon is used for hot-reloading(development purposes only); cors is used to automatically configure and take care of CORS issues.

For security concerns and best practices, passwords are encrypted and decrypted with bcryptjs. Plain passwords are not saved in memory.

All possible errors are handled using the try-catch blocks and conditional checks to prevent server crashes.

To run the server for production,use the command: npm start
To run run the server in development, enabling hot-reloading, use the command: npm run dev