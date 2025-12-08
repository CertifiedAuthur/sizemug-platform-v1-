"use strict";
/**
 * This function is responsible for formatting my contenteditable editor
 * @param {string} cmd - command to be execute by execCommand()
 * @param {string | null} value - It might be null(bold, ordered, ...) sometimes and also as value some other times (foreColor, ...)
 */

function formatDoc(cmd, value = null) {
  if (value) {
    document.execCommand(cmd, false, value);
  } else {
    document.execCommand(cmd);
  }
}
