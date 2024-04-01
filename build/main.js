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

const errorMessage = document.querySelector(".error");

formReset.addEventListener("click", (e) => {
  e.preventDefault();
  inputBrand.value = "";
  inputModel.value = "";
  inputYear.value = "";
  inputType.value = "";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  resultsContainer.innerHTML = "";
  const searchParams = {
    year: inputYear.value,
    make: inputBrand.value,
    model: inputModel.value,
    type: inputType.value,
  };

  console.log(searchParams);
  loadingSkeletons();
  fetch(
    `${API_URL}limit=10&page=0&year=${searchParams.year}&make=${searchParams.make}&model=${searchParams.model}&type=${searchParams.type}`,
    options
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      return res.json();
    })
    .then((data) => {
      if (data.length === 0) {
        console.log("No cars has been found");
        resultsContainer.innerHTML = "";
        errorMessage.classList.add("show");
      } else {
        resultsContainer.innerHTML = "";
        console.log(data);
        data.forEach((car) => createCardResult(car));
      }
    })
    .catch((err) => console.log(err));
});

const createCardResult = (carObject) => {
  // resultsContainer.innerHTML = "";
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
