module.exports = {

  joesPennyFunction: amountArray => {
    const pennies = [];
    for (var i = 0; i < amountArray.length; i++) {
      if (amountArray[i] === ".") {
        if (typeof amountArray[i + 1] === "string") pennies.push(amountArray[i + 1]);
        else pennies.push("0");
        if (typeof amountArray[i + 2] === "string") pennies.push(amountArray[i + 2]);
        else pennies.push("0");
        break;
      }
      else pennies.push(amountArray[i]);
    }
    return parseInt(pennies.join(''));
  }

}