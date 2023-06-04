export const CalculateDiffDays = (time) => {
  const date1 = new Date(time);
  date1.setHours(0, 0, 0, 0);
  const date2 = new Date(Date.now());
  date2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(date2 - date1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const CalculateRemaining = (product) => {
  if (!product.duration) {
    return {
      days: -1,
      percentage: 2,
    };
  } else {
    const inProducts = product.logs.filter((l) => !l.timeOut);
    let remainingDays = 0;

    inProducts.forEach((p) => {
      const diffDays = CalculateDiffDays(p.timeIn);
      remainingDays += product.duration - diffDays;

      if (product.duration - diffDays <= 0)
        product.logs[product.logs.indexOf(p)].timeOut = new Date(
          Date.now()
        ).toISOString();
    });

    const percentage = remainingDays / (inProducts.length * product.duration);

    return {
      days: remainingDays.toFixed(2),
      percentage: isNaN(percentage) ? 0 : percentage,
    };
  }
};

export const CalculateNext = (products) => {
  let total = 0;

  products.forEach((p) => {
    if (p.list === "To Buy") {
      total += parseFloat(p.cost);
    }
  });

  return total.toFixed(2);
};

export const CreateList = (products, options) => {
  let moneySpent = 0;
  const frequency = 7 / parseFloat(options.weeklyShopping);
  const nextMax =
    (parseFloat(options.weeklySpend) + parseFloat(options.weeklySpend) * 0.05) /
    parseFloat(options.weeklyShopping);

  products
    .sort((a, b) => {
      let aPer = CalculateRemaining(a).percentage;
      let bPer = CalculateRemaining(b).percentage;
      if (aPer === bPer) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      } else {
        return aPer > bPer;
      }
    })
    .forEach((p) => {
      if (p.tags.includes("Hold") && CalculateDiffDays(p.lastUpdated) > 0) {
        p.tags = p.tags.filter((t) => t !== "Hold");
      }

      moneySpent = (parseFloat(moneySpent) + parseFloat(p.cost)).toFixed(2);
      const remaining = CalculateRemaining(p);
      let toBuy = parseFloat(moneySpent) < nextMax.toFixed(2);

      p.remaining = remaining;

      if (remaining.days > frequency) {
        p.list = "In Stock";
        moneySpent = (parseFloat(moneySpent) - parseFloat(p.cost)).toFixed(2);
      } else if (
        (!toBuy && remaining.percentage <= 1) ||
        p.tags.includes("Hold")
      ) {
        p.list = "Needed";
        moneySpent = (parseFloat(moneySpent) - parseFloat(p.cost)).toFixed(2);
      } else if (toBuy) {
        p.list = "To Buy";
      } else {
        p.list = "";
      }
    });

  return products;
};
