import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nishantchandgude0@gmail.com',
      pass: 'rfck crej yxqo dmgp'
    }
  });

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
