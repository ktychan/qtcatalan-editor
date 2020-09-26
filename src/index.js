import $ from "jquery";
import * as firebase from "firebase/app";
import "firebase/database";

import { make_path } from "./dyck.js";
import "./styles.css";

// configure firebase
firebase.initializeApp({
  apiKey: "AIzaSyCM-f_pFQIBsCzO7T5QFvo4_w_BrjPqjgM",
  authDomain: "qtcatalan.firebaseapp.com",
  databaseURL: "https://qtcatalan.firebaseio.com",
  projectId: "qtcatalan",
  storageBucket: "qtcatalan.appspot.com",
  messagingSenderId: "412480664766",
  appId: "1:412480664766:web:325fded35f4b5cb3309aef",
});

$.fn.reverse = [].reverse;

const n = new URLSearchParams(window.location.search).get("n");
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
  const container = $(`<div class="chain"></div>`);
  container.each((index, element) => {
    new MutationObserver((mutationList, observer) => {
      check_chain(element);
    }).observe(element, { childList: true });
  });

  // populate the chain
  for (let path of children) {
    let element = make_path(path);
    element.on("click", () => $(element).toggleClass("active"));
    element.on("dblclick", () => {
      const href = location.href.split("#")[0];
      const url = `${href}#${element.attr("id")}`;

      $("#sage-code").css("display", "block");
      $("#sage-code").val(url);
      $("#sage-code").get(0).select();
      document.execCommand("copy");
      $("#sage-code").css("display", "none");
      $("#status").html(`<code>${url}</code> copied to clipboard.`);
    });
    container.append(element);
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
  if ("wasdqejkWSJK".indexOf(key) < 0) {
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
        if ($(parent).children().length === 0) {
          $(parent).remove();
        }
      } else if (
        key === "w" &&
        parent.previousSibling === null &&
        parent.children.length > active.length
      ) {
        let container = create_chain([]);
        let app0 = $("#app").get(0);
        app0.insertBefore(container, parent);
        active.each((j, element) => {
          parent.removeChild(element);
          parent.previousSibling.appendChild(element);
        });
        if ($(parent).children().length === 0) {
          $(parent).remove();
        }
      } else if (key === "s" && parent.nextSibling !== null) {
        active.each((j, element) => {
          parent.removeChild(element);
          parent.nextSibling.appendChild(element);
          if ($(parent).children().length === 0) {
            $(parent).remove();
          }
        });
      } else if (
        key === "s" &&
        parent.nextSibling === null &&
        parent.children.length > active.length
      ) {
        let container = create_chain([]);
        $("#app").append(container);
        active.each((j, element) => {
          parent.removeChild(element);
          parent.nextSibling.appendChild(element);
        });
        if ($(parent).children().length === 0) {
          $(parent).remove();
        }
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
        $(parent).before(create_chain([]));
        active.each((j, element) => {
          parent.removeChild(element);
          parent.previousSibling.appendChild(element);
        });
      } else if (key === "S" && parent.children.length > active.length) {
        $(parent).after(create_chain([]));
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
          let app0 = $("#app").get(0); // get the DOM from jquery wrapper
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
          let app0 = $("#app").get(0); // get the DOM from jquery wrapper
          app0.removeChild(parent);
          app0.insertBefore(parent, parentSibling);
        } else {
          return false;
        }
      });
  } else if (key === "J") {
    $(".active")
      .parent()
      .each((i, parent) => {
        let a = $(parent).find(".active:first");
        console.log(a);
      });
  } else if (key === "K") {
    $(".active")
      .parent()
      .each((i, parent) => {});
  }
});

$("#filter-button").on("click", () => {
  const degree = $("#filter-input").val();
  $(`.dyck-container:not(.degree-${degree}`).hide();
  $(`.degree-${degree}`).show();
});

$("#show-everything-button").on("click", () => {
  console.log("hello");
  $(".dyck-container").css("display", "block");
});

$("#save-button").on("click", () => {
  $("#status").html("Uploading...");
  let chains = [];
  for (let container of $("#app").children()) {
    let chain = [];
    for (let element of container.children) {
      chain.push(element.data);
    }

    if (chain.length > 0) {
      chains.push(chain);
    }
  }

  firebase
    .database()
    .ref(`/current/${n}`)
    .set(chains, (err) => {
      $("#status").html(err ? "Failed to save." : "Saved.");
    });
});

$("#status").on("click", () => $("#status").html(""));

$("#sage-button").on("click", () => {
  let output = "chains = [\n";
  for (let container of $("#app").children()) {
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
});

$("#next-error-button").on("click", () => {
  if ($(".error").length == 0) {
    $("#status").html("Yaaaaaaay! No error!");
  } else {
    const element = $(".error").first();
    element.attr("tabindex", -1);
    element.trigger("focus");
    element.removeAttr("tabindex");
  }
});

firebase
  .database()
  .ref(`/current/${n}`)
  .once("value")
  .then((snapshot) => {
    if (snapshot.val()) {
      for (let chain of snapshot.val()) {
        // we shouldn't have empty arrays in there.
        // but we'll check just to be sure.
        if (!chain) {
          continue;
        }

        $("#app").append(create_chain(chain));
      }

      const pathid = location.href.split("#")[1];
      if (pathid) {
        let element = $(`#${pathid}`)
        element.addClass("active");
        element.attr("tabindex", -1);
        element.trigger("focus");
        element.removeAttr("tabindex");
      }
    }
  });
