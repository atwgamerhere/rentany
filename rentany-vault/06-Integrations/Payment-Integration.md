# 💳 Jabalpur Rent — Payment Gateway Integration Architecture

> **Focus**: Razorpay & Cashfree Payments Integration (Sandbox in Phase 6, Production in Phase 7).  
> **Security Requirement**: Server-side signature verification, idempotent webhook processing, and automated instant deposit refund triggers.

---

## 1. Payment Lifecycle & Flow

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant W as Frontend
    participant B as Backend API
    participant DB as PostgreSQL
    participant PG as Razorpay / Cashfree Gateway

    Note over C,W: 1. Order Creation
    C->>W: Click "Pay & Reserve" (₹3,600 Rent + ₹5,000 Deposit = ₹8,600)
    W->>B: POST /api/bookings/checkout (booking_id)
    B->>DB: Lock booking record and verify amounts
    B->>PG: POST /v1/orders {amount: 860000, currency: "INR", receipt: booking_id}
    PG-->>B: Return {order_id: "order_xyz123"}
    B-->>W: Return {order_id: "order_xyz123", key_id: "rzp_test_..."}

    Note over C,PG: 2. Checkout Modal & Customer Payment
    W->>PG: Open Razorpay/Cashfree Checkout Modal
    C->>PG: Pay via UPI (PhonePe/GPay), Netbanking, or Debit/Credit Card
    PG-->>W: Client Success Callback {razorpay_payment_id, signature}

    Note over PG,B: 3. Authoritative Webhook Delivery
    PG->>B: POST /api/payments/webhook<br/>Headers: x-razorpay-signature<br/>Body: {"event": "payment.captured", "payload": {...}}
    B->>B: Verify HMAC-SHA256 signature
    B->>DB: Check if order already processed (Idempotency Guard)
    B->>DB: UPDATE bookings SET status = 'CONFIRMED', pickup_otp = '492810';<br/>INSERT INTO payments (...);
    B-->>PG: HTTP 200 OK

    Note over B,C: 4. Notification
    B->>C: Send SMS & WhatsApp with Pickup OTP
```

---

## 2. Webhook Signature Verification Algorithm

The backend validates that the webhook originated from the payment gateway using constant-time cryptographic verification:

```typescript
import crypto from 'crypto';

export function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(signature, 'utf8')
  );
}
```

---

## 3. Idempotent Processing Guard

Gateways retry webhook deliveries if an immediate HTTP 200 response is not received. To prevent double bookings or double crediting:
```sql
-- Enforced via unique constraint on gateway_payment_id
INSERT INTO public.payments (
    booking_id, gateway, gateway_order_id, gateway_payment_id, amount_paid, deposit_held, payment_status
) VALUES ($1, 'RAZORPAY', $2, $3, $4, $5, 'CAPTURED')
ON CONFLICT (gateway_payment_id) DO NOTHING;
```

---

## 4. Automated Instant Deposit Refund Protocol

When the customer returns the device to the shop and the shopkeeper confirms a clean return via the Return OTP:
```typescript
export async function triggerDepositRefund(bookingId: string) {
  const payment = await getPaymentByBooking(bookingId);
  
  if (payment.deposit_status !== 'HELD') {
    throw new Error('Deposit already refunded or forfeited');
  }

  // Trigger instant refund of the deposit amount via Razorpay API
  const refund = await razorpay.payments.refund(payment.gateway_payment_id, {
    amount: payment.deposit_held * 100, // paise
    notes: {
      reason: 'Rental completed cleanly. Deposit returned.',
      booking_id: bookingId
    }
  });

  await recordDepositRefundSuccess(bookingId, refund.id);
}
```

---

## 5. Related Links
- Provider research: [[Provider-Research]]
- Database schema: [[Database-Schema]]
- Security checklist: [[Security-Checklist]]
