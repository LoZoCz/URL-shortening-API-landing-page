const linkInp = document.querySelector(".link-inp");
const linkBtn = document.querySelector(".link-btn");
const sideBarBtn = document.querySelector(".side-bar-btn");
const linksBox = document.querySelector(".shorten-links-wrapper");

let linkIndex = 1;

function linkAPI(link) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.shrtco.de/v2/shorten?url=${link}`)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

async function shortingLink(e) {
  try {
    e.preventDefault();

    let userLink = linkInp.value;
    const newLink = await linkAPI(userLink);

    if (userLink == "" || newLink.ok == false) {
      linkInp.classList.toggle("link-inp-error");
      return;
    }

    linkInp.classList.remove("link-inp-error");

    let newLinkBox = document.createElement("div");
    newLinkBox.classList.add("new-link");
    newLinkBox.classList.add(`link-${linkIndex}`);
    newLinkBox.innerHTML = `
        <p class="original-link">${userLink}</p>
        <div class="shorten-link-n-btns">
          <p class="shorten-link">${newLink.result.full_short_link}</p>
          <button class="copy-btn btn">Copy</button>
        </div>`;

    linksBox.appendChild(newLinkBox);
    linkIndex++;

    const copyBtns = document.querySelectorAll(".copy-btn");
    const shortLinks = document.querySelectorAll(".shorten-link");
    for (let i = 0; i < copyBtns.length; i++) {
      copyBtns[i].addEventListener("click", () => {
        const navigator = window.navigator;
        navigator.clipboard.writeText(shortLinks[i].textContent);
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

linkBtn.addEventListener("click", shortingLink);

sideBarBtn.addEventListener("click", () => {
  let sideBarState = sideBarBtn.getAttribute("aria-pressed");
  const sideBar = document.querySelector(".options-n-log-wrapper");

  if (sideBarState == "false") {
    sideBarBtn.setAttribute("aria-pressed", "true");
    sideBar.style.display = "flex";
  } else {
    sideBarBtn.setAttribute("aria-pressed", "false");
    sideBar.style.display = "none";
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
      sideBar.style.display = "flex";
    } else {
      sideBar.style.display = "none";
    }
  });
});
