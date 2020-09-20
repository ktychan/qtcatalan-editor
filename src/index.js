import "./styles.css";
import { make_path } from "./dyck.js";
import data from "./data";
import chains from "./chains";

let app = document.getElementById("app");
let selected_element = null;
let selected_element_saved_className = null;

// deal with keyup events
window.addEventListener("keypress", (event) => {
  if (selected_element === null) {
    console.log("nothing is selected. ignore keyup event.");
    return;
  }

  const key = event.key;
  if ("wasdqejk".indexOf(key) < 0) {
    console.log(key + " is ignored.");
    return;
  }

  let parent = selected_element.parentNode;
  if (key === "a") {
    let sibling = selected_element.previousSibling;
    if (sibling !== null) {
      parent.removeChild(selected_element);
      parent.insertBefore(selected_element, sibling);
    }
  } else if (key === "d") {
    let sibling = selected_element.nextSibling;
    if (sibling !== null) {
      parent.removeChild(selected_element);
      parent.insertBefore(selected_element, sibling.nextSibling);
    }
  } else if (key === "w" && parent.previousSibling !== null) {
    parent.removeChild(selected_element);
    parent.previousSibling.appendChild(selected_element);
  } else if (key === "s" && parent.children.length == 1) {
    return;
  } else if (key === "s" && parent.nextSibling !== null) {
    parent.removeChild(selected_element);
    parent.nextSibling.appendChild(selected_element);
  } else if (key === "s" && parent.nextSibling === null) {
    parent.removeChild(selected_element);

    let container = document.createElement("div");
    container.className = "chain";
    container.appendChild(selected_element);

    app.appendChild(container);
  } else if (key === "q" && parent.children.length > 1) {
    parent.removeChild(selected_element);
    parent.insertBefore(selected_element, parent.children[0]);
  } else if (key === "e") {
    parent.removeChild(selected_element);
    parent.appendChild(selected_element);
  } else if (key === "k") {
    let parentSibling = parent.previousSibling;
    if (parentSibling !== null) {
      app.removeChild(parent);
      app.insertBefore(parent, parentSibling);
    }
  } else if (key === "j") {
    let parentSibling = parent.nextSibling;
    if (parentSibling !== null) {
      app.removeChild(parent);
      app.insertBefore(parent, parentSibling.nextSibling);
    }
  }
});

// setup callbacks
let handle_click = (element) => {
  let something_new = element !== selected_element;

  // deselect
  if (selected_element !== null) {
    selected_element.className = selected_element_saved_className;

    selected_element = null;
    selected_element_saved_className = null;
  }

  // select
  if (something_new) {
    selected_element = element;
    selected_element_saved_className = element.className;

    selected_element.className += " active";
    //console.log(element.data);
  }
};

document.getElementById("export-button").onclick = () => {
  let chains = [];
  for (let container of app.children) {
    let chain = [];
    for (let element of container.children) {
      chain.push(element.data);
    }
    chains.push(chain);
  }

  document.getElementById("export-data").innerText = "export default " + JSON.stringify(chains) + ";";
};

document.getElementById("filter-button").onclick = () => {
  let input = document.getElementById("filter-input");
  if (input.value !== null) {
    let value = Number(input.value);
    for (let container of app.children) {
      let chain = [];
      for (let element of container.children) {
        if (element.data[1] + element.data[2] !== value) {
          element.style.display = "none";
        } else {
          element.style.display = "block";
        }
      }
    }
  }
};

document.getElementById("clear-button").onclick = () => {
  for (let container of app.children) {
    let chain = [];
    for (let element of container.children) {
      element.style.display = "block";
    }
  }
};

// populate app
let n = 6;
for (let paths of chains || data[n]) {
  let container = document.createElement("div");
  container.className = "chain";

  // populate the chain
  for (let path of paths) {
    container.appendChild(make_path(path, handle_click, 20));
  }
  app.appendChild(container);
}
