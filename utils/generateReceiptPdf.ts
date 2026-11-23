import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";

import type { ServiceTransaction } from "../types/serviceTransaction";

type LegacyReceiptData = {
  serviceType: "Airtime" | "Data";
  network: string;
  phoneNumber: string;
  description: string;
  amount: number;
  totalAmount: number;
  transactionReference: string;
  completedAt: string;
};

type ReceiptData = LegacyReceiptData | ServiceTransaction;

type NormalizedReceipt = {
  service: string;
  recipient: string;
  plan?: string;
  provider?: string;
  type?: string;
  reference: string;
  date: string | null;
  status: string;
  via?: string;
  amount: number;
};

const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Date unavailable";

  const normalizedDate = dateString.includes("T")
    ? dateString
    : dateString.replace(" ", "T");

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeReceiptData = (data: ReceiptData): NormalizedReceipt => {
  if ("service" in data) {
    return {
      service: data.service,
      recipient: data.recipient,
      plan: data.plan,
      provider: data.provider,
      type: data.type,
      reference: data.reference,
      date: data.date,
      status: data.status,
      via: data.via,
      amount: Number(data.amount),
    };
  }

  // Preserve support for the existing local purchase receipt flow.
  return {
    service: data.serviceType,
    recipient: data.phoneNumber,
    provider: data.network,
    reference: data.transactionReference,
    date: data.completedAt,
    status: "successful",
    amount: Number(data.totalAmount),
  };
};

const getStatusLabel = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized.includes("success") || normalized.includes("complete")) {
    return "Successful";
  }

  if (
    normalized.includes("fail") ||
    normalized.includes("reject") ||
    normalized.includes("cancel")
  ) {
    return "Failed";
  }

  if (normalized.includes("pending") || normalized.includes("process")) {
    return "Pending";
  }

  return status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Unknown";
};

const getStatusColor = (status: string) => {
  switch (getStatusLabel(status)) {
    case "Successful":
      return "#16a34a";

    case "Failed":
      return "#dc2626";

    case "Pending":
      return "#d97706";

    default:
      return "#6b7280";
  }
};

const sanitizeFileName = (value: string) =>
  value.replace(/[^a-zA-Z0-9_-]/g, "-");

const formatPlan = (service: string, plan?: string) => {
  if (!plan) return null;

  if (service.toLowerCase() === "airtime" && !Number.isNaN(Number(plan))) {
    return `${formatCurrency(Number(plan))} Airtime`;
  }

  return plan;
};

const formatDisplayValue = (value?: string) => {
  if (!value) return "Not available";

  return value.toUpperCase();
};

export async function generateReceiptPdf(data: ReceiptData) {
  const receipt = normalizeReceiptData(data);

  if (!Number.isFinite(receipt.amount)) {
    throw new Error("Invalid transaction amount.");
  }

  const logoAsset = Asset.fromModule(
    require("../assets/images/psalmoteedata-logo.png"),
  );

  await logoAsset.downloadAsync();

  if (!logoAsset.localUri) {
    throw new Error("Unable to load PsalmoteeData logo.");
  }

  const logoBase64 = await FileSystem.readAsStringAsync(logoAsset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const statusLabel = getStatusLabel(receipt.status);
  const statusColor = getStatusColor(receipt.status);

  // Only include relevant receipt information.
  const detailRows: [string, string][] = [
    ["Service", receipt.service.toUpperCase()],
    ["Recipient", receipt.recipient || "Not available"],
  ];

  const plan = formatPlan(receipt.service, receipt.plan);

  if (plan) {
    detailRows.push(["Plan", plan]);
  }

  if (receipt.provider) {
    detailRows.push(["Provider", formatDisplayValue(receipt.provider)]);
  }

  if (receipt.type) {
    detailRows.push(["Type", formatDisplayValue(receipt.type)]);
  }

  detailRows.push(
    ["Transaction Reference", receipt.reference || "Not available"],
    ["Date & Time", formatDate(receipt.date)],
  );

  if (receipt.via) {
    detailRows.push(["Via", receipt.via]);
  }

  const detailsHtml = detailRows
    .map(
      ([label, value]) => `
        <div class="row">
          <span class="label">${escapeHtml(label)}</span>
          <span class="value">${escapeHtml(value)}</span>
        </div>
      `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            background: #f4f7fa;
            padding: 25px;
            color: #111827;
          }

          .receipt {
            max-width: 700px;
            margin: auto;
            background: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }

          .header {
            background: #0EA5C6;
            color: white;
            text-align: center;
            padding: 30px 20px;
          }

          .logo {
            width: 85px;
            height: 85px;
            object-fit: contain;
            margin-bottom: 10px;
            background: white;
            border-radius: 12px;
            padding: 5px;
          }

          .brand {
            font-size: 23px;
            font-weight: bold;
            margin: 0;
          }

          .subtitle {
            font-size: 14px;
            margin-top: 6px;
          }

          .status {
            text-align: center;
            padding: 25px 15px 10px;
          }

          .status-title {
            font-size: 20px;
            font-weight: bold;
          }

          .amount {
            font-size: 30px;
            font-weight: bold;
            color: #111827;
            margin-top: 12px;
          }

          .section {
            padding: 20px;
          }

          .section-title {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #0284A8;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 15px;
            font-size: 14px;
          }

          .label {
            color: #6b7280;
          }

          .value {
            font-weight: bold;
            text-align: right;
            overflow-wrap: anywhere;
          }

          .divider {
            border-top: 1px dashed #d1d5db;
            margin: 5px 20px;
          }

          .total {
            font-size: 16px;
            font-weight: bold;
            color: #0284A8;
          }

          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #6b7280;
          }

          .footer a {
            color: #0284A8;
            text-decoration: none;
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="header">
            <img
              class="logo"
              src="data:image/png;base64,${logoBase64}"
            />

            <h1 class="brand">PsalmoteeData</h1>
            <p class="subtitle">Transaction Receipt</p>
          </div>

          <div class="status">
            <div
              class="status-title"
              style="color: ${statusColor};"
            >
              ${escapeHtml(statusLabel)}
            </div>

            <div class="amount">
              ${formatCurrency(receipt.amount)}
            </div>

            <p class="label">Transaction Amount</p>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Transaction Details</div>

            ${detailsHtml}
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="row total">
              <span>Amount Paid</span>
              <span>${formatCurrency(receipt.amount)}</span>
            </div>
          </div>

          <div class="footer">
            Thank you for using PsalmoteeData.<br />
            For support, contact us at
            <a href="mailto:psalmoteetelecoms@gmail.com">
              psalmoteetelecoms@gmail.com
            </a>
            or
            <a href="https://wa.me/2348058461612">
              WhatsApp Chat
            </a>.
          </div>

        </div>
      </body>
    </html>
  `;

  const pdf = await Print.printToFileAsync({
    html,
    base64: true,
  });

  if (!pdf.base64) {
    throw new Error("Unable to generate PDF data.");
  }

  const fileName = `${sanitizeFileName(receipt.service)}-${sanitizeFileName(
    receipt.recipient,
  )}-${sanitizeFileName(receipt.reference)}.pdf`;

  return {
    base64: pdf.base64,
    fileName,
  };
}