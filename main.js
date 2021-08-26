let localStorageValues = localStorage.todoItems
  ? JSON.parse(localStorage.getItem("todoItems"))
  : [];

let addToLocalStorage = () => {
  let inputBoxValue = document.getElementById("input").value;
  if (inputBoxValue.length > 0) {
    localStorageValues.push(inputBoxValue);
    localStorage.setItem("todoItems", JSON.stringify(localStorageValues));
  }

  renderTodoItems();
};

let randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
let items;
let displayContainer = document.getElementById("display-box");

let renderTodoItems = () => {
  while (displayContainer.firstChild) {
    displayContainer.firstChild.remove();
  }
  document.getElementById("input").value = "";
  if (localStorageValues.length === 0) {
    fetch("https://type.fit/api/quotes")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let quote = data[randomInteger(0, data.length - 1)];
        let text = document.createElement("span");
        text.className = "quoteText";
        text.innerHTML = `"${quote.text}"`;
        let author = document.createElement("span");
        author.className = "quoteAuthor";
        author.innerHTML = `-${quote.author}`;
        displayContainer.appendChild(text);
        displayContainer.appendChild(author);
      });
  } else {
    localStorageValues.forEach((todoItem, index) => {
      let todoItemDiv = document.createElement("div");
      todoItemDiv.className = "items";
      todoItemDiv.draggable = "true";
      let itemText = document.createElement("span");
      itemText.className = "itemText";
      itemText.innerHTML = todoItem;
      let closeIcon = document.createElement("i");
      closeIcon.className = "fa fa-close";
      closeIcon.addEventListener("click", removeFromLocalStorage);
      closeIcon.style = "font-size:40px;color:red";
      closeIcon.id = index;
      todoItemDiv.appendChild(closeIcon);
      todoItemDiv.appendChild(itemText);
      displayContainer.appendChild(todoItemDiv);
      items = document.querySelectorAll(".items");
    });
    items.forEach((item) => {
      item.addEventListener("dragstart", () => {
        item.classList.add("dragging");
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        let elements = [...document.querySelectorAll(".itemText")];
        localStorageValues = elements.map((val) => val.innerHTML);
        localStorage.setItem("todoItems", JSON.stringify(localStorageValues));
      });
    });
  }
};

let removeFromLocalStorage = (event) => {
  localStorageValues.splice(event.target.id, 1);
  localStorage.setItem("todoItems", JSON.stringify(localStorageValues));
  renderTodoItems();
};

renderTodoItems();

displayContainer.addEventListener("dragover", (event) => {
  event.preventDefault();
  const afterElement = getDragAfterElement(displayContainer, event.clientY);
  const draggable = document.querySelector(".dragging");
  if (draggable) {
    if (!afterElement) {
      displayContainer.appendChild(draggable);
    } else {
      displayContainer.insertBefore(draggable, afterElement);
    }
  }
});

let getDragAfterElement = (container, y) => {
  const draggableElements = [
    ...container.querySelectorAll(".items:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};
