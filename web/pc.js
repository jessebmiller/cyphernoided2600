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
  window.localStorage.setItem(namespace(key), value)
}

function get(key) {
  return window.localStorage.getItem(namespace(key))
}

function handleInputEvent(event) {
  set(event.target.id, event.target.value)
}

function hydrateElement(elem) {
  storedValue = get(elem.id)
  if (!storedValue) { return }
  elem.value = storedValue
}

document.addEventListener("DOMContentLoaded", function(event) {
  persistTags = ["input", "textarea"]
  persistElements = []
  for (tag of persistTags) {
    elems = document.getElementsByTagName(tag)
    for (elem of elems) {
      hydrateElement(elem)
      elem.addEventListener("input", handleInputEvent)
    }
  }
});

