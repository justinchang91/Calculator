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
const del = document.querySelector(".delete");
del.addEventListener("click", deleteLastElement);

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

const leftParenthesis = document.querySelector(".left-bracket");
leftParenthesis.addEventListener("click", populateDisplayLeftParenthesis);


const rightParenthesis = document.querySelector(".right-bracket");
rightParenthesis.addEventListener("click", populateDisplayRightParenthesis);


// Important variables
let displayText = "";  // What the user sees
let number = ""; // Keep track of the current number (before the next sign)
let oldNumbers = []; // Keep track of old numbers
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
    oldNumbers.push(number);
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
    if (number === "") { // For deletion purposes
        equation.push(sign);
    } else {
        const num = parseInt(number);
        updateEquation(num, sign);
        clearNumber();
        console.log("number: " + number);
    }
    

    const display = document.querySelector(".display");
    display.textContent = displayText;
}

function populateDisplayLeftParenthesis(e) {

    const parenthesis = e.target.innerText;
    updateDisplayText(parenthesis);
    equation.push(parenthesis); // can't use the updateEquation function

    const display = document.querySelector(".display");
    display.textContent = displayText;

    // Don't want to add the parenthesis to number! 
    // Actually we do, only if it's the right parenthesis. Right parenthesis SHOULD use updateEquation and then clear number
}

function populateDisplayRightParenthesis(e) {

    const parenthesis = e.target.innerText;
    updateDisplayText(parenthesis);
    const num = parseInt(number);
    updateEquation(num, ")");
    clearNumber();

    const display = document.querySelector(".display");
    display.textContent = displayText;
}

function deleteLastElement() {

    const operators = ["+", "-", "*", "/"];
    console.log("number: " + number);
    console.log("display text: " + displayText)
    console.log(equation);
    
    // If we are trying to delete an operator, we need to remove it from the equation
    if (operators.includes(displayText[displayText.length - 1])) {  // Deleting a sign
        equation.pop();
    } else { // Deleting a number
        
        // Check to see if the number matches with the last element in the equation
        if (equation[equation.length - 1] == number) {

            number = number.slice(0, number.length - 1);
            
            // Update equation array
            if (number === "") {
                equation.pop();
            } else {
                equation[equation.length - 1] = parseInt(number);
            }

        } else { // If the number is not yet in the eqn, just reduce the number
            number = number.slice(0, number.length - 1);
        }
        
        // Set number to old number
        if (number === "" && equation.length > 0) {
            number = oldNumbers.pop();
        } 

        if (equation.length === 0) {
            oldNumbers = [];
        }
  
    }

    console.log("displayText after: " + displayText);
    console.log(typeof(displayText));
    // Delete last element from displayText
    displayText = displayText.slice(0, displayText.length - 1);
    

    console.log("number: " + number);
    console.log("display text: " + displayText)
    console.log(equation);

    const display = document.querySelector(".display");
    display.textContent = displayText;
}

function done(eq) {

    const operators = ["+", "-", "*", "/"];
    for (let i = 0; i < operators.length; i++) {
        if (eq.includes(operators[i])) {
            return false;
        }
    }
    return true;
}

function performStep(operator, eq) {

    const index = eq.indexOf(operator);
    const num1Index = index-1;
    const num2Index = index+1;

    const leftSide = eq.slice(0, num1Index);
    const rightSide = eq.slice(num2Index+1);

    
    const result = operate(eq[index], eq[num1Index], eq[num2Index]);
    console.log("result is: " + result);
    eq = leftSide.concat(result, rightSide);
    
    return eq;
}

function getAllIndexes(arr, val) {

    let indexes = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            indexes.push(i);
        }
    }
    return indexes;
}

function solve(eq) {
    while (!done(eq)) {
        if (eq.includes("/")) {
            eq = performStep("/", eq);
        } else if (eq.includes("*")) {
            eq = performStep("*", eq);
        } else if (eq.includes("+")) {
            eq = performStep("+", eq);
        } else {
            eq = performStep("-", eq);
        }
    }

    return eq;
}

function recursiveSolver(eq) {  // Doesn't solve all the way, just solves until no brackets
    
    // Base - if there's no parentheses, we want to solve.
    if (!eq.includes("(") && !eq.includes(")")) {

        console.log("No parentheses! Solving now ... ");
        // Solve
        return solve(eq);
    }

    // Oh no! There are parentheses. Get the index of outer left and right parentheses
    const leftParenthesis = eq.indexOf("("); 
    const allRightParentheses = getAllIndexes(eq, ")");
    const rightParenthesis = allRightParentheses[allRightParentheses.length - 1]; 

    // Using the indexes of the parentheses, slice the current equation into left, right, middle
    const leftSide = eq.slice(0, leftParenthesis);
    const rightSide = eq.slice(rightParenthesis + 1);
    const middle = eq.slice(leftParenthesis + 1, rightParenthesis);  // What's inside the brackets

    // Our new equation is the left side + the solved middle + right side
    let newEq =  leftSide.concat(recursiveSolver(middle), rightSide); 

    // Now we have the new equation (after getting rid of brackets), but now we have to solve it then return
    return solve(newEq);
}

function calculateResult() {

    // Add the number before "=" to the equaton (if there even is a number)
    if (number !== "") {
        equation.push(parseInt(number));
        number = "";
        console.log(equation);
    }

    // Solve the parenthesese
    equation = recursiveSolver(equation);
    
    const result = equation[0];  // equation should only have 1 value in it
    displayText = `${result}`;
    number = `${result}`; // Make the number the result in case of further calculations
    const display = document.querySelector(".display");
    display.textContent = displayText;
    equation.pop(); // Clear the equation array
}



// 3*8/2+5-9/3 - mine: 14, linux: 14

// 3+5*10/2+9 - mine: 37, linux: 37

// 10/5+9-3*6 - mine; -7, linux: -7