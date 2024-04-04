const API_URL = "https://car-data.p.rapidapi.com/cars?";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "d09c0e749cmsh3aaf1f8156902d7p165ca7jsn042ccef52cc6",
    "X-RapidAPI-Host": "car-data.p.rapidapi.com",
  },
};
const resultsContainer = document.querySelector(".results");
const inputBrand = document.querySelector(".input-brand");
const inputModel = document.querySelector(".input-model");
const inputYear = document.querySelector(".input-year");
const inputType = document.querySelector(".input-type");

const searchBtn = document.querySelector(".form__submit");
const formReset = document.querySelector(".form__reset");

const footerYear = (document.querySelector(".footer-year").textContent =
  new Date().getFullYear());
const resultsInfo = document.querySelector(".results-info");
const numberResults = document.querySelector(".results-info__number");

const state = {
  numberOfResults: 0,
  items: null,
};

formReset.addEventListener("click", (e) => {
  e.preventDefault();
  inputBrand.value = "";
  inputModel.value = "";
  inputYear.value = "";
  inputType.value = "";
  resultsInfo.classList.remove("show");
  clearResults();
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let suspectInput = 0;
  [inputBrand, inputModel, inputType, inputYear].forEach((input) => {
    if (input.value.includes("<script>")) {
      input.classList.add("error");
      handleError("Forbidden syntax input");
      suspectInput++;
    } else {
      input.classList.remove("error");
    }
  });
  if (suspectInput !== 0) return;
  findResult();
});

const selectTypeOfCar = (carType) => {
  const typeOfCar = carType.split(",")[0];
  if ((typeOfCar === "Coupe") | (typeOfCar === "Convertible")) {
    return "sport-car";
  } else if ((typeOfCar === "SUV") | (typeOfCar === "Wagon")) {
    return "suv";
  } else if (typeOfCar === "Hatchback") {
    return "coupe";
  } else if (typeOfCar === "Sedan") {
    return "sedan";
  } else if (typeOfCar === "Pickup") {
    return "pickup-car";
  } else {
    return "minivan";
  }
};

const generateRandomPrice = () => {
  const price = Math.floor(Math.random() * 99);
  return price;
};

const loadingSkeletons = () => {
  const skeletonCarCardHTML = `<div class="card-result skeleton-card">
  <div class="card-result-left">
    <div class="card-result-left__img"></div>
  </div>
  <div class="card-result-right">
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>
</div>`;
  for (let i = 0; i <= 6; i++) {
    resultsContainer.insertAdjacentHTML("beforeend", skeletonCarCardHTML);
  }
};

const clearResults = () => {
  resultsContainer.innerHTML = "";
};

const handleError = (msg) => {
  resultsContainer.innerHTML = `<div class="error">
  <h2>${msg}</h2>
</div>`;
};

const findResult = () => {
  clearResults();
  const searchParams = {
    year: inputYear.value.trim(),
    make: inputBrand.value.trim(),
    model: inputModel.value.trim(),
    type: inputType.value.trim(),
  };

  loadingSkeletons();
  fetch(
    `${API_URL}limit=30&page=0&year=${searchParams.year}&make=${searchParams.make}&model=${searchParams.model}&type=${searchParams.type}`,
    options
  )
    .then((res) => {
      if (!res.ok) {
        handleError("Ups.. something went wrong, try again ⛔");
        throw new Error("Something went wrong");
      }
      return res.json();
    })
    .then((data) => {
      if (data.length === 0) {
        clearResults();
        handleError("No cars found, try again ⛔");
      } else {
        clearResults();
        state.items = [...data];
        state.numberOfResults = state.items.length;
        numberResults.textContent = state.numberOfResults;
        resultsInfo.classList.add("show");
        state.items.forEach((car) => createCardResult(car));
      }
    })
    .catch((err) =>
      handleError(err, "Ups.. something went wrong, try again ⛔")
    );
};

const createCardResult = (carObject) => {
  const { make, model, type, year } = carObject;
  carCardHTML = `<div class="card-result">
 <div class="card-result-left">
   <img
     src="/img/${selectTypeOfCar(type)}.png"
     alt="sedan"
     class="card-result-left__img"
   />
 </div>
 <div class="card-result-right">
   <h3 class="card-result-right__brand"
     ><span>Brand:</span> ${make}</h3
   >
   <ul class="car-info-list">
     <li class="car-info-list__item card-result-right__type"
       ><span>Type:</span> ${type}</li
     >
     <li class="car-info-list__item card-result-right__model"
       ><span>Model:</span> ${model}</li
     >
     <li class="car-info-list__item card-result-right__year"
       ><span>Year:</span> ${year}</li
     >
     <li class="car-info-list__item card-result-right__year"
       ><span>Price:</span> ~ ${generateRandomPrice()},000$</li
     >
   </ul>
 </div>
</div>`;
  resultsContainer.insertAdjacentHTML("beforeend", carCardHTML);
};
