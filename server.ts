import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for OTPs (In production, use Redis or a database)
const otpStore: Record<string, { code: string; expires: number }> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // OTP Routes
  app.post("/api/auth/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[email] = { code: otp, expires };

    console.log(`[OTP] Generated for ${email}: ${otp}`);

    try {
      // Use real SMTP if configured, otherwise log it
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: '"Catholicism Sanctuary" <noreply@catholicism.app>',
          to: email,
          subject: "Your Spiritual Verification Code",
          text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
          html: `
            <div style="font-family: serif; padding: 20px; color: #1A1A1A;">
              <h2 style="color: #D4AF37;">Welcome to the Sanctuary</h2>
              <p>Your verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: #F5F5F0; border-radius: 10px; text-align: center;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
            </div>
          `,
        });
        res.json({ message: "OTP sent successfully" });
      } else {
        // Mock success for development if no SMTP
        console.warn("SMTP not configured. OTP logged to console only.");
        res.json({ message: "OTP sent successfully (Dev Mode: Check Server Logs)", devOtp: otp });
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  app.post("/api/auth/verify-otp", (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ error: "No OTP found for this email" });
    if (Date.now() > stored.expires) {
      delete otpStore[email];
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (stored.code === code) {
      delete otpStore[email];
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid verification code" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
