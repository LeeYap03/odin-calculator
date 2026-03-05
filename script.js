const buttonGrid = document.querySelector("#button-grid");
const inputArea = document.querySelector("#display-top");
const outputArea = document.querySelector("#display-bottom");

buttonGrid.addEventListener("click", (event) => {
  // Make sure user is clicking a button within the buttonGrid
  const isButton = event.target.nodeName === "BUTTON";

  if (!isButton) return;

  // Get button id
  const buttonID = event.target.id;
  handleClick(buttonID);
});

// Handle inputs
function handleClick(id) {
  switch (id) {
    case "btn-clr":
      inputArea.textContent = "";
      break;
    case "btn-del":
      inputArea.textContent = inputArea.textContent.slice(0, -1);
      break;
    case "btn-eql":
      const tokens = tokenize();
      const postfixTokens = toPostfix(tokens);
      const answer = calculate(postfixTokens);

      outputArea.textContent = answer;
      break;
    case "btn-add":
      inputArea.textContent += "+";
      break;
    case "btn-subt":
      inputArea.textContent += "-";
      break;
    case "btn-mult":
      inputArea.textContent += "*";
      break;
    case "btn-div":
      inputArea.textContent += "/";
      break;
    case "btn-pwr":
      inputArea.textContent += "\^";
      break;
    case "btn-dcml":
      inputArea.textContent += ".";
      break;
    default:
      const value = id.replace("btn-", "");
      inputArea.textContent += value;
  }
}

// Tokenize input to be an array of numbers and operators
function tokenize() {
  const input = inputArea.textContent.replace(/\s+/g, "");
  let tokens = [];

  for (i = 0; i < input.length; i++) {
    let char = input[i];
    let prevToken = tokens[tokens.length - 1];

    let isNumber = /[0-9\.]/.test(char);
    let isOperator = "+-*/^".includes(char);
    let isNegativeSign =
      char == "-" && (!prevToken || "+-/*^".includes(prevToken));

    if (tokens.length === 0 && isOperator && !isNegativeSign) {
      outputArea.textContent = "Syntax error!";
      throw new Error(`Syntax Error: Cannot start with '${char}' operator`);
    }

    if (isNumber || isNegativeSign) {
      let num = char;
      if (char === ".") {
        // If num starts with decimal point
        num = "0.";
      }
      let hasDecimal = char === ".";

      // While the next char is a number
      while (i + 1 < input.length && /[0-9\.]/.test(input[i + 1])) {
        nextChar = input[++i];

        if (nextChar === ".") {
          if (hasDecimal) {
            outputArea.textContent = "Syntax error!";
            throw new Error("Syntax Error: Multiple decimal points");
          }
          hasDecimal = true;
        }

        num += nextChar;
      }
      tokens.push(num);
    } else if (isOperator) {
      if (prevToken && "+-/*^".includes(prevToken)) {
        outputArea.textContent = "Syntax error!";
        throw new Error(`Syntax Error: '${prevToken}${char}'`);
      }
      tokens.push(char);
    }
  }
  // Check if last token is an operator
  if ("+-*/^".includes(tokens[tokens.length - 1])) {
    outputArea.textContent = "Incomplete Expression";
    throw new Error("Incomplete expression");
  }

  return tokens;
}

function toPostfix(tokens) {
  const output = [];
  const stack = [];
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
  };

  for (const token of tokens) {
    if (!isNaN(token)) {
      output.push(token);
    }

    // Loop through the operands stack to pop in pemdas order
    if ("+-*/^".includes(token)) {
      while (stack.length > 0) {
        if (precedence[stack[stack.length - 1]] >= precedence[token]) {
          if (token === "^" && precedence[stack[stack.length - 1]] == 3) {
            break;
          }
          output.push(stack.pop());
        } else {
          break;
        }
      }
      stack.push(token);
    }
  }

  // Flush the rest of the operand stack
  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
}

function calculate(postfixTokens) {
  const stack = [];

  for (const token of postfixTokens) {
    if (!isNaN(token)) {
      stack.push(Number(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();

      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
      }
    }
  }

  return stack[0];
}
