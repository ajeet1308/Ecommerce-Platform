# Step 1: Install package.json
npm init

# Step 2: Add Folders strategy
config, controller, middlewares, models, routes, index.js

# Step 3: Adding dependcies
- npm i express mongoose bcrypt body-parser dotenv
- npm i express-async-handler
- npm i jsonwebtoken
- npm i cookie-parser
- npm i morgan 
(Morgan is a logging tool (middleware) that can be used in HTTP servers implemented using Express & Node.js. It can be used to log requests, errors, and more to the console.)
- npm i slugify
(With the help of a slugify function, we convert any string or title into a slug.)
- npm i nodemailer
(To send a mail)
- npm install cloudinary
(For image uploading and storing in Cloudinary)
- npm i multer sharp
(Used for file uploading)
- npm i uniqid
(User to generate random id)


# Step 4: To continuously listen changes
npm i nodemon --save-dev

# Step 5: Run the server
npm run server
