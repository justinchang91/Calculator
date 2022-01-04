function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function operate(operator, num1, num2) {
    if (operator === "+") {
        return add(num1, num2);
    } else if (operator === "-") {
        return subtract(num1, num2);
    } else if (operator === "*") {
        return multiply(num1, num2);
    } else if (operator === "/") {
        return divide(num1, num2);
    } else {
        throw "Operator error: invalid operator";
    }
}

// Add event listeners
const clear = document.querySelector(".clear");
clear.addEventListener("click", clearDisplayText);

const equate = document.querySelector(".equals");
equate.addEventListener("click", calculateResult);

const numbers = document.querySelectorAll(".number");
numbers.forEach(number => {
    number.addEventListener("click", populateDisplayNumber);
});

const operators = document.querySelectorAll(".operator");
operators.forEach(operator => {
    operator.addEventListener("click", populateDisplaySign);
});

// Important variables
let displayText = "";  // What the user sees
let number = ""; // Keep track of the current number (before the next sign)
let equation = [];

// Utility functions
function updateDisplayText(val) {
    displayText = displayText + val;
}

function updateNumber(val) {
    number = number + val;
}

function updateEquation(num, sign) {
    equation.push(num);
    equation.push(sign);
    console.log("equation: ")
    console.log(equation);
}

function clearDisplayText() {
    displayText = "";
    const display = document.querySelector(".display");
    display.textContent = displayText;
    clearNumber();
    equation = [];
}

function clearNumber() {
    number = "";
}

function populateDisplayNumber(e) {
    const num = e.target.innerText;
    updateDisplayText(num);
    updateNumber(num);

    console.log("number: " + number);
    const display = document.querySelector(".display");
    display.textContent = displayText;
}

function populateDisplaySign(e) {
    const sign = e.target.innerText;
    updateDisplayText(sign);
    const num = parseInt(number);
    updateEquation(num, sign);
    clearNumber();
    console.log("number: " + number);

    const display = document.querySelector(".display");
    display.textContent = displayText;
}

function done() {
    const operators = ["+", "-", "*", "/"];
    for (let i = 0; i < operators.length; i++) {
        if (equation.includes(operators[i])) {
            return false;
        }
    }
    return true;
}

function performStep(operator) {
    const index = equation.indexOf(operator);
    const num1Index = index-1;
    const num2Index = index+1;

    const leftSide = equation.slice(0, num1Index);
    const rightSide = equation.slice(num2Index+1);

    const result = operate(equation[index], equation[num1Index], equation[num2Index]);
    equation = leftSide.concat(result, rightSide);
}

function calculateResult() {
    // Add the number before "=" to the equaton
    equation.push(parseInt(number));
    console.log(equation);

    while (!done()) {
        if (equation.includes("/")) {
            performStep("/");
        } else if (equation.includes("*")) {
            performStep("*");
        } else if (equation.includes("+")) {
            performStep("+");
        } else {
            performStep("-");
        }
    }

    // By now there should be just the result left in the equation
    const result = equation[0];
    displayText = result;
    number = `${result}`;  // make the result the most recent number (incase of more operations on result)
    const display = document.querySelector(".display");
    display.textContent = displayText;
    equation.pop(); // Remove everything that's in the array. Since we stored the result in number, next time we click the sign we will use the result and add to array.
}

// Okay need to do some work with how I'm displaying my results and I may need to update displaytext/equation variables 
// Having an issue where if I press the equal sign, get the result, then do another operation on the result, the equation array
// for some reason gets the previous number added to it.

// 3*8/2+5-9/3 - mine: 14, linux: 14