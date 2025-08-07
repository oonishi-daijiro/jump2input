let previousFocusedInputElementIndex = 0

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

  get length() {
    return (this.elm.value ?? { length: 0 }).length;
  }

  setCursorToEnd() {
    this.elm.setSelectionRange(this.length, this.length)
  };
}


class ContentEditableElement extends TextInputable {
  get length() {
    return this.elm.querySelectorAll("*").length;
  }

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

function jump2input() {
  const inputables = getAllTextInputableElements();

  if (inputables.length >= 1) {
    if (previousFocusedInputElementIndex === inputables.length) {
      inputables[previousFocusedInputElementIndex - 1].blur()
      previousFocusedInputElementIndex = 0
      return
    } else {
      inputables[previousFocusedInputElementIndex].focus()
    }

    inputables[previousFocusedInputElementIndex].setCursorToEnd()
    const offsetTop = inputables[previousFocusedInputElementIndex].offsetTop

    if (!isDomInScreen(inputables[previousFocusedInputElementIndex].elm)) {
      window.scrollTo({
        left: 0,
        top: offsetTop
      })
    }
    previousFocusedInputElementIndex += 1
  }
}

function isDomInScreen(dom) {
  const offsetFromViewY = dom.getBoundingClientRect().top
  const screenHeight = screen.height
  return 0 < offsetFromViewY && offsetFromViewY < screenHeight
}
