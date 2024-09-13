// Fetch and display JSON data
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => render(data))
  .catch((error) => console.error("Error loading JSON:", error));

function render(data) {
  const container = document.querySelector("#data-table");

  // sort the data by bucket
  const sortedData = sortData(data);

  // populate the cells given the buckets into a div
  for (var bucket in sortedData) {
    var group = document.createElement("div");
    group.setAttribute("class", "bucket-grouping transition");
    group.setAttribute("bucket", bucket);

    generateBucketDivisor(bucket, group);
    generateCells(sortedData[bucket], group);
    container.appendChild(group);
  }

  // add listeners
  addCellListeners(container);
  addFilterListeners(container);
}

// listener functions
function addFilterListeners(container) {
  const buttons = document.querySelectorAll("#filter-buttons div");
  let activeButton = null;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("bucket");

      if (activeButton === button) {
        // Reset to show all divs
        container.querySelectorAll("div[bucket]").forEach((div) => {
          div.style.display = "block";
          div.style.opacity = 1;
        });
        activeButton = null;
      } else {
        // Hide all divs and show only the selected type
        container.querySelectorAll("div[bucket]").forEach((div) => {
          if (!div.getAttribute("bucket").toLowerCase().localeCompare(type.toLowerCase())) {
            div.style.display = "block";
            div.style.opacity = 1;
          } else {
            div.style.display = "none";
            div.style.opacity = 0;
          }
        });
        activeButton = button;
      }

      // Update button states
      buttons.forEach((btn) => {
        btn.classList.remove("border-b-2");
        if (activeButton) {
          activeButton.classList.add("border-b-2");
        }
      });
    });
  });
}

function addCellListeners() {
  // Add event listeners for drop down for each cell
  document.querySelectorAll(".cell").forEach((item) => {
    item.addEventListener("click", (event) => {
      const hiddenContent = item.querySelector(".description");
      item.classList.toggle("activeCell");

      if (item.classList.contains("activeCell")) {
        let y = item.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
        // item.scrollIntoView({ behavior: "smooth"})
        hiddenContent.classList.add("show");
      } else {
        hiddenContent.classList.remove("show");
      }
    });
  });
}

function addCarouselSlideListener() {
  document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel-inner");
    const slides = carousel.querySelectorAll("img");
    const totalSlides = slides.length;
    let currentSlide = 0;
    let startX = 0;
    let endX = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    // Touch start event
    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    // Touch move event (optional if you want to detect swiping)
    carousel.addEventListener("touchmove", (e) => {
      endX = e.touches[0].clientX;
    });

    // Touch end event
    carousel.addEventListener("touchend", (e) => {
      if (startX > endX + 50) {
        currentSlide = (currentSlide + 1) % totalSlides; // Swipe left
      } else if (startX < endX - 50) {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Swipe right
      }
      updateCarousel();
    });
  });
}

// generation functions
function generateBucketDivisor(bucket, container) {
  const divisor = document.createElement("div");
  divisor.setAttribute("class", `m-4 md:my-2 p-4 text-center text-xl font-semibold`);
  divisor.innerHTML = `<fieldset class="border-t border-gray-300">
  <legend class="mx-auto px-4 text-gray-500">${bucket}</legend>
    </fieldset>
    <div class="text-center text-sm text-gray-500 text-pretty">${getBucketDescription(
      bucket
    )}</div>`;
  container.appendChild(divisor);
}

function generateCells(data, container) {
  data.forEach((item) => {
    const cell = document.createElement("div");
    cell.setAttribute(
      "class",
      `${item.bucket} cell flex flex-col mx-4 my-1 md:my-2 p-4 justify-between ${findColor(
        item.bucket
      )} bg-opacity-25`
    );
    cell.appendChild(generateCellHeader(item));

    cell.appendChild(generateCellDescription(item));

    container.appendChild(cell);
  });
}

function generateCellHeader(item) {
  const header = document.createElement("div");
  header.innerHTML = `
      <div class="flex justify-between">
        <div>
          <div class="text-xl font-semibold text-left text-gray-700">${item.name}</div>
          <div class="text-gray-700">${generatePills(item.type)}</div>
        </div>
        <div class=""> 
          <div class="text-sm text-right text-gray-700 mb-1">${item.playercount} 🤺</div>
          <div class="text-sm text-right text-gray-700">${item.time} 🕛</div>
        </div>
       </div>
      `;
  return header;
}

function generateCellImageCarousel(item) {
  const name = item.name;
  const maxImages = 5;
  const imagePath = "./images/";

  const carousel = document.createElement("div");
  carousel.setAttribute(
    "class",
    "carousel-inner flex w-full h-full transition-transform duration-500"
  );

  for (let i = 1; i <= maxImages; i++) {
    const img = document.createElement("img");
    img.src = `${imagePath}${name}${i}.jpg`;
    img.alt = `${name} ${i}`;
    img.onerror = () => {
      // Remove the image if it fails to load
      img.remove();
    };
    img.className = `w-full h-full object-cover`;
    carousel.appendChild(img);
  }

  return carousel;
}

function generateCellDescription(item) {
  const container = document.createElement("div");
  container.setAttribute(
    "class",
    "description max-h-0 overflow-hidden transition-all ease-in-out duration-600"
  );
  
  container.innerHTML = `
  <div>player count: ${item.playercount}</div>
  <div>duration: ${item.time}</div>
  <br>
  <div>${item.description}</div>
  `;
  return container;
}

function generatePills(data) {
  var htmlText = "";
  data.split("/").forEach((item) => {
    htmlText = htmlText.concat('<div class="text-sm text-left text-gray-700">', item, "</div> ");
  });
  return htmlText;
}

// helper functions
function findColor(item) {
  var finalColor = "gray-700";
  switch (item.toLowerCase()) {
    case "modern":
      finalColor = "bg-violet-400";
      break;
    case "classic":
      finalColor = "bg-emerald-400";
      break;
    case "modern classic":
      finalColor = "bg-sky-400";
      break;
    case "hardcore":
      finalColor = "bg-red-600";
      break;
    default:
      finalColor = "bg-gray-200";
      break;
  }

  return finalColor;
}

function sortData(data) {
  return data.sort().reduce((obj, key) => {
    if (!obj[key.bucket]) {
      obj[key.bucket] = [key];
    } else {
      obj[key.bucket].push(key);
    }
    return obj;
  }, {});
}

function getBucket(data) {
  var lookup = {};
  var buckets = [];

  for (var item, i = 0; (item = data[i++]); ) {
    var bucket = item.bucket;
    if (!lookup[bucket]) {
      lookup[bucket] = 1;
      buckets.push(bucket);
    }
  }
}

function getBucketDescription(bucket) {
  var desc = "";
  switch (bucket.toLowerCase()) {
    case "modern":
      desc =
        "Games that feature new and exciting mechanisms that is quite often unique to that awesome game";
      break;
    case "classic":
      desc = "The classics, almost can't go wrong with these. You might be a little old though";
      break;
    case "modern classic":
      desc = "Well-known games that are a step up from the classics";
      break;
    case "hardcore":
      desc =
        "You will need time and dedication to learn, however you will get to experience the peak of what board games can offer";
      break;
    default:
      break;
  }
  return desc;
}
