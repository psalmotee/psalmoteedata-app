import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";

type ReceiptData = {
  serviceType: "Airtime" | "Data";
  network: string;
  phoneNumber: string;
  description: string;
  amount: number;
  totalAmount: number;
  transactionReference: string;
  completedAt: string;
};

const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Format the date string into a more readable format.
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-NG", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

export async function generateReceiptPdf(data: ReceiptData) {
  // Load the PsalmoteeData logo.
  const logoAsset = Asset.fromModule(
    require("../assets/images/psalmoteedata-logo.png")
  );

  await logoAsset.downloadAsync();

  if (!logoAsset.localUri) {
    throw new Error("Unable to load PsalmoteeData logo.");
  }

  // Convert the logo into Base64 for embedding in the PDF.
  const logoBase64 = await FileSystem.readAsStringAsync(
    logoAsset.localUri,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );

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
            color: #16a34a;
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
            <div class="status-title">✓ Transaction Successful</div>

            <div class="amount">
              ${formatCurrency(data.totalAmount)}
            </div>

            <p class="label">Amount Paid</p>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Transaction Details</div>

            <div class="row">
              <span class="label">Transaction Type</span>
              <span class="value">${data.serviceType}</span>
            </div>

            <div class="row">
              <span class="label">Network</span>
              <span class="value">${data.network}</span>
            </div>

            <div class="row">
              <span class="label">Recipient</span>
              <span class="value">${data.phoneNumber}</span>
            </div>

            <div class="row">
              <span class="label">Description</span>
              <span class="value">${data.description}</span>
            </div>

            <div class="row">
              <span class="label">Transaction Reference</span>
              <span class="value">${data.transactionReference}</span>
            </div>

            <div class="row">
              <span class="label">Date & Time</span>
              <span class="value">${formatDate(data.completedAt)}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="row">
              <span class="label">Amount</span>
              <span class="value">${formatCurrency(data.amount)}</span>
            </div>

            <div class="row total">
              <span>Total Amount Paid</span>
              <span>${formatCurrency(data.totalAmount)}</span>
            </div>
          </div>

          <div class="footer">
            Thank you for using PsalmoteeData.<br />
            For support, contact us at <a href="mailto:psalmoteetelecoms@gmail.com">psalmoteetelecoms@gmail.com</a> or <a href="https://wa.me/+2348058461612">WhatsApp Chat</a>.
          </div>

        </div>
      </body>
    </html>
  `;

  // Generate the PDF.
  const pdf = await Print.printToFileAsync({
    html,
    base64: true,
  });

  if (!pdf.base64) {
    throw new Error("Unable to generate PDF data.");
  }

  const fileName = `${data.serviceType}-${data.phoneNumber}-${data.transactionReference}.pdf`;

  return {
    base64: pdf.base64,
    fileName,
  };
}