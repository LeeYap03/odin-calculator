const buttonGrid = document.querySelector("#button-grid");
const displayTop = document.querySelector("#display-top");

buttonGrid.addEventListener("click", (event) => {
  // Make sure user is clicking a button within the buttonGrid
  const isButton = event.target.nodeName === "BUTTON";

  if (!isButton) return;

  // Get button id
  const buttonID = event.target.id;
  handleClick(buttonID);
});

function handleClick(id) {
  switch (id) {
    case "btn-clr":
      displayTop.textContent = "";
      break;
    case "btn-del":
      displayTop.textContent = displayTop.textContent.slice(0, -1);
      break;
    case "btn-eql":
      console.log("Calculate result");
      break;
    case "btn-add":
      displayTop.textContent += "+";
      break;
    case "btn-subt":
      displayTop.textContent += "-";
      break;
    case "btn-mult":
      displayTop.textContent += "";
      break;
    case "btn-div":
      displayTop.textContent += "";
      break;
    case "btn-pwr":
      displayTop.textContent += "^";
      break;
    case "btn-dcml":
      displayTop.textContent += ".";
      break;
    default:
      const value = id.replace("btn-", "");
      displayTop.textContent += value;
  }
}
