let postsRow = document.querySelector('.product');
let postSearchInput = document.querySelector('.nav__input');
let pagination = document.querySelector('.pagination');
let formSelect = document.querySelector('.form-select');

let postSearch = '';
let activePage = 1;
let globalValue = formSelect.value;

function getPostCard({ name, flags, area }) {
  return `
    <div class="product__list">
      <img class="product__img" src="${flags.png}" alt="" />
      <a href="info.html?comment=${area}" class="product__viewBtn">${name.common}</a>
    </div>
  `;
}

async function getPosts() {
  postsRow.innerHTML = '...Loading';
  try {
    let url;

    if (globalValue === '/all') {
      url = 'https://restcountries.com/v3.1/all';
    } else {
      url = `https://restcountries.com/v3.1${globalValue}`;
    } if (globalValue === '/region/africa') {
      postsRow.innerHTML = '<div>АФРИКА ВРЕМЕННО НЕДОСТУПЕН</div>'
      pagination.innerHTML = ''
    }

    if (postSearch) {
      url = `https://restcountries.com/v3.1/name/${postSearch}`;
    }

    let postsWithPagination = await getData(url);

    let pages = Math.ceil(postsWithPagination.length / 20);

    pagination.innerHTML = '';

    if (pages > 1) {
      pagination.innerHTML += `
        <li class="page-item ${activePage === 1 ? 'disabled' : ''}">
          <button onClick="getPage(${activePage - 1})" class="page-link">Previous</button>
        </li>
      `;

      for (let i = 1; i <= pages; i++) {
        pagination.innerHTML += `
          <li class="page-item ${i === activePage ? 'active' : ''}">
            <button onClick="getPage(${i})" class="page-link">${i}</button>
          </li>
        `;
      }

      pagination.innerHTML += `
        <li class="page-item ${activePage === pages ? 'disabled' : ''}">
          <button onClick="getPage(${activePage + 1})" class="page-link">Next</button>
        </li>
      `;
    }

    postsRow.innerHTML = '';

    let startIndex = (activePage - 1) * 20;
    let endIndex = activePage * 20;
    let posts = postsWithPagination.slice(startIndex, endIndex);

    posts.forEach((post) => {
      postsRow.innerHTML += getPostCard(post);
    });
  } catch (err) {
    console.log(err);
  }
}

getPosts();

postSearchInput.addEventListener('keyup', function (e) {
  e.preventDefault();
  activePage = 1;
  postSearch = this.value.trim();
  getPosts();
});

formSelect.addEventListener('change', function (e) {
  e.preventDefault();
  activePage = 1;
  globalValue = this.value;
  getPosts();
});

function getPage(page) {
  activePage = page;
  getPosts();
}