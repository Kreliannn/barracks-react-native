import { getIngredientsInterface } from "@/types/ingredient.type";
import { getRefillInterface } from "@/types/refill.type";
import { getOrdersInterface, orderInterface } from "../types/orders.type";


export const getTotalWithVat = (items : orderInterface[] ) => {
    let total = 0
    items.forEach((item) => {
      total += (item.price * item.qty)
    })
    return total
}

export const getTotaldiscount= (items : orderInterface[] ) => {
  let totalDiscount = 0
  items.forEach((item) => {
    totalDiscount += item.discount
  })
  return totalDiscount
}

export const getTotalVat= (items : orderInterface[] ) => {
  let totalVat = 0
  items.forEach((item) => {
    totalVat += item.vat
  })
  return totalVat
}



export const checkIfHasUnli = (items : orderInterface[]) => {
    let value = true
    items.forEach((item) => {
        if(item.type == "Unli") value = false
    })
    return value;
}


export function generateId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    return (
      timestamp +
      "xxxxxxxxxxxxxxxx".replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
      })
    ).toLowerCase();
  }



export function isTime1To3am(time: string) {
  const [hourStr, minutePart] = time.split(':');
  const hour = parseInt(hourStr);
  const isPM = minutePart.toLowerCase().includes('pm');

  let hour24 = hour % 12 + (isPM ? 12 : 0);

  return hour24 >= 1 && hour24 < 3;
}


export function getDate(time: string) {
  if (!isTime1To3am(time)) {
    return new Date().toLocaleDateString('en-CA');
  } else {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('en-CA');
  }
}

export function plus1Day(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('en-CA');
}

export function minus1Day(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
}

export function formatMenuXreading(orders: getOrdersInterface[]) {
  interface menuXreadingInterface {
    menu: string;
    sold: number;
  }

  const formatedData: menuXreadingInterface[] = [];

  orders.forEach((item) => {
    item.orders.forEach((order) => {
      const existing = formatedData.find(f => f.menu === order.name);

      if (existing) {
        existing.sold += order.qty;
      } else {
        formatedData.push({ menu: order.name, sold: order.qty });
      }
    });
  });


  return formatedData
}


export function getIngredientData(id: string, ingredients: getIngredientsInterface[]) {
  return ingredients.find(ing => ing._id === id);
}



export function formatIngridientXreading(ingredients: getIngredientsInterface[], orders: getOrdersInterface[], refills : getRefillInterface[]) {
  interface ingredientXreadingInterface {
    name: string;
    kitchen: number;
    refill: number;
    total: number
  }

  const formatedData: ingredientXreadingInterface[] = [];

  ingredients.forEach((ing) => {
      formatedData.push({ name : ing.name, kitchen : 0, refill : 0, total : 0})
  })


  orders.forEach((item) => {
    item.orders.forEach((order) => {
     const orderQty = order.qty
     order.ingredients.forEach((ing) => {
          const ingData = getIngredientData(ing.id, ingredients)
          const existing = formatedData.find(f => f.name === ingData?.name);
          if(existing){
              const kitchenUsed = ing.qty * orderQty
              existing.kitchen += kitchenUsed
              existing.total += kitchenUsed
          }   
     })
    });
  });


  refills.forEach((Refill) => {
     const existing = formatedData.find(f => f.name === Refill.ingredient);
      if(existing){
        const refillUsed = Refill.qty
        existing.refill += refillUsed
        existing.total += refillUsed
      }   
  })


  return formatedData
}

