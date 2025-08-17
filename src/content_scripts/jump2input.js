
chrome.runtime.onMessage.addListener((message) => {
  switch (message) {
    case "jump2input":
      jump2input()
      break;

    default:
      break;
  }
  return
});

class TextInputable {
  elm;

  constructor(elm) {
    this.elm = elm;
  }

  focus() {
    this.elm.focus();
  }

  blur() {
    this.elm.blur();
  }

  setCursorToEnd() {
    this.elm.setSelectionRange(this.elm.value.length, this.elm.value.length)
  };
}


class ContentEditableElement extends TextInputable {

  setCursorToEnd() {
    const range = document.createRange();
    window.getSelection().removeAllRanges();

    if (this.elm.childNodes.length > 0) {
      range.setStartAfter(this.elm.childNodes[this.elm.childNodes.length - 1]);
      range.collapse(true);
    } else {
      range.setStart(this.elm, 0);
      range.setEnd(this.elm, 0);
    }
    window.getSelection().addRange(range);
  }
};


function inputableElementFilterFunc(elm) {
  switch (elm.nodeName) {
    case "INPUT":
      return ["text", "search", "tel", "url", "email", "password"].includes(elm.type) && !elm.readOnly;
    case "TEXTAREA":
      return !elm.readOnly
    default:
      return elm.isContentEditable && elm.contentEditable !== "inherit";
  }
}

function getAllTextInputableElements() {
  const checkVisibilityProps = {
    contentVisibilityAuto: true,
    opacityProperty: true,
    visibilityProperty: true
  };
  const allInputableElement = (Array.from(document.getElementsByTagName("*"))).filter(inputableElementFilterFunc).filter(e => e.offsetParent != null && e.checkVisibility(checkVisibilityProps));
  return allInputableElement.map(e => (["INPUT", "TEXTAREA"].includes(e.nodeName) ? new TextInputable(e) : new ContentEditableElement(e)));
}

function* getInputIterator() {
  let index = 0;
  let previousFocusedInput = null;

  while (true) {
    const inputables = getAllTextInputableElements();
    if (inputables.length > 0) {
      if (index >= inputables.length) {
        previousFocusedInput?.blur();
        index = 0;
        yield;
      }
      previousFocusedInput = inputables[index];
      yield inputables[index];
    } else {
      yield
    }
    index++;
  }
}
const inputIterator = getInputIterator();

function jump2input() {
  const input = inputIterator.next().value;
  input?.focus();
  input?.setCursorToEnd();

  if (!isDomInScreen(input?.elm)) {
    window.scrollTo({
      left: 0,
      top: input.elm.offsetTop
    })
  }
}

function isDomInScreen(dom) {
  if (dom) {
    const offsetFromViewY = dom.getBoundingClientRect().top
    const screenHeight = screen.height
    return 0 < offsetFromViewY && offsetFromViewY < screenHeight
  } else {
    return true;
  }
}
