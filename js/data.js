class ErrorResponse extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function getData(url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.send();
  });
}
