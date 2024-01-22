// ==UserScript==
// @name        Stash Alphabet Selector
// @namespace   https://github.com/elkorol/Stash-App-Script-Alphabet-Selector
// @description Adds alpha numberic keyboard selector to Scenes | Galleries | Performers | Studios
// @version     0.1.5
// @author      Echoman
// @match       http://localhost:9999/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @require     https://raw.githubusercontent.com/elkorol/elkorol-stash-userscripts/develop/src/StashUserscriptLibrary.js
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
  .hideBTN {
      display: none;
  }
  .showBTN {
  display: flex;
  }
  `);
  const { stash, waitForElementByXpath } = unsafeWindow.stash;
  let [resolvedDomain, storeParams, appliedCharacter, currentMode] = "";
  let modeCounter = 0;
  let previousStep = 0;

  const config1 = {
    a: "Title",
    b: "Path",
  };
  const config2 = {
    a: "Name",
    b: "Aliases",
  };

  let svg = `<svg aria-hidden="true" data-prefix="fas" data-icon="filter" class="svg-inline--fa fa-filter fa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="5 5 14 14"><g fill="currentColor">
    <path d="M7 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM10 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM10 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM13 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM16 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM16 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM19 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM19 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.945 4.25h8.11c1.367 0 2.47 0 3.337.117.9.12 1.658.38 2.26.981.602.602.86 1.36.982 2.26.116.867.116 1.97.116 3.337v2.11c0 1.367 0 2.47-.116 3.337-.122.9-.38 1.658-.982 2.26-.602.602-1.36.86-2.26.982-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116-.9-.122-1.658-.38-2.26-.982-.602-.602-.86-1.36-.981-2.26-.117-.867-.117-1.97-.117-3.337v-2.11c0-1.367 0-2.47.117-3.337.12-.9.38-1.658.981-2.26.602-.602 1.36-.86 2.26-.981.867-.117 1.97-.117 3.337-.117ZM4.808 5.853c-.734.099-1.122.28-1.399.556-.277.277-.457.665-.556 1.4-.101.754-.103 1.756-.103 3.191v2c0 1.435.002 2.437.103 3.192.099.734.28 1.122.556 1.399.277.277.665.457 1.4.556.754.101 1.756.103 3.191.103h8c1.435 0 2.436-.002 3.192-.103.734-.099 1.122-.28 1.399-.556.277-.277.457-.665.556-1.4.101-.754.103-1.756.103-3.191v-2c0-1.435-.002-2.437-.103-3.192-.099-.734-.28-1.122-.556-1.399-.277-.277-.665-.457-1.4-.556-.755-.101-1.756-.103-3.191-.103H8c-1.435 0-2.437.002-3.192.103ZM6.25 16a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75Z"/></g></svg>`;

  function construct(char) {
    let string;
    if (char != "#") {
      string = `(^[${char.toUpperCase()}${char}].*)`;
    } else if (char === "#") {
      string = `^\\\\d`;
    }
    return string;
  }

  function navigate(char, config, btnA, btnB) {
    const isBTNA = btnA.classList.contains("active");
    const isBTNB = btnB.classList.contains("active");
    let mode = construct(char);
    let parameter;

    if (isBTNA && isBTNB) {
      parameter = `?c=("type":"${config.a.toLowerCase()}","value":"${mode}","modifier":"MATCHES_REGEX")&c=("type":"${config.b.toLowerCase()}","value":"${mode}","modifier":"MATCHES_REGEX")&`;
    } else if (isBTNA) {
      parameter = `?c=("type":"${config.a.toLowerCase()}","value":"${mode}","modifier":"MATCHES_REGEX")&`;
    } else {
      parameter = `?c=("type":"${config.b.toLowerCase()}","value":"${mode}","modifier":"MATCHES_REGEX")&`;
    }
    window.location.href = encodeURI(resolvedDomain + parameter + storeParams);
  }

  function enable() {
    const elements = document.querySelectorAll(".keyBoardChar");
    elements.forEach(function (char) {
      char.removeAttribute("disabled");
    });
  }

  function disable() {
    const elements = document.querySelectorAll(".keyBoardChar");
    elements.forEach(function (char) {
      char.setAttribute("disabled", true);
    });
  }

  function handleModeChanges(modeCounter) {
    if (previousStep === 0 && modeCounter >= 1) {
      previousStep = modeCounter;
      enable();
    } else if (previousStep >= 1 && modeCounter === 0) {
      previousStep = modeCounter;
      disable();
    }
  }

  function initMode(currentMode, match) {
    if (currentMode === null) {
      currentMode = [];
    }
    currentMode.push(match);
    return currentMode;
  }

  function decodeURLParameters(config) {
    let storeParams = "";
    let appliedCharacter;
    let currentMode = null;
    const baseURL = decodeURI(window.location.href);

    const domain = new RegExp(`(^.*(?=\\?))`);

    const appliedLetter = new RegExp(
      `(${config.a.toLowerCase()}|${config.b.toLowerCase()})(?:","value":"\\(\\^\\[[A-Z]([a-z])\\]\\.\\*\\).*MATCHES_REGEX)`
    );
    const appliedNumber = new RegExp(
      `(${config.a.toLowerCase()}|${config.b.toLowerCase()})(","value":".*\\\\d.*MATCHES_REGEX)`
    );
    const appliedGeneral = new RegExp(`(.*w)`);

    const resolvedDomain = baseURL.match(domain)[1];
    const results = {};

    function matches(param, result) {
      const letterMatch = result.match(appliedLetter);
      const numberMatch = result.match(appliedNumber);
      const generalMatch = result.match(appliedGeneral);

      if (letterMatch) {
        currentMode = initMode(currentMode, letterMatch[1]);
        appliedCharacter = letterMatch[2];
      } else if (numberMatch) {
        currentMode = initMode(currentMode, numberMatch[1]);
        appliedCharacter = "#";
      } else if (generalMatch) {
        return generalMatch[1];
      }
      return null;
    }

    const paramNames = ["c", "sortby", "dir", "disp", "perPage", "z"];

    paramNames.forEach((param) => {
      const regex = new RegExp(`(?:[?&]${param}=([^&]+))`, "g");
      let match;
      if (!results[param]) {
        results[param] = [];
      }
      while ((match = regex.exec(baseURL)) !== null) {
        const value = match[1];
        if (value && param === "c") {
          const c = matches(param, value);
          if (c != null) {
            results[param].push({ value: c });
          }
        } else if (value) {
          if (!results[param]) {
            results[param] = [];
          }
          results[param].push({ value: value });
        }
      }
    });

    Object.entries(results).forEach(
      ([param, variations], paramIndex, paramEntries) => {
        if (variations && variations.length > 0) {
          const paramValues = variations.map(
            (variation) => `${param}=${variation.value}`
          );
          storeParams += paramValues.join("&");

          // Add '&' after each parameter if it's not the last parameter
          if (paramIndex < paramEntries.length - 1) {
            storeParams += "&";
          }
        }
      }
    );

    return [resolvedDomain, storeParams, appliedCharacter, currentMode];
  }

  async function run(config) {
    let btn;
    let container;
    let letterButton;
    let numberButton;
    let mode;
    [resolvedDomain, storeParams, appliedCharacter, currentMode] =
      decodeURLParameters(config);

    function createInterFace() {
      return new Promise((resolve) => {
        const div = document.createElement("div");
        div.setAttribute("class", "mr-2 mb-2");
        btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-secondary");
        div.appendChild(btn);
        btn.innerHTML = svg;
        const toolbar = document
          .getElementsByClassName("btn-toolbar")[0]
          .getElementsByClassName("btn-group")[0];
        toolbar.after(div);
        container = document.createElement("div");
        container.setAttribute("id", "tag-alpha");
        container.setAttribute(
          "class",
          "tag-alpha filter-container pagination btn-group hideBTN"
        );
        mode = {
          btnA: document.createElement("button"),
          btnB: document.createElement("button"),
        };
        mode.btnA.innerText = config.a;
        mode.btnB.innerText = config.b;
        mode.btnA.setAttribute("class", "btn-alpha btn btn-secondary");
        mode.btnB.setAttribute("class", "btn-alpha btn btn-secondary");
        mode.btnA.setAttribute("id", "charMode-a");
        mode.btnB.setAttribute("id", "charMode-b");

        function setActive(mode) {
          if (!mode.classList.contains("active")) {
            modeCounter += 1;
            mode.classList.add("active");
          } else {
            modeCounter -= 1;
            mode.classList.remove("active");
          }
          handleModeChanges(modeCounter);
        }

        if (currentMode === null) {
          setActive(mode.btnA);
        } else {
          for (const modeItem of currentMode) {
            if (modeItem === config.a.toLowerCase()) {
              setActive(mode.btnA);
            }
            if (modeItem === config.b.toLowerCase()) {
              setActive(mode.btnB);
            }
          }
        }

        mode.btnA.addEventListener("click", function () {
          setActive(mode.btnA);
        });

        mode.btnB.addEventListener("click", function () {
          setActive(mode.btnB);
        });

        resolve();
      });
    }

    await waitForElementByXpath(
      "//span[contains(@class, 'filter-container text-muted paginationIndex center-text')]",
      function () {
        if (!document.getElementById("tag-alpha")) {
          createInterFace();

          if (appliedCharacter != undefined) {
            container.classList.remove("hideBTN");
            container.classList.add("showBTN");
          }

          const alphabet = Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode("a".charCodeAt(0) + i)
          );

          alphabet.forEach(function (letter) {
            letterButton = {
              [letter]: document.createElement("button"),
            };
            letterButton[letter].setAttribute(
              "class",
              "keyBoardChar btn btn-secondary"
            );
            letterButton[letter].setAttribute("id", "char-" + letter);

            letterButton[letter].innerText = letter;
            container.appendChild(letterButton[letter]);

            if (
              appliedCharacter != letter &&
              letterButton[letter].classList.contains("active")
            ) {
              letterButton[letter].classList.remove("active");
            }

            if (appliedCharacter === letter) {
              letterButton[letter].classList.add("active");
            }

            letterButton[letter].addEventListener("click", function () {
              navigate(letter, config, mode.btnA, mode.btnB);
            });
          });

          numberButton = document.createElement("button");
          numberButton.setAttribute("class", "keyBoardChar btn btn-secondary");
          numberButton.setAttribute("id", "char-#");
          if (
            appliedCharacter != "#" &&
            numberButton.classList.contains("active")
          ) {
            numberButton.classList.remove("active");
          }
          if (appliedCharacter === "#") {
            numberButton.classList.add("active");
          }

          numberButton.innerText = "#";
          numberButton.addEventListener("click", function () {
            navigate("#", config, mode.btnA, mode.btnB);
          });

          const fC = document.getElementsByClassName("paginationIndex");
          fC[0].before(container);

          container.prepend(numberButton);
          container.prepend(mode.btnA);
          container.prepend(mode.btnB);

          btn.addEventListener("click", function () {
            if (!btn.classList.contains("active")) {
              btn.classList.add("active");
              container.classList.remove("hideBTN");
              container.classList.add("showBTN");
            } else {
              btn.classList.remove("active");
              container.classList.remove("showBTN");
              container.classList.add("hideBTN");
            }
          });

          const appliedFilterLetter =
            /(?:(Title|Path|Name|Aliases)(?:.*matches.*reg.*\^\[[A-Z])([a-z])\]\.\*\))/;
          const appliedFilterNumber =
            /(?:(Title|Path|Name|Aliases)(?:.matches.regex.\^.*d))/;

          function disableCharacter(regex, char) {
            console.log("disFilter");

            let isMatch = false;
            const filterItem = document.querySelectorAll(".keyBoardChar");

            filterItem.forEach(function (element) {
              const match = element.innerText.match(regex);
              if (match) {
                isMatch = true;
              }
            });

            if (!isMatch) {
              const elem = document.getElementById("char-" + char);
              elem.classList.remove("active");
            }
          }

          function disableFilter(char, isChar) {
            if (isChar) {
              disableCharacter(appliedFilterLetter, char);
            } else {
              disableCharacter(appliedFilterNumber, char);
            }
          }

          const urlReg =
            /c=\(\s*"type"\s*:\s*"(\w+)"\s*,\s*"value"\s*:\s*"([^"]*)"\s*,\s*"modifier"\s*:\s*"MATCHES_REGEX"\s*\)/;
          function checkURL(disableChar, isChar) {
            const i = decodeURI(window.location.href);
            const match = i.match(urlReg);
            if (!match) {
              disableFilter(disableChar, isChar);
            }
          }

          function processFilter(elem) {
            let mode;
            let isChar = true;
            let disableChar;

            const matchChar = elem.match(appliedFilterLetter);
            if (matchChar) {
              mode = matchChar[1];
              disableChar = matchChar[2];
            } else {
              const matchNum = elem.match(appliedFilterNumber);
              if (matchNum) {
                mode = matchNum[1];
                disableChar = "#";
                isChar = false;
              }
            }

            setTimeout(() => checkURL(disableChar, isChar), 500);
          }

          const filterItem = document.querySelectorAll(
            ".tag-item.badge.badge-secondary"
          );

          filterItem.forEach(function (element) {
            element.addEventListener("click", function () {
              processFilter(element.innerText);
            });
          });
        }
      }
    );
  }

  stash.addEventListener("page:gallery", function () {
    run(config1);
  });
  stash.addEventListener("page:galleries", function () {
    run(config1);
  });
  stash.addEventListener("page:images", function () {
    run(config1);
  });
  stash.addEventListener("page:movies", function () {
    run(config2);
  });
  stash.addEventListener("page:performer", function () {
    run(config1);
  });
  stash.addEventListener("page:performers", function () {
    run(config2);
  });
  stash.addEventListener("page:scenes", function () {
    run(config1);
  });
  stash.addEventListener("page:studios", function () {
    run(config2);
  });
  stash.addEventListener("page:tags", function () {
    run(config2);
  });
  stash.addEventListener("stash:response", function () {
    const url = window.location.href.toString().trim();
    if (url.match(/\/tags\/\d+/) || url.match(/\/studios\/\d+/)) {
      run(config1);
    }
  });
})();
