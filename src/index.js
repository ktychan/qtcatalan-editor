import "./styles.css";
import { make_path } from "./dyck.js";
import $ from "jquery";
// import data from "./data.js";
// console.log(JSON.stringify(data));

let app = $("#app");
var urlParams = new URLSearchParams(window.location.search);
let n = urlParams.get('n');
$(`#n${n}`).addClass('active-n');

// deal with keyup events
window.addEventListener("keypress", (event) => {
  let selected = $(".active");

  if (selected.length === 0) {
    console.log("nothing is selected. ignore keyup event.");
    return;
  }

  let selected_element = selected[0];
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

    app.append(container);
  } else if (key === "q" && parent.children.length > 1) {
    parent.removeChild(selected_element);
    parent.insertBefore(selected_element, parent.children[0]);
  } else if (key === "e") {
    parent.removeChild(selected_element);
    parent.appendChild(selected_element);
  } else if (key === "k") {
    let parentSibling = parent.previousSibling;
    if (parentSibling !== null) {
      let app0 = app.get(0);
      app0.removeChild(parent);
      app0.insertBefore(parent, parentSibling);
    }
  } else if (key === "j") {
    let parentSibling = parent.nextSibling;
    if (parentSibling !== null) {
      let app0 = app.get(0);
      app0.removeChild(parent);
      app0.insertBefore(parent, parentSibling.nextSibling);
    }
  }
});

document.getElementById("filter-button").onclick = () => {
  let input = document.getElementById("filter-input");
  if (input.value !== null) {
    let value = Number(input.value);
    for (let container of app.children()) {
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

document.getElementById("show-everything-button").onclick = () => {
  for (let container of app.children()) {
    let chain = [];
    for (let element of $(container).children()) {
      element.style.display = "block";
    }
  }
};

document.getElementById("save-button").onclick = () => {
  $.ajax({
    url: "https://api.jsonbin.io/b/5f6816637243cd7e82405f1b/latest",
    method: "GET",
  }).done(data => {
    let chains = [];
    for (let container of app.children()) {
      let chain = [];
      for (let element of container.children) {
        chain.push(element.data);
      }
      chains.push(chain);
    }

    data[n] = chains;
    $("#save-status").html("Saving...");
    $.ajax({
      url: "https://api.jsonbin.io/b/5f6816637243cd7e82405f1b", 
      method: "PUT",
      crossDomain: true,
      contentType: "application/json",
      data: JSON.stringify(data),
    })
    .done((data, textStatus) => {
      $("#save-status").html("Saved");
    })
    .fail((err, textStatus) => {
      $("#save-status").html("Failed :(");
      console.log(err);
      console.log(textStatus);
    })
  })
};

document.getElementById("save-status").onclick = () => {
  $("#save-status").html("");
};

document.getElementById("sage-button").onclick = () => {
  let output = "chains = [\n";
  for (let container of app.children()) {
    output += "  [\n";
    for (let element of container.children) {
      output += `    DyckWord([${element.data[0]}]),\n`;
    }
    output += "  ],\n"
  }
  output += "]";

  $("#sage-code").val(output);
  $("#sage-code").get(0).select();
  document.execCommand("copy");
  $("#sage-status").html("Sage code saved to clip board.");
};

document.getElementById("sage-status").onclick = () => {
  $("#sage-status").html("");
};

// mouse click callback
let handle_click = (element) => {

  if ($('.active').length > 0) {
    let something_new = $(".active")[0] != $(element)[0];

    $('.active').removeClass("active");
    if (something_new) {
      $(element).addClass("active");
    }
  } else {
    $(element).addClass("active");
  }
};

// populate app
$.ajax({
  url: "https://api.jsonbin.io/b/5f6816637243cd7e82405f1b/latest",
  method: "GET",
}).done((data, textStatus, jqXHR) => {
  let chains = data[n];
  for (let chain of chains) {
    let container = document.createElement("div");
    container.className = "chain";

    // populate the chain
    for (let path of chain) {
      container.appendChild(make_path(path, handle_click, 20));
    }
    app.append(container);
  }
});