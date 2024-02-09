const apiKey =
  "http://api.weatherapi.com/v1/forecast.json?key=a9be8273ee5e40678ec182209240302";

const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");

let store = {
  city: "Запорожье",
  tempC: 0,
  isDay: 1,
  condition: "",
  properties: {
    cloud: {},
    humidity: {},
    windMph: {},
    visKm: {},
    pressureIn: {},
    uv: {},
  },
};

const fetchData = async () => {
  try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${apiKey}&q=${query}`);
    const data = await result.json();

    const {
      current: {
        cloud,
        temp_c: tempC,
        humidity,
        pressure_in: pressureIn,
        uv,
        vis_km: visKm,
        is_day: isDay,
        wind_mph: windMph,
        condition,
      },
      location: { localtime: location, name },
    } = data;

    console.log(data);

    store = {
      ...store,
      isDay,
      city: name,
      tempC,
      location,
      condition: condition.text,
      properties: {
        cloud: {
          title: "cloud",
          value: `${cloud}%`,
          icon: "cloud.png",
        },
        humidity: {
          title: "humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windMph: {
          title: "wind mph",
          value: `${windMph} m/s`,
          icon: "wind.png",
        },
        visKm: {
          title: "vis km",
          value: `${visKm} km/h`,
          icon: "visibility.png",
        },
        pressureIn: {
          title: "pressure in",
          value: `${pressureIn}%`,
          icon: "gauge.png",
        },
        uv: {
          title: "uv",
          value: `${uv} / 100`,
          icon: "uv.png",
        },
      },
    };

    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (condition) => {
  const value = condition.toLowerCase();

  switch (value) {
    case "rain":
      return "rain.png";
    case "mist":
      return "mist.png";
    case "partly cloudy":
      return "light-rain.png";
    case "light rain":
      return "light-rain.png";
    case "overcast":
      return "overcast.png";
    case "fog":
      return "fog.png";
    case "clear":
      return "clear.png";
    case "sunny":
      return "sunny.png";

    default:
      return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
                <div class="property-icon">
                    <img src="./img/icons/${icon}" alt="">
                </div>
                <div class="property-info">
                    <div class="property-info__value">${value}</div>
                    <div class="property-info__description">${title}</div>
                </div>
            </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, condition, location, tempC, isDay, properties } = store;

  const containerClass = isDay === 1 ? "is-day" : 0;

  return `<div class="container ${containerClass}">
            <div class="top">
                <div class="city">
                    <div class="city-subtitle">Weather Today in</div>
                        <div class="city-title" id="city">
                        <span>${city}</span>
                    </div>
                </div>
                <div class="city-info">
                    <div class="top-left">
                    <img class="icon" src="./img/${getImage(
                      condition
                    )}" alt="" />
                    <div class="condition">${condition}</div>
                </div>
    
                <div class="top-right">
                    <div class="city-info__subtitle">as of ${location}</div>
                    <div class="city-info__title">${tempC}°</div>
                </div>
            </div>
        </div>
    <div id="properties">${renderProperty(properties)}</div>
</div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle("active");
};

const renderComponent = () => {
  root.innerHTML = markup();
  const city = document.getElementById("city");
  const closeButton = document.getElementById("close");

  city.addEventListener("click", togglePopupClass);
  closeButton.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;
  if (!value) return null;
  localStorage.setItem("query", value);
  fetchData();
  togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);

fetchData();
