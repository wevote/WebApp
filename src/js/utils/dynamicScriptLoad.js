// dynamically load JavaScript files with callback when finished
export default function dynamicScriptLoad (url, callback) {
  const { loadedScripts } = window;
  if (!loadedScripts) {
    window.loadedScripts = [url];
  } else if (loadedScripts.includes(url)) {
    console.log('script already loaded: ', url);
    callback();
  } else {
    window.loadedScripts.push(url);
  }

  const script = document.createElement('script'); // create script tag
  script.type = 'text/javascript';

  // when script state is ready and loaded or complete we will call callback
  if (script.readyState) {
    script.onreadystatechange = () => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url; // load by url
  document.getElementsByTagName('head')[0].appendChild(script); // append to head
}
