import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

type ReceiptFile = {
  base64: string;
  fileName: string;
};

export async function downloadReceipt(receipt: ReceiptFile) {
  const permission =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permission.granted) {
    return false;
  }

  const file = await FileSystem.StorageAccessFramework.createFileAsync(
    permission.directoryUri,
    receipt.fileName,
    "application/pdf",
  );

  await FileSystem.writeAsStringAsync(file, receipt.base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return true;
}

export async function shareReceipt(receipt: ReceiptFile) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device.");
  }

  const receiptUri = `${FileSystem.cacheDirectory}${receipt.fileName}`;

  await FileSystem.writeAsStringAsync(receiptUri, receipt.base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(receiptUri, {
    mimeType: "application/pdf",
    dialogTitle: "Share PsalmoteeData Receipt",
    UTI: "com.adobe.pdf",
  });
}
