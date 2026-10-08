(() => {
  const destination = new URL(location.href);
  destination.pathname = destination.pathname.replace(/^\/docs(?=\/|$)/, '/doc');
  location.replace(destination.href);
})();
