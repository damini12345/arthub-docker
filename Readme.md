
# Purpose
This proof of concept (POC) is created to demonstrate the use of Docker with Node.js. The project allows users to register, log in, and manage their profiles by uploading and deleting images.

In this project, users can:

    Register, log in, and log out.
    Upload and delete images once logged in.

Here is what the login page looks like: 
![image](https://github.com/user-attachments/assets/bb09d296-6ab3-4051-894e-3ca611364e98)

And here is how the profile page appears when images are uploaded: 
![image](https://github.com/user-attachments/assets/988acfc7-7697-4c57-ab92-82d9ae72465f)

This application runs on port 3000.

--------------
# Docker

To pull the image, run the following command:
```bash
  docker pull daminimahawer/arthub:v2.0
```
To create a container from this image, run:
```bash
  docker run -d -p 3000:3000 daminimahawer/arthub:v2.0
```
------------------

# Note:
    Open localhost:3000/login in your browser to create a new user.
    Click on Register to sign up, and once logged in, you can upload images.


