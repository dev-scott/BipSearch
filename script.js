const apiKey = "dOJwqBCH9dszxaVVZaCg6XbYFoMZhSyZbwOd2NOBpglvThC9QEj70Igl";

const loadMoreImg = document.querySelector(".load-more");

const searchInput = document.querySelector(".search-box input");

const imagesWrapper = document.querySelector(".images");
const ligntbox = document.querySelector(".lightbox");

const closeBtn = ligntbox.querySelector(".fa-circle-xmark");

const dowloadImgBtn = ligntbox.querySelector(".fa-download");

const menuFirst = document.querySelector(".menu");

const menuIcon = document.querySelector(".menuIcon");

const iconClose = document.querySelector(".icon_close");

const navSide = document.querySelector(".side_nav");

const contain_side_nav = document.querySelector(".contain_side_nav");

// const menuSecond = document.querySelector(".menu-second");

const perPage = 15;

let currentPag = 1;

let searchterm = null;

const downloadImg = url => {
  fetch(url)
    .then(res => res.blob())
    .then(file => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("cannot fetch img"));
};

const showLightbox = (name, img) => {
  ligntbox.querySelector("img").src = img;
  ligntbox.querySelector("span").innerText = name;
  ligntbox.classList.add("show");

  dowloadImgBtn.setAttribute("data-img", img);

  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  ligntbox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = images => {
  imagesWrapper.innerHTML += images
    .map(
      img =>
        `    <li class="card" onclick = "showLightbox('${img.photographer}' , '${img
          .src.large2x}')">
        <img src="${img.src.large2x}" alt="">

        <div class="details">
            <div class="photographer">
                <i class="fa-solid fa-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src
              .large2x}');event.stopPropagation();">
             <i class="fa-solid fa-download"></i> 
             </button>
        </div>


    </li>`
    )
    .join("");

  console.log(imagesWrapper);
};

const loadImg = () => {
  currentPag++;

  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPag}&per_page=${perPage}`;

  apiURL = searchterm ? apiURL + `&query=${searchterm}` : apiURL;

  getImages(apiURL);
};

const getImages = apiURL => {
  loadMoreImg.innerText = "Loading...";
  loadMoreImg.classList.add("disable");
  fetch(apiURL, {
    headers: {
      Authorization: apiKey
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // photos = data.photos
      generateHTML(data.photos);
      loadMoreImg.innerText = "Plus d'image";
      loadMoreImg.classList.remove("disable");
    })
    .catch(err => {
      alert("cannot fetch img");
    });
};

const loadSearchImages = e => {
  if (e.target.value == "") {
    return (searchInput = null);
  }

  if (e.key == "Enter") {
    searchterm = e.target.value;
    currentPag = 1;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchterm}&page=${currentPag}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPag}&per_page=${perPage}`
);

const addClassToggle = () => {
  navSide.classList.toggle("open");
  menuIcon.classList.toggle("fa-bars");
  menuIcon.classList.toggle("fa-xmark");
};

const closeSideMenu = () => {
  navSide.classList.remove("open");
};

loadMoreImg.addEventListener("click", loadImg);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
dowloadImgBtn.addEventListener("click", e =>
  downloadImg(e.target.getAttribute("data-img"))
);

menuFirst.addEventListener("click", addClassToggle);

iconClose.addEventListener("click", closeSideMenu);
