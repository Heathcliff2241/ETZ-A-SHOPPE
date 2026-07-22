import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { adminConfig } from './adminConfig.js';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendOtp(toEmail: string, code: string): Promise<void> {
  if (!isMailConfigured()) {
    throw new Error('SMTP is not configured on the server.');
  }

  await transporter.sendMail({
    from: `"ETZ" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Your Admin Login Code: ${code}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 32px; background: #FAF9F5; border: 1px solid #e8e6df; border-radius: 0px;">
        <h2 style="margin: 0 0 6px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: #1c1c1a;">ETZ</h2>
        <p style="color: #6b6b65; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 32px; font-weight: 600;">Admin Security Verification</p>
        <p style="color: #1c1c1a; font-size: 14px; margin: 0 0 16px; line-height: 1.5; font-weight: 400;">Your one-time administration login verification code is:</p>
        <div style="background: #1c1c1a; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 10px; text-align: center; padding: 24px; border-radius: 0px; margin: 0 0 24px; font-family: Courier, monospace;">
          ${code}
        </div>
        <p style="color: #8c8c80; font-size: 12px; margin: 0; line-height: 1.5;">This code will automatically expire in <strong>10 minutes</strong>. If you did not initiate this request, please ignore this message securely.</p>
      </div>
    `,
  });
}

export async function sendOrderNotification(
  order: {
    id: string;
    customerName: string;
    customerEmail: string;
    status: string;
    subtotal: number;
    paymentMethod?: 'gcash' | 'cash';
    items: Array<{ productName?: string; productId?: string }>;
  },
  notifyAdmin: boolean = false
): Promise<void> {
  if (!isMailConfigured()) {
    console.warn(`
[SMTP NOTIFICATION MOCK] Order ${order.id} status updated to ${order.status.toUpperCase()}!
  - Target: ${notifyAdmin ? 'Both Admin and Customer' : 'Customer Only'}
  - Customer Email: ${order.customerEmail}
  - Customer Name: ${order.customerName}
  - Subtotal: ₱${order.subtotal.toLocaleString()}
  - Items: ${order.items.map((item) => item.productName || item.productId || 'Item').join(', ')}
  * Note: To enable real customer and admin email delivery, please configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in the secrets menu.
    `);
    return;
  }

  const itemSummary = order.items
    .map((item) => item.productName || item.productId || 'Item')
    .join(', ');
  const adminEmail = adminConfig.getNotificationEmail();
  const subject = `Order ${order.id} Status Update: ${order.status.toUpperCase()}`;
  
  // Construct absolute admin portal link using APP_URL if defined
  const appUrl = process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
    ? process.env.APP_URL
    : '';
  const adminUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/admin` : '/admin';

  const paymentLabel = order.paymentMethod === 'gcash' ? 'GCash Transfer' : 'Cash on Delivery / Pickup';
  const paymentBadgeColor = order.paymentMethod === 'gcash' ? '#2563eb' : '#6b7280';

  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FAF9F5; border: 1px solid #e8e6df; color: #1c1c1a;">
      <h2 style="margin: 0 0 6px; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: #1c1c1a;">ETZ</h2>
      <p style="color: #6b6b65; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 28px; font-weight: 600;">System Administrator Notification</p>
      <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: #1c1c1a;">
        An order has been placed or updated. The order status is now <span style="background: #e8e6df; padding: 2px 8px; font-weight: 600; font-size: 12px; border-radius: 4px;">${order.status.toUpperCase()}</span>.
      </p>
      <div style="background: #ffffff; border: 1px solid #e8e6df; padding: 24px; margin: 24px 0; line-height: 1.6; font-size: 13px;">
        <p style="margin: 0 0 10px; border-bottom: 1px solid #f2f0ea; padding-bottom: 10px;"><strong style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #8c8c80; display: block; margin-bottom: 2px;">Order ID</strong> <span style="font-size: 15px; font-weight: 600;">${order.id}</span></p>
        <p style="margin: 0 0 10px; border-bottom: 1px solid #f2f0ea; padding-bottom: 10px;"><strong style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #8c8c80; display: block; margin-bottom: 2px;">Customer Details</strong> <strong>${order.customerName}</strong> (${order.customerEmail})</p>
        <p style="margin: 0 0 10px; border-bottom: 1px solid #f2f0ea; padding-bottom: 10px;"><strong style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #8c8c80; display: block; margin-bottom: 2px;">Garments Purchased</strong> ${itemSummary || 'No items listed'}</p>
        <p style="margin: 0 0 10px; border-bottom: 1px solid #f2f0ea; padding-bottom: 10px;">
          <strong style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #8c8c80; display: block; margin-bottom: 2px;">Payment Method</strong>
          <span style="background: ${paymentBadgeColor}; color: #ffffff; padding: 2px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; font-family: monospace;">${paymentLabel}</span>
        </p>
        <p style="margin: 0;"><strong style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #8c8c80; display: block; margin-bottom: 2px;">Total Due</strong> <span style="font-size: 16px; font-weight: 700; color: #2D6A4F;">₱${Number(order.subtotal).toLocaleString()}</span></p>
      </div>
      ${order.paymentMethod === 'gcash' ? `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 20px; border-radius: 6px; margin: 16px 0; font-size: 13px; color: #1e40af;">
        <strong style="display: block; margin-bottom: 4px;">⚠️ GCash Payment – Action Required</strong>
        This customer has chosen to pay via GCash. Please check your GCash inbox for a transfer of <strong>₱${Number(order.subtotal).toLocaleString()}</strong> from this customer before confirming the order. Once verified, update the Payment Status to <strong>Paid</strong> in the Admin Panel.
      </div>` : ''}
      <div style="margin-top: 32px; text-align: center;">
        <a href="${adminUrl}" style="display: inline-block; background: #1c1c1a; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border: none; transition: background 0.3s;">
          Open Admin Panel
        </a>
      </div>
    </div>
  `;

  let customerMessage = '';
  let statusBadgeColor = '#d97706'; // amber for pending
  let nextStepsHtml = '';

  const cleanFirstName = order.customerName.split(' ')[0] || order.customerName;

  switch (order.status) {
    case 'confirmed':
      statusBadgeColor = '#4f46e5'; // indigo
      customerMessage = `Great news! Your reservation request has been officially <strong>CONFIRMED</strong> by our team. We have inspected your hand-selected 1-of-1 items under high-intensity light and packed them securely. They are now officially set aside for you and ready for handover!`;
      nextStepsHtml = `
        <li style="margin-bottom: 6px;"><strong>Coordinate Handover:</strong> We will contact you shortly via SMS or Messenger to align on your preferred pickup time in Loong, Tabogon, or finalize courier/shipping details if you chose delivery.</li>
        <li style="margin-bottom: 6px;"><strong>Payment:</strong> You can complete payment via GCash or pay in Cash during the physical handover.</li>
        <li style="margin-bottom: 6px;"><strong>Enjoy your new wear:</strong> Your pre-loved items are freshly sanitized and ready to wear!</li>
      `;
      break;
    case 'shipped':
      statusBadgeColor = '#9333ea'; // purple
      customerMessage = `Exciting news! Your curated garments are now on their way! They have been securely handed over to our shipping partner or courier and are officially <strong>SHIPPED</strong>.`;
      nextStepsHtml = `
        <li style="margin-bottom: 6px;"><strong>Delivery in Progress:</strong> Your package is being transported to your specified address. Please ensure someone is available to receive the package.</li>
        <li style="margin-bottom: 6px;"><strong>Courier Coordination:</strong> Our courier or shipping partner will reach out to you via SMS or phone call upon arrival.</li>
        <li style="margin-bottom: 6px;"><strong>Inspect on Arrival:</strong> When your beautifully-sorted thrift gems arrive, open them up and enjoy your sustainable new pieces!</li>
      `;
      break;
    case 'picked_up':
      statusBadgeColor = '#0d9488'; // teal
      customerMessage = `Your order has been officially <strong>PICKED UP & COMPLETED</strong>! We hope these hand-selected thrift pieces bring you joy and a great fit. Thank you for visiting us and supporting sustainable 1-of-1 fashion.`;
      nextStepsHtml = `
        <li style="margin-bottom: 6px;"><strong>Give them love:</strong> Wear them with pride! You have officially given these garments their next chapter.</li>
        <li style="margin-bottom: 6px;"><strong>Share your fit:</strong> Tag us or tell your friends about your new favorite find!</li>
        <li style="margin-bottom: 6px;"><strong>Visit us again:</strong> Check back regularly as we add curated secondhand treasures to our collection.</li>
      `;
      break;
    case 'delivered':
      statusBadgeColor = '#059669'; // emerald
      customerMessage = `Your order has been officially marked as <strong>DELIVERED & COMPLETED</strong>! We hope these beautiful pieces bring you joy and a great fit. Thank you for supporting sustainable 1-of-1 fashion here in Cebu.`;
      nextStepsHtml = `
        <li style="margin-bottom: 6px;"><strong>Give them love:</strong> Wear them with pride! You have officially given these beautiful garments their next chapter.</li>
        <li style="margin-bottom: 6px;"><strong>Share your look:</strong> Tag us or tell your friends about your new favorite find!</li>
        <li style="margin-bottom: 6px;"><strong>Visit again:</strong> We regularly update our rack with curated secondhand treasures. Check back soon!</li>
      `;
      break;
    case 'cancelled':
      statusBadgeColor = '#dc2626'; // red
      customerMessage = `Your reservation request for this order has been <strong>CANCELLED</strong>. The items have been returned to our public rack so other customers can discover them. If you did not request this cancellation or have any questions, please reply to this email or reach out to us.`;
      nextStepsHtml = `
        <li style="margin-bottom: 6px;"><strong>Find another fit:</strong> Explore our shop again! We add new carefully-sorted items weekly.</li>
        <li style="margin-bottom: 6px;"><strong>Need help?</strong> If this cancellation was an accident, contact us and we'll do our best to help you find similar items or see if the original piece is still available.</li>
      `;
      break;
    case 'pending':
    default:
      statusBadgeColor = '#d97706'; // amber
      customerMessage = `Thank you for choosing to give these garments another chapter! We have received your order request and have temporarily reserved these 1-of-1 items for you. Since everything on our rack is strictly unique, our team will inspect the pieces one final time and confirm your order shortly.`;
      nextStepsHtml = `
        <li style="margin-bottom: 6px;"><strong>Final Quality Check:</strong> We inspect every item under high-intensity light to verify its exact condition.</li>
        <li style="margin-bottom: 6px;"><strong>Order Confirmation:</strong> Once checked, we will approve the order and notify you via email and SMS.</li>
        <li style="margin-bottom: 6px;"><strong>Arrange Handover:</strong> We will reach out to organize your local pickup in Loong, Tabogon, or arrange direct courier shipping across Cebu.</li>
        ${order.paymentMethod === 'gcash'
          ? `<li style="margin-bottom: 6px;"><strong>GCash Payment:</strong> Please send <strong>₱${Number(order.subtotal).toLocaleString()}</strong> to the GCash number provided in your checkout. Your order will be confirmed once we verify receipt of your payment.</li>`
          : `<li style="margin-bottom: 6px;"><strong>Cash Payment:</strong> You have selected Cash on Delivery / Pickup. You will pay once you receive or pick up the parcel — no upfront payment needed!</li>`
        }
      `;
      break;
  }

  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FAF9F5; border: 1px solid #e8e6df; color: #1c1c1a;">
      <div style="border-bottom: 1px solid #e8e6df; padding-bottom: 24px; margin-bottom: 24px;">
        <h1 style="margin: 0 0 4px; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: #1c1c1a;">ETZ</h1>
        <p style="color: #6b6b65; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-weight: 600;">Good clothes. Already lived in.</p>
      </div>
      
      <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; font-weight: 400; color: #1c1c1a;">
        Hi ${cleanFirstName},
      </p>
      
      <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4a4a45; font-weight: 300;">
        ${customerMessage}
      </p>

      <div style="background: #ffffff; border: 1px solid #e8e6df; padding: 28px; margin: 28px 0; font-size: 13px; line-height: 1.6;">
        <h3 style="margin: 0 0 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8c8c80; border-bottom: 1px solid #f2f0ea; padding-bottom: 8px;">Order Details</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td style="padding: 6px 0; color: #8c8c80; width: 35%;">Order ID:</td>
            <td style="padding: 6px 0; font-weight: 600; font-family: monospace; font-size: 14px;">${order.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #8c8c80;">Order Status:</td>
            <td style="padding: 6px 0; font-weight: 600;"><span style="background: ${statusBadgeColor}; color: #ffffff; padding: 2px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-family: monospace; border-radius: 3px;">${order.status.toUpperCase()}</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #8c8c80; vertical-align: top;">Garments:</td>
            <td style="padding: 6px 0; font-weight: 500; color: #1c1c1a;">${itemSummary || 'No items listed'}</td>
          </tr>
          <tr style="border-top: 1px solid #f2f0ea;">
            <td style="padding: 12px 0 0; color: #8c8c80; font-size: 14px;">Total Price:</td>
            <td style="padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #2D6A4F;">₱${Number(order.subtotal).toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <div style="border-top: 1px solid #e8e6df; padding-top: 24px; margin-top: 32px; font-size: 12px; color: #8c8c80; line-height: 1.6; font-weight: 300;">
        <p style="margin: 0 0 8px;"><strong>What happens next?</strong></p>
        <ol style="margin: 0; padding-left: 16px; color: #4a4a45;">
          ${nextStepsHtml}
        </ol>
        <p style="margin: 16px 0 0; font-size: 11px; font-style: italic; color: #b5b5ad;">ETZ — Hand-checked, beautifully sorted vintage & secondhand garments from Tabogon, Cebu, PH.</p>
      </div>
    </div>
  `;

  if (notifyAdmin) {
    try {
      await transporter.sendMail({ from: `"ETZ" <${process.env.SMTP_USER}>`, to: adminEmail, subject, html: adminHtml });
    } catch (err) {
      console.warn('Failed to send admin notification email:', err);
    }
  }

  try {
    await transporter.sendMail({ from: `"ETZ" <${process.env.SMTP_USER}>`, to: order.customerEmail, subject: `Your ETZ Reservation ${order.id} is ${order.status.toUpperCase()}`, html: customerHtml });
  } catch (err) {
    console.warn('Failed to send customer notification email:', err);
  }
}
