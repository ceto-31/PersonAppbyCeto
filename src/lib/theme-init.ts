/**
 * Inline script that runs in <head> BEFORE first paint to set the
 * correct theme class on <html>. No JS needed for the *initial* render
 * to be correctly themed (this script is part of the HTML the server
 * sends, so it executes synchronously before anything paints).
 *
 * Adding a new theme: just allow its name in the `valid` set below.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
  var valid = ['light','dark'];
  var stored = localStorage.getItem('theme');
  var sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  var theme = valid.indexOf(stored) !== -1 ? stored : sys;
  var root = document.documentElement;
  valid.forEach(function(t){ root.classList.remove('theme-' + t); });
  root.classList.add('theme-' + theme);
  root.style.colorScheme = theme;
  // Defer enabling transitions until after first paint
  requestAnimationFrame(function(){ root.classList.add('theme-ready'); });
}catch(e){
  document.documentElement.classList.add('theme-light');
}})();`;
