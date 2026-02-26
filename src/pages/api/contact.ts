export const prerender = false;

import type { APIRoute } from 'astro';
import { appendFile } from 'fs/promises';
import { join } from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, businessType, message } = data;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Store lead
    const lead = {
      name,
      email,
      businessType: businessType || 'Not specified',
      message: message || '',
      timestamp: new Date().toISOString(),
      source: 'contact_form'
    };

    // Append to leads file
    const leadsPath = join(process.cwd(), 'leads.json');
    try {
      await appendFile(leadsPath, JSON.stringify(lead) + '\n');
    } catch {
      // If file doesn't exist yet, it will be created
    }

    // Optional: Send email notification via nodemailer
    // Uncomment when SMTP is configured
    /*
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(import.meta.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: import.meta.env.SMTP_USER,
        pass: import.meta.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: import.meta.env.SMTP_USER,
      to: import.meta.env.CONTACT_EMAIL || import.meta.env.SMTP_USER,
      subject: `New Lead: ${name} (${businessType})`,
      text: `Name: ${name}\nEmail: ${email}\nBusiness: ${businessType}\nMessage: ${message}`,
    });
    */

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
