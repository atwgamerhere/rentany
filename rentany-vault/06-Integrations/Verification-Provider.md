# 🆔 Jabalpur Rent — Identity & KYC Verification Integration

> **Primary Provider Strategy**: DigiLocker API via Setu / Cashfree Verification Suite.  
> **Compliance Priority**: Masked Aadhaar storage only (`XXXX-XXXX-1234`), 100% compliant with UIDAI regulations and DPDP Act 2023.

---

## 1. DigiLocker KYC Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant W as Frontend
    participant B as Backend API
    participant S as Setu / DigiLocker API
    actor G as Gov DigiLocker Portal

    C->>W: Click "Verify Identity with DigiLocker"
    W->>B: POST /api/verification/digilocker/initiate
    B->>S: POST /v1/digilocker/requests (Consent config)
    S-->>B: Return {request_id: "dl_req_8921", redirect_url: "https://dg.setu.co/..."}
    B-->>W: Return redirect_url
    W->>G: Redirect Customer to official DigiLocker Portal

    Note over C,G: Government Hosted Portal
    C->>G: Authenticate with 12-digit Aadhaar & Mobile OTP
    C->>G: Grant Consent: "Share Aadhaar XML with Jabalpur Rent"
    G-->>S: Authorized (Aadhaar data packaged)

    S->>B: POST /api/verification/webhook (Signed Payload)
    
    Note over B: Redaction & Compliance Filter
    B->>B: 1. Validate Setu Webhook Signature<br/>2. Extract Legal Full Name<br/>3. Extract Masked Aadhaar (XXXX-XXXX-1234)<br/>4. Extract Permanent Address & Pincode<br/>5. Discard raw biometric/XML data
    
    B->>B: Check if Address Pincode is in Jabalpur (482001 - 482005)
    B->>W: Push Notification: "KYC Verified! Local Jabalpur Resident Tier Assigned."
```

---

## 2. Verification Tiers & Risk Profile

| Tier Level | Name | Requirements | Benefits | Security Deposit Required |
| :---: | :--- | :--- | :--- | :---: |
| **Tier 0** | Unverified | Mobile OTP only | Can browse only; **cannot book hardware** | N/A |
| **Tier 1** | Verified Jabalpur Resident | DigiLocker OKYC with Jabalpur address (482001-482005) | Can book up to 2 devices simultaneously | Standard Deposit (₹5,000 for iPhone 15 Pro) |
| **Tier 2** | Verified Tourist / Outstation | DigiLocker OKYC with non-Jabalpur address + Hotel/Stay proof | Can book 1 device | Higher Deposit (₹8,000 - ₹10,000) |
| **Tier 3** | Verified Student (IIITDM / JEC / Medical) | DigiLocker OKYC + Verified Student ID | 10% student discount | Standard Deposit |

---

## 3. Server Redaction Filter (Code Blueprint)

```typescript
export function sanitizeDigiLockerPayload(payload: any) {
  const rawAadhaar = payload.document?.aadhaar_number || '';
  
  // Enforce UIDAI masking: replace first 8 digits with 'X'
  const lastFour = rawAadhaar.slice(-4);
  const maskedAadhaar = `XXXX-XXXX-${lastFour}`;

  return {
    verified_name: payload.document?.name,
    masked_aadhaar: maskedAadhaar,
    date_of_birth: payload.document?.dob,
    verified_address: payload.document?.address,
    city: payload.document?.city || 'Jabalpur',
    state: payload.document?.state || 'Madhya Pradesh',
    pincode: payload.document?.pincode,
    document_hash: crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')
  };
}
```

---

## 4. Related Links
- Provider research: [[Provider-Research]]
- Privacy & data retention: [[Privacy-and-Data-Retention]]
- Database schema: [[Database-Schema]]
