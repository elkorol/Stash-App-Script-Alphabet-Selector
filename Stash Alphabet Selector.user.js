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
  const { stash, waitForElementByXpath } =
    unsafeWindow.stash;
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

  let svg =
    '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" class="svg-inline--fa fa-filter fa-icon " role="img" xmlns="http://w' +
    'ww.w3.org/2000/svg" viewBox="5 5 14 14"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejo' +
    'in="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 9C7 9.55229 6.55229 10 6 10C5.44772 10 5 9.55229 5 9C5 8.44772 5.44772 8 6 8C6.55229 8 7 8.44772 ' +
    '7 9Z" fill="currentColor"></path> <path d="M7 12C7 12.5523 6.55229 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55229 11 7 11.4477 7 12Z' +
    '" fill="currentColor"></path> <path d="M10 12C10 12.5523 9.55229 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55229 11 10 11.4477 10 12Z' +
    '" fill="currentColor"></path> <path d="M10 9C10 9.55229 9.55229 10 9 10C8.44772 10 8 9.55229 8 9C8 8.44772 8.44772 8 9 8C9.55229 8 10 8.44772 10 9Z" fill' +
    '="currentColor"></path> <path d="M13 9C13 9.55229 12.5523 10 12 10C11.4477 10 11 9.55229 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9Z" fill=' +
    '"currentColor"></path> <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" ' +
    'fill="currentColor"></path> <path d="M16 9C16 9.55229 15.5523 10 15 10C14.4477 10 14 9.55229 14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9Z" f' +
    'ill="currentColor"></path> <path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 1' +
    '2Z" fill="currentColor"></path> <path d="M19 9C19 9.55229 18.5523 10 18 10C17.4477 10 17 9.55229 17 9C17 8.44772 17.4477 8 18 8C18.5523 8 19 8.44772 19 9' +
    'Z" fill="currentColor"></path> <path d="M19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 ' +
    '19 12Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M7.94513 4.25H16.0549C17.4225 4.24998 18.5248 4.24996 19.3918 4.3665' +
    "2C20.2919 4.48754 21.0497 4.74643 21.6517 5.34835C22.2536 5.95027 22.5125 6.70814 22.6335 7.60825C22.75 8.47522 22.75 9.57754 22.75 10.9451V13.0549C22.75" +
    " 14.4225 22.75 15.5248 22.6335 16.3918C22.5125 17.2919 22.2536 18.0497 21.6517 18.6517C21.0497 19.2536 20.2919 19.5125 19.3918 19.6335C18.5248 19.75 17.4" +
    "225 19.75 16.0549 19.75H7.94513C6.57754 19.75 5.47522 19.75 4.60825 19.6335C3.70814 19.5125 2.95027 19.2536 2.34835 18.6517C1.74643 18.0497 1.48754 17.29" +
    "19 1.36652 16.3918C1.24996 15.5248 1.24998 14.4225 1.25 13.0549V10.9451C1.24998 9.57754 1.24996 8.47522 1.36652 7.60825C1.48754 6.70814 1.74643 5.95027 2" +
    ".34835 5.34835C2.95027 4.74643 3.70814 4.48754 4.60825 4.36652C5.47522 4.24996 6.57754 4.24998 7.94513 4.25ZM4.80812 5.85315C4.07435 5.9518 3.68577 6.132" +
    "25 3.40901 6.40901C3.13225 6.68577 2.9518 7.07435 2.85315 7.80812C2.75159 8.56347 2.75 9.56458 2.75 11V13C2.75 14.4354 2.75159 15.4365 2.85315 16.1919C2." +
    "9518 16.9257 3.13225 17.3142 3.40901 17.591C3.68577 17.8678 4.07435 18.0482 4.80812 18.1469C5.56347 18.2484 6.56458 18.25 8 18.25H16C17.4354 18.25 18.436" +
    "5 18.2484 19.1919 18.1469C19.9257 18.0482 20.3142 17.8678 20.591 17.591C20.8678 17.3142 21.0482 16.9257 21.1469 16.1919C21.2484 15.4365 21.25 14.4354 21." +
    "25 13V11C21.25 9.56459 21.2484 8.56347 21.1469 7.80812C21.0482 7.07435 20.8678 6.68577 20.591 6.40901C20.3142 6.13225 19.9257 5.9518 19.1919 5.85315C18.4" +
    "365 5.75159 17.4354 5.75 16 5.75H8C6.56458 5.75 5.56347 5.75159 4.80812 5.85315ZM6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H17C17.4142 15.25 17.75 15.585" +
    '8 17.75 16C17.75 16.4142 17.4142 16.75 17 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16Z" fill="currentColor"></path></g></svg>';

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
