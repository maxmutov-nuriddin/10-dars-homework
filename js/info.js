let boxCard = document.querySelector('.box-card')

const info = new URLSearchParams(location.search).get("comment");
// console.log(info);

function boxFn({ name, flags, continents, population, subregion }) {
  return `
  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${flags.png}" class="img-fluid rounded-start" style="width: 100%; height: 100%">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title fs-2">${name.common}</h5>
          <p class="card-text fs-3 mb-0">${population}</p>
          <p class="card-text fs-2 mb-0">${subregion}</p>
          <p class="card-text"><small class="text-body-secondary fs-4">${continents}</small></p>
        </div>
      </div>
    </div>
  </div>
  `;
}

let globalHours;
let globalMinutes;
let globalSeconds;

function getLocalTime(offsetStr) {
  let offsetMatch = offsetStr.match(/([+-])(\d{2}):(\d{2})/);

  if (offsetMatch) {
    let sign = offsetMatch[1];
    let offsetHours = parseInt(offsetMatch[2]);
    let offsetMinutes = parseInt(offsetMatch[3]);

    let totalOffsetMinutes = ((offsetHours - 5) * 60 + offsetMinutes) * (sign === "+" ? 1 : -1);

    let currentTime = new Date();

    let localTime = new Date(currentTime.getTime() + totalOffsetMinutes * 60000);

    let localHours = localTime.getHours();
    let minutes = localTime.getMinutes();
    let seconds = localTime.getSeconds();

    localHours = localHours < 10 ? "0" + localHours : localHours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    globalHours = localHours;
    globalMinutes = minutes;
    globalSeconds = seconds;

    return {
      hours: localHours,
      minutes: minutes,
      seconds: seconds
    };
  } else {
    return "Invalid time offset format";
  }
}

async function getPosts() {
  try {
    let url = 'https://restcountries.com/v3.1/all';
    let cardBox = await getData(url);
    let sortrS = cardBox.filter((item) => item.area == info);

    // console.log(sortrS);

    sortrS.map((items) => {
      boxCard.innerHTML = boxFn(items);

      const offsetStr = items.timezones[0];

      setInterval(() => {
        let localTime = getLocalTime(offsetStr);

        let hours = localTime.hours;
        let minutes = localTime.minutes;
        let seconds = localTime.seconds;

        globalHours = hours;
        globalMinutes = minutes;
        globalSeconds = seconds;
      }, 1000);
    });

  } catch (err) {
    console.log(err);
  }
}
const time = document.querySelector('.time');

window.onload = function () {
  const hourHand = document.querySelector('.hourHand');
  const minuteHand = document.querySelector('.minuteHand');
  const secondHand = document.querySelector('.secondHand');
  // const time = document.querySelector('.time');

  function setDate() {
    const today = `${globalHours}:${globalMinutes}:${globalSeconds}`;

    const secondDeg = ((globalSeconds / 60) * 360) + 360;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;

    const minuteDeg = ((globalMinutes / 60) * 360);
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;

    const hourDeg = ((globalHours / 12) * 360);
    hourHand.style.transform = `rotate(${hourDeg}deg)`;

    time.innerHTML = '<span class="time-box-span">' + '<strong>' + today + '</strong>' + '</span>';
  }

  setInterval(setDate, 1000);

  getPosts();
};


if ((globalHours = "undefined") && (globalMinutes = "undefined") && (globalSeconds = "undefined")) {
  getPosts();
  time.innerHTML += '<span class="time-box-span">...loading</span>'
}