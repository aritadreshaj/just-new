import { NextRequest } from "next/server";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import nodemailer from "nodemailer";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);     // Firestore

// Setup email transport
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_DOMAIN,
    pass: process.env.ZOHO_PASSWORD,
  },
});

const sendConfirmationEmail = (email: string, name: string) => {
  const mailOptions = {
    from: process.env.ZOHO_DOMAIN,
    to: email,
    subject: "Faleminderit që ndatë historinë tuaj!",
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              font-size: 15px;
            }
          </style>
        </head>
        <body>
          <p><strong>I/E nderuar${name ? ` ${name}` : ""},</strong></p>
          <p>Faleminderit për kohën dhe gatishmërinë për të ndarë historinë tuaj. Ajo tashmë është ruajtur dhe do të bëhet pjesë e një narrative që do të jetojë, duke siguruar që kujtimet dhe përvojat që ndatë të mos harrohen kurrë.</p>
          <br>
          <p>Me respekt,
          <p>Arita Dreshaj
          <p><a href="https://www.aritadreshaj.com/">www.aritadreshaj.com</a></p>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export async function POST(req: Request) {
  try {
    // Accept JSON body with file URLs and form fields
    const data = await req.json();
    let {
      emri,
      ditelindja,
      vendlindja,
      vendbanimiAktual,
      email,
      rrëfim,
      mbartje,
      images = [],
      videos = [],
      audio = null
    } = data;

    // Debug: Log the value of emri and email to verify what is received
    console.log('Received submission:', { emri, email });

    // Compose a safe folder name based on vendlindja and emri
    const safe = (str: string) => (str || "anon").toLowerCase().replace(/[^a-z0-9]/gi, "_");
    const folderName = `${safe(vendlindja)}-${safe(emri)}`;

    // Compose text content for storage/email
    let textContent =
      `emri: ${emri}\n` +
      `ditelindja: ${ditelindja}\n` +
      `vendlindja: ${vendlindja}\n` +
      `vendbanimiAktual: ${vendbanimiAktual}\n` +
      `email: ${email}\n` +
      `rrëfim: ${rrëfim}\n` +
      `mbartje: ${mbartje}\n`;

    // Store metadata in Firestore with custom document name
    await setDoc(
      doc(db, "submissions", folderName),
      {
        emri,
        ditelindja,
        vendlindja,
        vendbanimiAktual,
        email,
        rrëfim,
        mbartje,
        images,
        videos,
        audio,
        submissionDate: new Date(),
      }
    );

    if (email) {
      await sendConfirmationEmail(email, emri);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error handling form submission:", error);
    return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
