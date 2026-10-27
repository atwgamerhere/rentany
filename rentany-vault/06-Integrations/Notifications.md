# 📢 Jabalpur Rent — Notifications Architecture (SMS & WhatsApp)

> **Notification Channels**: Transactional SMS (TRAI DLT compliant) and WhatsApp Business Cloud API.  
> **Rule**: High deliverability is required for time-sensitive Pickup and Return OTPs.

---

## 1. Notification Event Lifecycle

| Event Trigger | Recipient | Preferred Channel | Message Content Summary |
| :--- | :--- | :---: | :--- |
| **User Registration** | Customer | SMS / WhatsApp | "Your Jabalpur Rent verification OTP is 492019. Valid for 10 minutes." |
| **Booking Confirmed** | Customer | SMS & WhatsApp | "Booking Confirmed! Order #JR-8921. Your Pickup OTP is **849201**. Collect your iPhone 15 Pro at Mobile World, Russell Chowk." |
| **New Booking Alert** | Shopkeeper | WhatsApp & Push | "New Rental! Customer arriving today at 16:00 for iPhone 15 Pro (Unit #A-102). Verify Pickup OTP on shop portal." |
| **Handover Complete** | Customer | SMS | "Phone handed over! Your rental ends on Nov 13, 18:00. Return on time to ensure instant deposit refund." |
| **Return Due (T-4 Hours)**| Customer | WhatsApp | "Friendly reminder: Return due in 4 hours at Mobile World, Russell Chowk. Please remember to log out of Apple ID." |
| **Return Confirmed** | Customer | SMS & WhatsApp | "Device returned in clean condition! Your ₹5,000 security deposit refund has been initiated." |

---

## 2. Regulatory Compliance: TRAI DLT Mandate

In India, commercial transactional SMS is strictly regulated by the Telecom Regulatory Authority of India (TRAI):
1. **Entity Registration**: The business must be registered on an authorized DLT portal (e.g., Jio DLT, Airtel DLT, Vilpower) with PAN, Aadhaar/GSTIN.
2. **Sender Header Approval**: A 6-character alphabetic header is assigned (e.g., `JBLRNT` or `RNTANY`).
3. **Template Approval**: Every message template must be pre-approved word-for-word with dynamic variables (e.g., `{#var#}`).
4. **Development / Prototype Workaround**:
   - For Phase 1 through 6, we use **WhatsApp Cloud API** or **Fast2SMS Quick Transactional Route**, which bypasses upfront DLT registration for testing, or Supabase test SMS credentials.

---

## 3. Related Links
- Provider research: [[Provider-Research]]
- System architecture: [[System-Architecture]]
- Cost tracking: [[Cost-Tracking]]
