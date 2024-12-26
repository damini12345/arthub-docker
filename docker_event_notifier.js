const Docker = require('dockerode');
const DockerEvents = require('docker-events');

// Initialize Docker client
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Initialize Docker-Events emitter
const emitter = new DockerEvents({ docker: docker, });

// Debug connection status
emitter.on('connect', () => {
  console.log('Connected to Docker events stream.');
});

emitter.on('disconnect', () => {
  console.log('Disconnected from Docker events stream.');
});

docker.getEvents((err, stream) => {
    console.log("Going here");
    if (err) {
        console.error(`Error: ${err.message}`);
        return;
      }
    stream.on('data', (chunk) => {
        console.log("Going here");
        try {
          const event = JSON.parse(chunk.toString());
          console.log('Event:', event);
        } catch (parseErr) {
          console.log('Failed to parse event:', parseErr);
        }
      });
});

// Capture all events for debugging
emitter.on('event', (event) => {
  console.log('Received Docker Event:', event);
});

emitter.on("_message", function(message) {
    console.log("got a message from docker: %j", message);
  });

  emitter.on("create", function(message) {
    console.log("container created: %j", message);
  });
  emitter.on("start", function(message) {
    console.log("container started: %j", message);
  });
  emitter.on("stop", function(message) {
    console.log("container stopped: %j", message);
  });
  emitter.on("die", function(message) {
    console.log("container died: %j", message);
  });
  emitter.on("destroy", function(message) {
    console.log("container destroyed: %j", message);
  });
emitter.on('error', (error) => {
  console.error('Error in Docker events stream:', error);
});

// Start listening for events
try {
  emitter.start();
  console.log('Started listening for Docker events...');
} catch (err) {
  console.error('Error starting Docker events emitter:', err);
}





// // Step 3: Listen for Docker events
// emitter.on('event', (event) => {
//     console.log('Docker Event:', event);
  
//     // Filter container events like start or stop
//     if (event.Type === 'container' && (event.Action === 'start' || event.Action === 'stop')) {
//       const eventMessage = `Container ${event.Actor.ID} (${event.Actor.Attributes.name}) has ${event.Action}ed.`;
  
//       // Step 4: Send email notification
//       sendEmailNotification(eventMessage);
//     }
//   });
  
//   // Step 4: Start listening to Docker events
//   emitter.start();
  
//   // Function to send email notifications
//   function sendEmailNotification(eventMessage) {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // Use your email provider
//       auth: {
//         user: 'your-email@gmail.com',
//         pass: 'your-email-password',
//       },
//     });
  
//     const mailOptions = {
//       from: 'your-email@gmail.com',
//       to: 'recipient-email@gmail.com',
//       subject: 'Docker Event Notification',
//       text: eventMessage,
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return console.error('Error sending email:', error);
//       }
//       console.log('Email sent:', info.response);
//     });
//   }












// // Email configuration using Nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER, // Your email address
//       pass: process.env.EMAIL_PASSWORD // Your email password or app password
//     }
//   });
  
//   // Function to send email notifications
//   const sendEmail = (subject, message) => {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_RECIPIENT, // Recipient email address
//       subject: subject,
//       text: message
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(`Error sending email: ${error.message}`);
//       } else {
//         console.log(`Email sent: ${info.response}`);
//       }
//     });
//   };
  
//   // Function to monitor Docker events
//   const monitorDockerEvents = () => {
//     console.log('Monitoring Docker events...');
  
//     docker.getEvents((err, stream) => {
//       console.log("Stream : ", stream);
//       console.log("Going here");
//       if (err) {
//         console.error(`Error: ${err.message}`);
//         return;
//       }
  
//       console.log('Monitoring Docker events...');
//       stream.on('data', (chunk) => {
//           console.log("coming here");
//         const event = JSON.parse(chunk.toString());
  
//         if (event.Type === 'container') {
//           const action = event.Action;
//           const containerId = event.id.substring(0, 12);
//           const attributes = event.Actor.Attributes;
//           const containerName = attributes.name || 'unknown';
//           const imageName = attributes.image || 'unknown';
  
//           const message = `
//           Docker Event:
//           Action: ${action}
//           Container: ${containerName} (${containerId})
//           Image: ${imageName}`;
  
//           console.log(message);
  
//           // Send email notification
//           sendEmail('Docker Event Notification', message);
//         }
//       });
  
//       stream.on('error', (err) => {
//         console.error(`Error on stream: ${err.message}`);
//       });
//     });
//   };
  
//   // Start monitoring
//   monitorDockerEvents();
  
  