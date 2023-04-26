// ==UserScript==
// @name        Stash Alphabet Selector
// @namespace   https://github.com/elkorol/Stash-User-scripts
// @description Adds alpha numberic keyboard selector to Scenes | Galleries | Performers | Studios
// @version     0.1.0
// @author      Echoman
// @match       http://localhost:9999/*
// @grant       unsafeWindow
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @require     https://raw.githubusercontent.com/elkorol/Stash-User-scripts/develop/src\StashUserscriptLibrary.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(`
#tag-alpha-pagination {
  flex-wrap: wrap;
  padding: inherit;
  margin-top: 0px;
  margin-left: .5rem !important;
  margin-bottom: .5rem !important;
}
.hide {
    display: none;
}
.unhide {
display: flex;
}
`);
  const {
    stash,
    Stash,
    waitForElementId,
    waitForElementClass,
    waitForElementByXpath,
    getElementByXpath,
    getClosestAncestor,
    updateTextInput,
  } = unsafeWindow.stash;

  let svg =
    '<svg fill="#fcfcfc" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="svg-inline--fa fa-filter fa-w-16 fa-icon " version="1.1"' +
    ' id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
    ' viewBox="0 0 512 512" xml:space="preserve" stroke="#fcfcfc"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round"' +
    ' stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><g><g><g><path d="M476.132,182.857h-61.187v-32.633c0-24.199-19.687-43.886-43.886-43.886H167.385c-11.79,' +
    "0-21.38-9.591-21.38-21.38 V19.692c0-6.214-5.038-11.253-11.253-11.253s-11.253,5.039-11.253,11.253v65.266c0,24.199,19.687,43.886,43.886,43.886h203.675 c11.789," +
    "0,21.38,9.591,21.38,21.38v32.633H35.868C16.09,182.857,0,198.947,0,218.725v248.967 c0,19.778,16.09,35.868,35.868,35.868h440.264c19.778,0,35.868-16.09,35.868-3" +
    "5.868V218.725 C512,198.947,495.91,182.857,476.132,182.857z M489.495,467.692c0,7.368-5.994,13.363-13.363,13.363H35.868 c-7.368,0-13.363-5.994-13.363-13.363V21" +
    '8.725c0-7.368,5.994-13.363,13.363-13.363h440.264c7.368,0,13.363,5.994,13.363,13.363 V467.692z"/> <path d="M79.895,430.418H61.89c-6.215,0-11.253,5.039-11.253,' +
    '11.253s5.038,11.253,11.253,11.253h18.004 c6.215,0,11.253-5.039,11.253-11.253S86.109,430.418,79.895,430.418z"/> <path d="M310.378,430.418h-31.929c-6.215,0-11.' +
    '253,5.039-11.253,11.253s5.038,11.253,11.253,11.253h31.929 c6.215,0,11.253-5.039,11.253-11.253S316.593,430.418,310.378,430.418z"/> <path d="M233.551,430.418h-' +
    '31.929c-6.215,0-11.253,5.039-11.253,11.253s5.038,11.253,11.253,11.253h31.929 c6.215,0,11.253-5.039,11.253-11.253S239.766,430.418,233.551,430.418z"/> <path d=' +
    '"M387.206,430.418h-31.929c-6.215,0-11.253,5.039-11.253,11.253s5.038,11.253,11.253,11.253h31.929 c6.215,0,11.253-5.039,11.253-11.253S393.421,430.418,387.206,4' +
    '30.418z"/> <path d="M156.723,430.418h-31.929c-6.215,0-11.253,5.039-11.253,11.253s5.038,11.253,11.253,11.253h31.929 c6.215,0,11.253-5.039,11.253-11.253S162.93' +
    '8,430.418,156.723,430.418z"/> <path d="M450.11,430.418h-18.004c-6.215,0-11.253,5.039-11.253,11.253s5.038,11.253,11.253,11.253h18.004 c6.215,0,11.253-5.039,11' +
    '.253-11.253S456.325,430.418,450.11,430.418z"/> <path d="M237.229,381.187c-6.215,0-11.253,5.039-11.253,11.253s5.038,11.253,11.253,11.253h31.929 c6.215,0,11.25' +
    '3-5.039,11.253-11.253s-5.038-11.253-11.253-11.253H237.229z"/> <path d="M61.89,403.692h130.44c6.215,0,11.253-5.039,11.253-11.253s-5.038-11.253-11.253-11.253H6' +
    '1.89 c-6.215,0-11.253,5.039-11.253,11.253S55.675,403.692,61.89,403.692z"/> <path d="M314.057,381.187c-6.215,0-11.253,5.039-11.253,11.253s5.038,11.253,11.253,' +
    '11.253h31.929 c6.215,0,11.253-5.039,11.253-11.253s-5.038-11.253-11.253-11.253H314.057z"/> <path d="M434.356,403.692h13.503c6.215,0,11.253-5.039,11.253-11.253' +
    's-5.038-11.253-11.253-11.253h-13.503 c-6.215,0-11.253,5.039-11.253,11.253S428.141,403.692,434.356,403.692z"/> <path d="M61.89,354.462h242.876c6.215,0,11.253-' +
    '5.039,11.253-11.253c0-6.214-5.038-11.253-11.253-11.253H61.89 c-6.215,0-11.253,5.039-11.253,11.253C50.637,349.423,55.675,354.462,61.89,354.462z"/> <path d="M4' +
    "36.607,354.462h9.002c6.215,0,11.253-5.039,11.253-11.253c0-6.214-5.038-11.253-11.253-11.253h-9.002 c-6.215,0-11.253,5.039-11.253,11.253C425.354,349.423,430.39" +
    '2,354.462,436.607,354.462z"/> <path d="M368.809,293.978c0-6.214-5.038-11.253-11.253-11.253H61.89c-6.215,0-11.253,5.039-11.253,11.253 c0,6.214,5.038,11.253,11' +
    '.253,11.253h295.666C363.771,305.231,368.809,300.192,368.809,293.978z"/> <path d="M438.857,305.231h4.501c6.215,0,11.253-5.039,11.253-11.253c0-6.214-5.038-11.2' +
    '53-11.253-11.253h-4.501 c-6.215,0-11.253,5.039-11.253,11.253C427.604,300.192,432.642,305.231,438.857,305.231z"/> <path d="M450.11,233.495H61.89c-6.215,0-11.2' +
    '53,5.039-11.253,11.253c0,6.214,5.038,11.253,11.253,11.253h388.22 c6.215,0,11.253-5.039,11.253-11.253C461.363,238.534,456.325,233.495,450.11,233.495z"/></g></' +
    "g></g></g></svg>";

  async function run() {
    await waitForElementByXpath(
      "//span[contains(@class, 'filter-container text-muted paginationIndex center-text')]",
      function (xpath, el) {
        if (!document.getElementById("tag-alpha")) {
          if (!document.getElementById("tag-alpha-button")) {
            const container = document.createElement("div");
            container.setAttribute("id", "tag-alpha-button");
            container.setAttribute("class", "mr-2 mb-2");

            const svg_button = document.createElement("button");
            svg_button.setAttribute("class", "btn btn-secondary");
            svg_button.setAttribute("id", "svg-button");

            container.appendChild(svg_button);
            const toolbar = document
              .querySelector(".btn-toolbar")
              .querySelector(".btn-group");
            toolbar.after(container);
            document.getElementById("svg-button").innerHTML = svg;
          }

          const container = document.createElement("div");
          container.setAttribute(
            "class",
            "tag-alpha filter-container pagination btn-group hide"
          );
          container.setAttribute("id", "tag-alpha");
          const alphabet = "abcdefghijklmnopqrstuvwxyz";
          const number = "#";
          const baseUrl = window.location.href.toString();
          const modeButtons = {
            name: document.createElement("button"),
            aliases: document.createElement("button"),
          };
          modeButtons.name.innerText = "Name";
          modeButtons.aliases.innerText = "Aliases";
          modeButtons.name.setAttribute("class", "btn-alpha btn btn-secondary");
          modeButtons.aliases.setAttribute(
            "class",
            "btn-alpha btn btn-secondary"
          );
          const filter_container =
            document.querySelectorAll(".paginationIndex");
          filter_container[0].before(container);

          // Match for later active Status of keyboard (Regex used later too)
          const regex = /c=([^&]*)/g;
          const reg_1 =
            /(\(%22type%22:%22name%22,%22value%22:%22%5E.*?%22modifier%22:%22MATCHES_REGEX%22\))/;
          const reg_2 =
            /(\(%22type%22:%22aliases%22,%22value%22:%22%5E.*?%22modifier%22:%22MATCHES_REGEX%22\))/;

          if (baseUrl.trim().match(reg_1) || baseUrl.trim().match(reg_2)) {
            container.classList.remove("hide");
            container.classList.add("unhide");
          }

          for (const letter of alphabet) {
            const letterButton = {
              [letter]: document.createElement("button"),
            };
            letterButton[letter].setAttribute(
              "class",
              "tag-letter btn btn-secondary"
            );
            const letteridtext = "letter-" + letter.toUpperCase();
            letterButton[letter].setAttribute("id", letteridtext);
            letterButton[letter].innerText = letter;
            container.appendChild(letterButton[letter]);
            letterButton[letter].addEventListener("click", function () {
              window.location.href = this.getAttribute("href");
            });
          }
          const numberButton = document.createElement("button");
          numberButton.setAttribute("class", "tag-letter btn btn-secondary");
          numberButton.innerText = number;

          function letters() {
            const baseUrl = window.location.href.toString();
            let href_add = "";
            const match_multiple_arguments = baseUrl.trim().match(regex);
            if (
              match_multiple_arguments !== null &&
              match_multiple_arguments !== undefined
            ) {
              match_multiple_arguments.forEach(function (match) {
                if (!match.match(reg_1) && !match.trim().match(reg_2)) {
                  href_add += match + "&";
                }
              });
            }

            const base_url = baseUrl
              .trim()
              .match(/^(?:(?:http|https):\/\/.*\d)(\/.*\?)/)[1];
            const sort = baseUrl.trim().match(/sortby=.*/);
            for (const letter of alphabet) {
              const letterButton = "letter-" + letter.toUpperCase();
              const letterid = document.getElementById(letterButton);
              const reg_1 =
                "(?:(%22type%22:%22name%22,%22value%22:%22%5E)(" +
                letter.toLowerCase() +
                ".*)(?:.*?%22modifier%22:%22MATCHES_REGEX%22))";
              const reg_2 =
                "(?:(%22type%22:%22aliases%22,%22value%22:%22%5E)(" +
                letter.toLowerCase() +
                ".*)(?:.*?%22modifier%22:%22MATCHES_REGEX%22))";
              if (baseUrl.trim().match(reg_1) || baseUrl.trim().match(reg_2)) {
                letterid.classList.add("active");
              }
              let href = "";
              href += base_url;
              if (
                !modeButtons.name.classList.contains("active") &&
                !modeButtons.aliases.classList.contains("active")
              ) {
              }
              if (
                modeButtons.name.classList.contains("active") &&
                !modeButtons.aliases.classList.contains("active")
              ) {
                href +=
                  'c=("type":"name","value":"%5E' +
                  letter.toLowerCase() +
                  ".*%7C%5E" +
                  letter.toUpperCase() +
                  '.*","modifier":"MATCHES_REGEX")&';
              }
              if (
                !modeButtons.name.classList.contains("active") &&
                modeButtons.aliases.classList.contains("active")
              ) {
                href +=
                  'c=("type":"aliases","value":"%5E' +
                  letter.toLowerCase() +
                  ".*%7C%5E" +
                  letter.toUpperCase() +
                  '.*","modifier":"MATCHES_REGEX")&';
              }
              if (
                modeButtons.name.classList.contains("active") &&
                modeButtons.aliases.classList.contains("active")
              ) {
                href +=
                  'c=("type":"name","value":"%5E' +
                  letter.toLowerCase() +
                  ".*%7C%5E" +
                  letter.toUpperCase() +
                  '.*","modifier":"MATCHES_REGEX")&';
                href +=
                  'c=("type":"aliases","value":"%5E' +
                  letter.toLowerCase() +
                  ".*%7C%5E" +
                  letter.toUpperCase() +
                  '.*","modifier":"MATCHES_REGEX")&';
              }
              if (href_add !== undefined && !null) {
                href += href_add;
              }
              href += sort;
              letterid.setAttribute("href", href);
            }

            let href = "";
            href += base_url;
            if (
              modeButtons.name.classList.contains("active") &&
              !modeButtons.aliases.classList.contains("active")
            ) {
              href +=
                'c=("type":"name","value":"%5E%5C%5Cd","modifier":"MATCHES_REGEX")&';
            }
            if (
              !modeButtons.name.classList.contains("active") &&
              modeButtons.aliases.classList.contains("active")
            ) {
              href +=
                'c=("type":"aliases","value":"%5E%5C%5Cd","modifier":"MATCHES_REGEX")&';
            }
            if (
              modeButtons.name.classList.contains("active") &&
              modeButtons.aliases.classList.contains("active")
            ) {
              href +=
                'c=("type":"name","value":"%5E%5C%5Cd","modifier":"MATCHES_REGEX")&';
              href +=
                'c=("type":"aliases","value":"%5E%5C%5Cd","modifier":"MATCHES_REGEX")&';
            }
            if (href_add !== undefined && !null) {
              href += href_add;
            }
            href += sort;

            numberButton.setAttribute("href", href);
            numberButton.addEventListener("click", function () {
              window.location.href = this.getAttribute("href");
            });
          }
          // If Aliases or Name in URL Set Class to active
          const svg_button = document.getElementById("svg-button");
          const regex_1 =
            "((%22type%22:%22name%22).*?%22modifier%22:%22MATCHES_REGEX%22)";
          const regex_2 =
            "((%22type%22:%22aliases%22).*?%22modifier%22:%22MATCHES_REGEX%22)";
          const regex_num = "%22value%22:%22%5E%5C%5Cd%22";

          if (baseUrl.trim().match(regex_1)) {
            modeButtons.name.classList.add("active");
          }
          if (baseUrl.trim().match(regex_2)) {
            modeButtons.aliases.classList.add("active");
          }
          if (baseUrl.trim().match(regex_1) || baseUrl.trim().match(regex_2)) {
            svg_button.classList.add("active");
          }
          if (baseUrl.trim().match(regex_num)) {
            numberButton.classList.add("active");
          }

          container.prepend(numberButton);
          container.prepend(modeButtons.name);
          container.prepend(modeButtons.aliases);
          const lettersButtons = document.querySelectorAll(".tag-letter");

          function checkActiveButtons() {
            if (
              !modeButtons.name.classList.contains("active") &&
              !modeButtons.aliases.classList.contains("active")
            ) {
              lettersButtons.forEach((button) =>
                button.setAttribute("disabled", true)
              );
            } else {
              lettersButtons.forEach((button) =>
                button.removeAttribute("disabled")
              );
            }
          }

          modeButtons.name.addEventListener("click", function () {
            modeButtons.name.classList.toggle("active");
            checkActiveButtons();
            letters();
          });

          modeButtons.aliases.addEventListener("click", function () {
            modeButtons.aliases.classList.toggle("active");
            checkActiveButtons();
            letters();
          });

          const svg_b = document.getElementById("svg-button");

          function toggleKeyboard() {
            if (svg_b.classList.contains("active")) {
              const container = document.getElementById("tag-alpha");
              svg_button.classList.remove("active");
              container.classList.remove("unhide");
              container.classList.add("hide");
            } else {
              svg_button.classList.add("active");
              container.classList.remove("hide");
              container.classList.add("unhide");
              if (
                modeButtons.name.classList !== "active" &&
                modeButtons.aliases.classList !== "active"
              ) {
                modeButtons.name.classList.add("active");
                letters();
                lettersButtons.forEach((button) =>
                  button.removeAttribute("disabled")
                );
              }
            }
          }

          svg_b.addEventListener("click", function () {
            toggleKeyboard();
          });

          const tag_item = document.querySelectorAll(
            ".tag-item.badge.badge-secondary"
          );
          tag_item.forEach(function (element) {
            element.addEventListener("click", function () {
              setTimeout(letters, 500);
            });
          });
          letters();
        }
      }
    );
  }

  stash.addEventListener("page:scenes", function () {
    run();
  });
  stash.addEventListener("page:movies", function () {
    run();
  });
  stash.addEventListener("page:performers", function () {
    run();
  });
  stash.addEventListener("page:studios", function () {
    run();
  });
  stash.addEventListener("page:tags", function () {
    run();
  });
})();
