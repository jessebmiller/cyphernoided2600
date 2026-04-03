/*

  [ ] on load, if path empty, load latest sheet or generate new sheet
      populate fields from local storage by sheet

  [x] update local storage on field change

  roll and add result to history on roll button press

  show latest history entry (with remove button, just hides it, recoverable?)

*/

// never change DEFAULT_NAMESPACE
const DEFAULT_NAMESPACE = "2dd04450-4427-4408-befa-6f8d22d1581c"
// never change DEFAULT_NAMESPACE

const VERSION = "0"
const NAMESPACE_SEARCH_PARAM = "ns"

const params = new URLSearchParams(window.location.search)

// namespace v<version>/<namespace>/<key>
function namespace(key) {
  ns = params.has(NAMESPACE_SEARCH_PARAM)
            ? params.get(NAMESPACE_SEARCH_PARAM)
            : DEFAULT_NAMESPACE
  return `v${VERSION}/${ns}/${key}`
}

function set(key, value) {
  window.localStorage.setItem(
    namespace(key), 
    JSON.stringify(value),
  )
}

function get(key) {
  return JSON.parse(
    window.localStorage.getItem(namespace(key))
  )
}

function handleInputEvent(event) {
  set(event.target.id, event.target.value)
}

function hydrateElement(elem) {
  storedValue = get(elem.id)
  if (!storedValue) { return }
  elem.value = storedValue
  elem.addEventListener("input", handleInputEvent)
}

/* Cyberware
 * - description
 * - rank
 * - quirk/malfunction[]
 */
function hydrateWare(ware, parentElem, index) {
  function mkChild(div, tag, value, id, className) {
    e = document.createElement(tag)
    e.id = `${parentElem.id}/${id}`
    e.classList.add(className) 
    div.appendChild(e)
    if (!["input", "textarea"].includes(tag)) { return e }
    
    e.value = value
    return e
  }

  wareDiv = document.createElement("div")
  wareDiv.id = `${warezContainer.id}/${index}`
  wareDiv.classList.add("ware")
  parentElem.appendChild(wareDiv)

  descriptionElem = mkChild(wareDiv, "textarea", ware.description, "description", "description")
  rankElem = mkChild(wareDiv, "input", ware.rank, "rank", "rank")
  quirksContainer = mkChild(wareDiv, "div", "", "quirks", "quirks")
  
  quirkIndex = 0
  quirkElems = []
  for (quirk of ware.quirks) {
    e = mkChild(quirksContainer, "input", quirk, `${quirkIndex}/quirk`, "quirk")
    quirkElems.push(e)
    quirkIndex += 1
  }
  quirkElems.push(
    mkChild(quirksContainer, "input", "", `${quirkIndex}/quirk`, "quirk")
  )
  return { descriptionElem, rankElem, quirkElems }
}

function attachInputHandlers(warez, descriptionElem, rankElem, quirkElems, i) {
  descriptionElem.addEventListener("input", function (event) {
    warez[i].description = event.target.value
    set("cyberware", warez)
  })
  rankElem.addEventListener("input", function (event) {
    warez[i].rank = event.target.value
    set("cyberware", warez)
  })
  quirkElems.forEach(function (quirkElem, j) {
    console.log("adding listener to", quirkElem, j)
    quirkElem.addEventListener("input", function (event) {
      warez[i].quirks[j] = event.target.value
      set("cyberware", warez)
    })
  })
}


document.addEventListener("DOMContentLoaded", function(event) {
  persistClass = "persist"
  persistElements = []
  elems = document.getElementsByClassName(persistClass)
  for (elem of elems) {
    hydrateElement(elem)
  }
  
  // handle cyberware
  testCyberware = [
    { description: "test cyberware",
      rank: "1",
      quirks: ["weird", "preliminary"],
    },
    { description: "crawhole",
      rank: "12",
      quirks: ["boom", "bap"],
    },
  ]
  //set("cyberware", testCyberware)
  warezContainer = document.getElementById("cyberware")
  warez = get("cyberware")
  warez.forEach(function (ware, i) {
    const { descriptionElem, rankElem, quirkElems } = hydrateWare(ware, warezContainer, i)
    attachInputHandlers(warez, descriptionElem, rankElem, quirkElems, i)
  })
});

