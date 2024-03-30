// This script sets the theme based on the user's preference
// => Prevents a flash of light mode if the user prefers dark mode at the system level.

// Note that this script causes a hydration error in the browser console:
// "Warning: Extra attributes from the server: data-theme"
// But we can ignore it.
(function () {
  var theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();
