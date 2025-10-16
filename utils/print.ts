import { getIngredientsInterface } from "@/types/ingredient.type";
import { menuIngredientsInterface } from "@/types/menu.type";
import { Image } from "react-native";
import RNFS from "react-native-fs";
//@ts-ignore
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";
import { orderInterface, ordersInterface } from "../types/orders.type";

const logo = require("@/assets/barracks.png");

interface salesInterface  {
  cash:  {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  debitCard:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  gcash:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  payMaya:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  grabPayment:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  chequePayment:   {total : number ,sales : { amount : number, qty : number}, refund : { amount : number, qty : number}},
  totalSales: number,
  totalVat : number,
  serviceFee : number
}

// Helper function to print logo using react-native-fs
const printLogo = async () => {
  try {
    const asset = Image.resolveAssetSource(logo);
    let base64Logo;

    // Handle different asset URI formats between dev and production
    if (asset.uri.startsWith('file://')) {
      // Development build or file system path
      base64Logo = await RNFS.readFile(asset.uri, 'base64');
    } else if (asset.uri.startsWith('http://') || asset.uri.startsWith('https://')) {
      // Development server
      const downloadResult = await RNFS.downloadFile({
        fromUrl: asset.uri,
        toFile: `${RNFS.CachesDirectoryPath}/temp_logo.png`,
      }).promise;
      
      if (downloadResult.statusCode === 200) {
        base64Logo = await RNFS.readFile(`${RNFS.CachesDirectoryPath}/temp_logo.png`, 'base64');
      }
    } else {
      // Production APK - asset is bundled
      // Remove 'asset:/' prefix if present
      const assetPath = asset.uri.replace('asset:/', '').replace('asset://', '');
      base64Logo = await RNFS.readFileAssets(assetPath, 'base64');
    }

    if (base64Logo) {
      await BluetoothEscposPrinter.printPic(base64Logo, {
        width: 384, // Standard thermal printer width
        left: 0,
      });
    }
  } catch (e) {
    console.error("Failed to print logo:", e);
    // Continue without logo if it fails
  }
};

export const printBill = async (order: ordersInterface) => {
  try {
    await printLogo();

    await BluetoothEscposPrinter.printText("\n\r", {});
    await BluetoothEscposPrinter.printText("================================\n", {});
    await BluetoothEscposPrinter.printText(`Resto: The Barracks\n`, {});
    await BluetoothEscposPrinter.printText(`Branch: ${order.branch}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Table: ${order.table}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText("Item                 Qty  Price\n", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});

    for (const item of order.orders) {
      const name = item.name.padEnd(20);
      const qty = String(item.qty).padStart(3);
      const price = (item.price - item.discount).toFixed(2);
      await BluetoothEscposPrinter.printText(`${name}${qty}  ${price}\n`, { encoding: "GBK" });
    }

    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Subtotal:                ${order.subTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Discount:                ${order.totalDiscount.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`VAT (12%):               ${order.vat.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Service Charge (10%):    ${order.serviceFee.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`TOTAL BILL:             ${order.grandTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("================================\n\n\n", {});
  } catch (e) {
    console.error("🧾 Print failed:", e);
  }
};

export const printReceipt = async (order: ordersInterface, cash: number) => {
  try {
    await printLogo();

    await BluetoothEscposPrinter.printText("\n\r", {});
    await BluetoothEscposPrinter.printText("================================\n", {});
    await BluetoothEscposPrinter.printText(`Resto: The Barracks\n`, {});
    await BluetoothEscposPrinter.printText(`Branch: ${order.branch}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Cashier: ${order.cashier}\n`, {});
    await BluetoothEscposPrinter.printText(`Table: ${order.table}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText("Item                 Qty  Price\n", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});

    for (const item of order.orders) {
      const name = item.name.padEnd(20);
      const qty = String(item.qty).padStart(3);
      const price = (item.price - item.discount).toFixed(2);
      await BluetoothEscposPrinter.printText(`${name}${qty}  ${price}\n`, { encoding: "GBK", codepage: 0 });
    }

    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Subtotal:               ${order.subTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Discount:               ${order.totalDiscount.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`VAT (12%):              ${order.vat.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Service Charge (10%):   ${order.serviceFee.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`GRAND TOTAL:             ${order.grandTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Payment:             ${cash.toFixed(2).padStart(10)}\n`, {});
    await BluetoothEscposPrinter.printText(`CHANGE:              ${(cash - order.grandTotal).toFixed(2).padStart(10)}\n`, {});
    await BluetoothEscposPrinter.printText("================================\n", {});
    await BluetoothEscposPrinter.printText(" Thank you for dining with us!\n", {});
    await BluetoothEscposPrinter.printText("================================\n\n\n", {});
  } catch (err) {
    console.error("❌ Print error:", err);
  }
};

export const printForKitchen = async (orders : orderInterface[], table : string, orderNumber : number) => {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    await BluetoothEscposPrinter.printText(
      `${table.toUpperCase()}\n\r`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 2, 
        heigthtimes: 2,
        fonttype: 1, 
      }
    );

     await BluetoothEscposPrinter.printText(
      `order num: ${orderNumber}\n\r`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 1, 
        heigthtimes: 1,
        fonttype: 1, 
      }
    );

    await BluetoothEscposPrinter.printText(`\nTime: ${formatted}\n\r\n\r`, {});

    for (const item of orders) {
      await BluetoothEscposPrinter.printText(
        `${item.name} x${item.qty}\n\r`,
        { encoding: "GBK", codepage: 0 }
      );
    }

    await BluetoothEscposPrinter.printText("\n\r------------------------\n\r\n\r", {});
}

export const printOrderNumber = async (orderNumber: number) => {
  try {
    await printLogo();

    await BluetoothEscposPrinter.printText(`Order Number:\n`, {});
    await BluetoothEscposPrinter.printText("================================\n", {});
    await BluetoothEscposPrinter.printText(
      `          ${orderNumber}\n\r`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 2,
        heigthtimes: 2,
        fonttype: 1,
      }
    );
    await BluetoothEscposPrinter.printText("\n================================\n\n\n", {});
  } catch (err) {
    console.error("❌ printOrderNumber error:", err);
  }
};

export const printRefill = async (connectedDevice : string ,ingridients : menuIngredientsInterface[], ingridientstData : getIngredientsInterface[] , table : string) => {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    await BluetoothEscposPrinter.printText(
      `\n\n Refill ${table.toUpperCase()}\n\r`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 2, 
        heigthtimes: 2,
        fonttype: 1, 
      }
    );

    await BluetoothEscposPrinter.printText(`\nTime: ${formatted}\n\r\n\r`, {});

    for (const item of ingridients) {
      const res = ingridientstData.find((ing) => ing._id === item.id)
      await BluetoothEscposPrinter.printText(
        `${res!.name} x${item.qty}\n\r`,
        { encoding: "GBK", codepage: 0 }
      );
    }

    await BluetoothEscposPrinter.printText("\n\r------------------------\n\r\n\r", {});
}

export const printXReading = async (sales: salesInterface, cashier: string) => {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  try {
    await BluetoothEscposPrinter.printText("X-READING REPORT\n\r", {
      widthtimes: 1,
      heigthtimes: 1,
    });
    await BluetoothEscposPrinter.printText("================================\n\r", {});

    await BluetoothEscposPrinter.printText(`Date: ${formatted}\n\r`, {});
    await BluetoothEscposPrinter.printText(`Printed By:   ${cashier}\n\r`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

    const payments = [
      { name: "Cash", data: sales.cash },
      { name: "Debit Card", data: sales.debitCard },
      { name: "GCash", data: sales.gcash },
      { name: "PayMaya", data: sales.payMaya },
      { name: "GrabPay", data: sales.grabPayment },
      { name: "Cheque", data: sales.chequePayment },
    ];

    for (const p of payments) {
      await BluetoothEscposPrinter.printText("\n================================\n\r", {});

      const label = p.name.padEnd(12);
      const headers = "Qty".padEnd(8) + "Amount".padStart(10);
      await BluetoothEscposPrinter.printText(label + headers + "\n\r", {});

      await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

      const salesQty = String(p.data.sales.qty).padEnd(8);
      const salesAmt = p.data.sales.amount.toFixed(2).padStart(10);
      await BluetoothEscposPrinter.printText("Sales".padEnd(12) + salesQty + salesAmt + "\n\r", {});

      const refundQty = String(p.data.refund.qty).padEnd(8);
      const refundAmt = p.data.refund.amount.toFixed(2).padStart(10);
      await BluetoothEscposPrinter.printText("Refund".padEnd(12) + refundQty + refundAmt + "\n\r", {});
      await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});

      const totalQty = String(p.data.sales.qty + p.data.refund.qty).padEnd(8);
      const totalAmt = p.data.total.toFixed(2).padStart(10);
      await BluetoothEscposPrinter.printText("Net".padEnd(12) + totalQty + totalAmt + "\n\r", {});
      await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
    }

    await BluetoothEscposPrinter.printText("\n\n\r", {});

    await BluetoothEscposPrinter.printText(
      `Total Sales:   ${sales.totalSales.toFixed(2).padStart(14)}\n\r`,
      {}
    );
    await BluetoothEscposPrinter.printText(
      `Total VAT:     ${sales.totalVat.toFixed(2).padStart(14)}\n\r`,
      {}
    );
    await BluetoothEscposPrinter.printText(
      `Service Fee:   ${sales.serviceFee.toFixed(2).padStart(14)}\n\r`,
      {}
    );

    await BluetoothEscposPrinter.printText("================================\n\r\n\r", {});
  } catch (err) {
    console.log("X Reading Print error:", err);
  }
}

export default async function PrintQr({ id, branch, manager, date }: any) {
  await BluetoothEscposPrinter.printText("================================\n\r\n\r", {});
  await BluetoothEscposPrinter.printText(`Deliver to: ${branch}\n\r`, {});
  await BluetoothEscposPrinter.printText(`Request By:   ${manager}\n\r`, {});
  await BluetoothEscposPrinter.printText(`Date:   ${date}\n\r`, {});
  await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
  await BluetoothEscposPrinter.printQRCode(id, 350, 1);
  await BluetoothEscposPrinter.printText("================================\n\r\n\r", {});
}