This is the backend part of the client side of the project "Cross Control".
The backend servers are made using Node and Express js. To facilitate easy interaction between MongoDB database and the backend, 'mongoose' has been used.

Installation for Local PC server:
In the event that a hosting platform is unavailable, you can still run the application locally by turning your PC into a server. To do so, first install the necessary node_modules by entering the command 'npm install'. Then, to launch the application, enter the command 'node app.js'.
Once the application is up and running, you can begin sending and receiving requests using a frontend that is also running on the same local server. However, it is important to note that this local server cannot be accessed by a frontend that is deployed on a separate server.  

Deployment:
If hosting platform is available, and the application is to be deployed for production, then both the Main Server as well as the frontend can be easily deployed. Then the Local PCs can be accessed from anywhere around the world!!