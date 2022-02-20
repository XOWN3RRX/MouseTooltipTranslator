/**
 * Selection related functions
 */

let lastSelectedText = "";
var timer; 
var timeout = 210;

export function enableSelectionEndEvent() {
  // Trigger on mouse up immediately. Helps reduce 700 ms delay during mouse selection.
  document.addEventListener(
    "mouseup",
    function(event) {
      clearTimeout(timer);
      timer = setTimeout(function() {
            triggerSelectionEnd();
      }, timeout);
    },
    false
  );
}

export function getSelectionText() {
  let text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

export function getSelectionPosition() {
  let s = window.getSelection();
  let oRange = s.getRangeAt(0); //get the text range
  let oRect = oRange.getBoundingClientRect();
  return {
    x: oRect.x,
    y: oRect.y,
  };
}

function triggerSelectionEnd() {
  let event = document.createEvent("HTMLEvents");
  event.initEvent("selectionEnd", true, true);
  event.eventName = "selectionEnd";
  event.selectedText = getSelectionText();
  // don't fire event twice
  if (event.selectedText === lastSelectedText) {
    lastSelectedText = "";
    return;
  }
  lastSelectedText = event.selectedText;
  document.dispatchEvent(event);
}

// Returns a function, that, as long as it continues to be invoked, will not be triggered.
// The function will be called after it stops being called for N milliseconds.
function debounce(callback, interval = 300) {
  let debounceTimeoutId;

  return function(...args) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
  };
}
