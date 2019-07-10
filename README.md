# SmartScan
## Project Description
#### This web Application completely built on MERN stack.
  - It is built as cloud platform for **LVPEI** so that Diagnostic centres can send the scan slides(mostly **dicom 
  files**) of the patient in order to standardize the data.
  - This website contains in-built dicom viewer, to view images.
  - Multiple images/files can be uploaded/ downloaded at same time
  - This application has 4 user roles to manage the activity.
## Getting Started
These instructions will help you in getting the application running as local host and deploying in production on a 
privately hosted linux server.

## Prerequisites
This application requires `node >=10.x` and `npm >=6.9.x` installed on your machine.

## Instructions for running the application in development environment
- MRIStream
  - config
    - keys_dev.js(create this file)
    
In **keys_dev.js** add the following code
    
```$xslt
module.exports = {
   mongoURI: 'YOUR_DATABASE_KEY',
   secretOrKey: 'YOUR_SECRET_OR_KEY',
   LVPEI_API_KEY: 'DATABASE_API_URI_HERE'
 };
```

After these files are added run the following commands from project folder
- `npm install` _It installs all the server node_modules_
- `npm install client-install` _It installs the client node_modules_
- `npm run dev` _It runs server and client on 5000 and 3000 port respectively_

## Instructions for running the app in production server

- `npm install` _It installs all the server node_modules_
- `npm install client-install` _It installs the client node_modules_
- `cd client` _get to client directory_
- `npm run build` _Create optimized production build of react_
- `cd ..` _Get back_
- **_In case of ubuntu server:_**
```
    NODE_ENV='production' PORT=3000 MONGO_URI="YOUR_DATABASE_STRING_HERE" 
    SECRET_OR_KEY='SECRET_OR_KEY_HERE' 
    API_KEY='PATIENT_URI_HERE' nodejs server.js
``` 
- **_In case of other OS:_**
```
    NODE_ENV='production' PORT=3000 MONGO_URI="YOUR_DATABASE_STRING_HERE" 
    SECRET_OR_KEY='SECRET_OR_KEY_HERE' 
    API_KEY='PATIENT_URI_HERE' node server.js
```

That's it you are set up...........
## Author
**_`Sai Sharan Tangeda`_** - [Github profile](https://github.com/SHARANTANGEDA?tab=repositories)

## Acknowledgements
I would like to thank **Dr. Tarjani Vivek Dave** and **Dr. Vipin Das** for their support and guidance in building 
the application.
## Copyrights
- This code can be used by any individual for development purposes without consent of author(_**#Keeps the spirit 
alive!!!**_). 
- But any organization or individual of any kind other than _**LVPEI or the Author**_ using it for commercial purposes 
must take permission of the _**author**_ or above mentioned _**Dr. Tarjani Vivek Dave**_.S
