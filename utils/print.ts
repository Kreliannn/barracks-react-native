
import { getIngredientsInterface } from "@/types/ingredient.type";
import { menuIngredientsInterface } from "@/types/menu.type";

import { Image } from "react-native";
//@ts-ignore
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer";
import { orderInterface, ordersInterface } from "../types/orders.type";

const logo = require("@/assets/barracks.png")

export const printBill = async (order: ordersInterface) => {
    
  const asset = Image.resolveAssetSource(logo);

    // 2. Fetch the image and convert to blob
    const response = await fetch(asset.uri);
    const blob = await response.blob();

    // 3. Convert blob → Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      {/* @ts-ignore */}
      const base64Logo = reader.result.split(",")[1]; // strip "data:image/png;base64,"

      // 4. Print the logo
      await BluetoothEscposPrinter.printPic(base64Logo, {
        width: 600, // adjust for printer
        left: 0,
      });
    };

    reader.readAsDataURL(blob);

    await BluetoothEscposPrinter.printText("\n\r", {}); // line break
  
    await BluetoothEscposPrinter.printText("================================\n", {});

    // Info
   
    await BluetoothEscposPrinter.printText(`Resto: ${"The Barracks"}\n`, {});
    await BluetoothEscposPrinter.printText(`Branch: ${order.branch}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Table: ${order.table}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});

    // Items header
    await BluetoothEscposPrinter.printText("Item                 Qty  Price\n", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});

    // Items
    for (const item of order.orders) {
      const name = item.name.padEnd(20);
      const qty = String(item.qty).padStart(3);
      const price = (item.price - item.discount).toFixed(2);
      await BluetoothEscposPrinter.printText(`${name}${qty}  ${price}\n`,    { encoding: "GBK", codepage: 0 });
    }

    // Totals
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Subtotal:                ${order.subTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Discount:                ${order.totalDiscount.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`VAT (12%):               ${order.vat.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Service Charge (10%):    ${order.serviceFee.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`GRAND TOTAL:             ${order.grandTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("================================\n\n\n", {});

};


export const printReceipt = async (order: ordersInterface, cash : number) => {
    
  const asset = Image.resolveAssetSource(logo);

    // 2. Fetch the image and convert to blob
    const response = await fetch(asset.uri);
    const blob = await response.blob();

    // 3. Convert blob → Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      {/* @ts-ignore */}
      const base64Logo = reader.result.split(",")[1]; // strip "data:image/png;base64,"

      // 4. Print the logo
      await BluetoothEscposPrinter.printPic(base64Logo, {
        width: 600, // adjust for printer
        left: 0,
      });
    };

    reader.readAsDataURL(blob);

    await BluetoothEscposPrinter.printText("\n\r", {}); // line break
  
    await BluetoothEscposPrinter.printText("================================\n", {});

    // Info
   
    await BluetoothEscposPrinter.printText(`Resto: ${"The Barracks"}\n`, {});
    await BluetoothEscposPrinter.printText(`Branch: ${order.branch}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`cashier: ${order.cashier}\n`, {});
    await BluetoothEscposPrinter.printText(`Table: ${order.table}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});

    // Items header
    await BluetoothEscposPrinter.printText("Item                 Qty  Price\n", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});

    // Items
    for (const item of order.orders) {
      const name = item.name.padEnd(20);
      const qty = String(item.qty).padStart(3);
      const price = (item.price - item.discount).toFixed(2);
      await BluetoothEscposPrinter.printText(`${name}${qty}  ${price}\n`,    { encoding: "GBK", codepage: 0 });
    }

    // Totals
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Subtotal:               ${order.subTotal.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Discount:               ${order.totalDiscount.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`VAT (12%):              ${order.vat.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText(`Service Charge (10%):   ${order.serviceFee.toFixed(2)}\n`, {});
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`GRAND TOTAL:             ${order.grandTotal.toFixed(2)}\n`, {});

       // Totals
    await BluetoothEscposPrinter.printText("--------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`Payment:             ${cash.toFixed(2).padStart(10)}\n`, {});
    await BluetoothEscposPrinter.printText(`CHANGE:             ${(cash - order.grandTotal).toFixed(2).padStart(10)}\n`, {});

    // Footer
    await BluetoothEscposPrinter.printText("================================\n", {});
    await BluetoothEscposPrinter.printText(" Thank you for dining with us!\n", {});
    await BluetoothEscposPrinter.printText("================================\n\n\n", {});

};




export const printForKitchen = async (connectedDevice : string ,orders : orderInterface[], table : string) => {
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
      ` ${table.toUpperCase()}\n\r`,
      {
        encoding: "GBK",
        codepage: 0,
        widthtimes: 2, 
        heigthtimes: 2,
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