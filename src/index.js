import "./styles.css";
import { make_path } from "./dyck.js";
import $ from "jquery";
$.fn.reverse = [].reverse;

let app = $("#app");
var urlParams = new URLSearchParams(window.location.search);
let n = urlParams.get("n");
$(`#n${n}`).addClass("active-n");

// error checker
function check_chain(chain) {
  if (chain.children.length === 0) {
    return;
  }

  // clear all error classes
  for (let element of chain.children) {
    $(element).removeClass("error");
  }

  // check the first element
  const first = chain.children.item(0);
  let area = first.data[1];
  let dinv = first.data[2];
  if (area > dinv) {
    $(first).addClass("error");
    return;
  }

  // check the rest
  for (let i = 1; i < chain.children.length; i++) {
    area += 1;
    dinv -= 1;

    let element = chain.children.item(i);
    if (element.data[1] != area || element.data[2] != dinv) {
      $(element).addClass("error");
      return;
    }
  }
}

// create a new chain
function create_chain(children) {
  let container = document.createElement("div");
  container.className = "chain";
  container.observer = new MutationObserver((mutationList, observer) => {
    check_chain(container);
  });
  container.observer.observe(container, { childList: true });

  // populate the chain
  for (let path of children) {
    container.appendChild(
      make_path(path, (element) => $(element).toggleClass("active"))
    );
  }

  return container;
}

// disable spacebar scrolling when things are selected.
document.addEventListener("keydown", (event) => {
  if (
    $(".active").length > 0 &&
    event.code === "Space" &&
    event.target === document.body
  ) {
    event.preventDefault();
  }
});

// pressing space bar clears selections.
document.addEventListener("keyup", (event) => {
  if (event.code === "Space" && event.target === document.body) {
    $(".active").each((index, element) => {
      $(element).removeClass("active");
    });
  }
});

// deal with keypress events
window.addEventListener("keypress", (event) => {
  const key = event.key;
  if ("wasdqejkWS".indexOf(key) < 0) {
    console.log(key + " is ignored.");
    return;
  }

  $(".active")
    .parent()
    .each((i, parent) => {
      const active = $(parent).find(".active");
      if (key === "a") {
        active.each((j, element) => {
          if (key === "a") {
            let sibling = element.previousSibling;
            if (sibling !== null) {
              parent.removeChild(element);
              parent.insertBefore(element, sibling);
            } else {
              return false;
            }
          }
        });
      } else if (key === "d") {
        active.reverse().each((i, element) => {
          let sibling = element.nextSibling;
          if (sibling !== null) {
            parent.removeChild(element);
            parent.insertBefore(element, sibling.nextSibling);
          } else {
            return false;
          }
        });
      } else if (key === "w" && parent.previousSibling !== null) {
        active.each((j, element) => {
          parent.removeChild(element);
          parent.previousSibling.appendChild(element);
        });
      } else if (
        key === "w" &&
        parent.previousSibling === null &&
        parent.children.length > active.length
      ) {
        let container = create_chain([]);
        let app0 = app.get(0);
        app0.insertBefore(container, parent);
        active.each((j, element) => {
          parent.removeChild(element);
          parent.previousSibling.appendChild(element);
        });
      } else if (key === "s" && parent.nextSibling !== null) {
        active.each((j, element) => {
          parent.removeChild(element);
          parent.nextSibling.appendChild(element);
        });
      } else if (
        key === "s" &&
        parent.nextSibling === null &&
        parent.children.length > active.length
      ) {
        let container = create_chain([]);
        app.append(container);
        active.each((j, element) => {
          parent.removeChild(element);
          parent.nextSibling.appendChild(element);
        });
      } else if (key === "q" && parent.children.length > 1) {
        active.reverse().each((j, element) => {
          parent.removeChild(element);
          parent.insertBefore(element, parent.children[0]);
        });
      } else if (key === "e") {
        active.each((j, element) => {
          parent.removeChild(element);
          parent.appendChild(element);
        });
      } else if (key === "W" && parent.children.length > active.length) {
        let container = create_chain([]);
        let app0 = app.get(0);
        app0.insertBefore(container, parent);
        active.each((j, element) => {
          parent.removeChild(element);
          parent.previousSibling.appendChild(element);
        });
      } else if (key === "S" && parent.children.length > active.length) {
        let container = create_chain([]);
        let app0 = app.get(0);
        app0.insertBefore(container, parent.nextSibling);
        active.each((j, element) => {
          parent.removeChild(element);
          parent.nextSibling.appendChild(element);
        });
      }
    });

  // deal with jk.
  if (key === "j") {
    $(".active")
      .parent()
      .reverse()
      .each((i, parent) => {
        let parentSibling = parent.nextSibling;
        if (parentSibling !== null) {
          let app0 = app.get(0); // get the DOM from jquery wrapper
          app0.removeChild(parent);
          app0.insertBefore(parent, parentSibling.nextSibling);
        } else {
          return false;
        }
      });
  } else if (key === "k") {
    $(".active")
      .parent()
      .each((i, parent) => {
        let parentSibling = parent.previousSibling;
        if (parentSibling !== null) {
          let app0 = app.get(0); // get the DOM from jquery wrapper
          app0.removeChild(parent);
          app0.insertBefore(parent, parentSibling);
        } else {
          return false;
        }
      });
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
  $("#status").html("Download data...");
  $.ajax({
    url: "https://api.jsonbin.io/b/5f6816637243cd7e82405f1b/latest",
    method: "GET",
  }).done((data) => {
    let chains = [];
    for (let container of app.children()) {
      let chain = [];
      for (let element of container.children) {
        chain.push(element.data);
      }
      chains.push(chain);
    }

    data[n] = chains;
    $("#status").html("Uploading...");
    $.ajax({
      url: "https://api.jsonbin.io/b/5f6816637243cd7e82405f1b",
      method: "PUT",
      crossDomain: true,
      contentType: "application/json",
      data: JSON.stringify(data),
    })
      .done((data, textStatus) => {
        $("#status").html("Saved");
      })
      .fail((err, textStatus) => {
        $("#status").html("Failed :(");
        console.log(err);
        console.log(textStatus);
      });
  });
};

document.getElementById("status").onclick = () => {
  $("#status").html("");
};

document.getElementById("sage-button").onclick = () => {
  let output = "chains = [\n";
  for (let container of app.children()) {
    output += "  [\n";
    for (let element of container.children) {
      output += `    DyckWord([${element.data[0]}]),\n`;
    }
    output += "  ],\n";
  }
  output += "]";

  // sage-output must be visible.
  $("#sage-code").css("display", "block");
  $("#sage-code").val(output);
  $("#sage-code").get(0).select();
  document.execCommand("copy");
  $("#sage-code").css("display", "none");
  $("#status").html("Sage code saved to clip board.");
};

document.getElementById("next-error-button").onclick = () => {
  let element = $(".error")[0];
  if (element) {
    $(element).attr("tabindex", -1);
    $(element).trigger("focus");
  } else {
    $("#status").html("Yaaaaay! No error.");
  }
};

// populate app
$.ajax({
  url: "https://api.jsonbin.io/b/5f6816637243cd7e82405f1b/latest",
  method: "GET",
}).done((data, textStatus, jqXHR) => {
  let chains = data[n];
  for (let chain of chains) {
    app.append(create_chain(chain));
  }
});
