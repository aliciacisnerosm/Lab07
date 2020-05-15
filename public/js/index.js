const apiKey = '2abbf7c3-245b-404f-9473-ade729ed4653';

function fetchListBookmarks() {
  let url = '/bookmarks';
  let settings = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  fetch(url, settings)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then((responseJson) => {
      const results = document.getElementById('allBookmarks');
      results.innerHTML = ``;
      for (let i = 0; i < responseJson.length; i++) {
        results.innerHTML += `<div class="bookmark-style">
                              <div>Title: ${responseJson[i].title}</div>
                              <div>ID: ${responseJson[i].id}</div>
                              <div>Description: ${responseJson[i].description}</div>
                              <div>Rating: ${responseJson[i].rating}</div>
                              <div>Url: ${responseJson[i].url}</div>
                              </div>`;
      }
    })
    .catch((err) => {
      let results = document.getElementById('allBookmarks');
      results.innerHTML = ``;
      results.innerHTML = `<div>${err.message}</div>`;
    });
}
function fetchGetBookmarkTitle(title) {
  let url = `/bookmark?title=${title}`;

  let settings = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  fetch(url, settings)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then((responseJson) => {
      let results = document.getElementById('get-by-title');
      results.innerHTML = ``;

      for (let i = 0; i < responseJson.length; i++) {
        results.innerHTML += `<div class="bookmark-style">
                              <div>Title: ${responseJson[i].title}</div>
                              <div>ID: ${responseJson[i].id}</div>
                              <div>Description: ${responseJson[i].description}</div>
                              <div>Rating: ${responseJson[i].rating}</div>
                              <div>Url: ${responseJson[i].url}</div>
                              </div>`;
      }
    })
    .catch((err) => {
      let results = document.getElementById('get-by-title');
      results.innerHTML = ``;
      results.innerHTML = `<div>${err.message}</div>`;
    });
}
function fetchdeleteBookmark(id) {
  let url = `/bookmark/${id}`;

  let settings = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };
  let results = document.getElementById('delete-div');
  results.innerHTML = ``;
  fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        results.innerHTML += `Bookmark with id = ${id} was deleted!`;
        fetchListBookmarks();
      }
      throw new Error(response.statusText);
    })
    .catch((err) => {
      let results = document.getElementById('delete-div');
      results.innerHTML += `<div>${err.message}</div>`;
      console.log('chale2');
    });
}

function fetchAddBookmarks(title, description, rating, url) {
  let link = '/bookmarks';

  let newBookmark = {
    title: title,
    description: description,
    url: url,
    rating: Number(rating),
  };

  let settings = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBookmark),
  };
  fetch(link, settings)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then((responseJson) => {
      let results = document.getElementById('post-result');
      results.innerHTML = ``;

      results.innerHTML += ` <div class="bookmark-style">
                              <div>Title: ${responseJson.title}</div>
                              <div>Description: ${responseJson.description}</div>
                              <div>Rating: ${responseJson.rating}</div>
                              <div>Url: ${responseJson.url}</div>`;
      fetchListBookmarks();
    })
    .catch((err) => {
      let results = document.getElementById('post-result');
      results.innerHTML = ``;
      results.innerHTML = `<div>${err.message}</div>`;
    });
}

function fetchPatchBookmarks(bookmark, id) {
  let url = `/bookmark/${id}`;

  let settings = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookmark),
  };
  fetch(url, settings)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then((responseJson) => {
      let results = document.getElementById('patch-result');
      results.innerHTML = ``;
      results.innerHTML += ` <div class="bookmark-style">
                              <div>Title: ${responseJson.title}</div>
                              <div>Description: ${responseJson.description}</div>
                              <div>Rating: ${responseJson.rating}</div>
                              <div>Url: ${responseJson.url}</div>
                              </div>`;
      fetchListBookmarks();
    })
    .catch((err) => {
      let results = document.getElementById('patch-result');
      results.innerHTML = ``;
      results.innerHTML = `<div>${err.message}</div>`;
    });
}

function watchPatchBookmarks() {
  var formpatchBookmarks = document.querySelector('.form-patch-bookmarks');
  formpatchBookmarks.addEventListener('submit', (event) => {
    event.preventDefault();

    let title = document.getElementById('patch-title').value;
    let description = document.getElementById('patch-description').value;
    let rating = document.getElementById('patch-rating').value;
    let url = document.getElementById('patch-url').value;
    let id = document.getElementById('patch-id').value;
    let params = {};
    params['id'] = id;
    if (title) {
      params['title'] = title;
    }
    if (description) {
      params['description'] = description;
    }
    if (rating) {
      params['rating'] = rating;
    }
    if (url) {
      params['url'] = url;
    }
    console.log(params);
    fetchPatchBookmarks(params, id);
  });
}

function watchGetBookmarks() {
  var formGetBookmarks = document.querySelector('.form-get-bookmarks');
  fetchListBookmarks();
}
function watchPostBookmarks() {
  var formPostBookmarks = document.querySelector('.form-post-bookmarks');
  formPostBookmarks.addEventListener('submit', (event) => {
    event.preventDefault();

    let title = document.getElementById('bookmarksTitle').value;
    let description = document.getElementById('bookmarksDescription').value;
    let rating = document.getElementById('bookmarksrRating').value;
    let url = document.getElementById('bookmarksUrl').value;

    fetchAddBookmarks(title, description, rating, url);
  });
}

function watchGetByTitle() {
  var formPostBookmarks = document.querySelector('.form-get-title-bookmarks');
  formPostBookmarks.addEventListener('submit', (event) => {
    event.preventDefault();
    var title = document.getElementById('bookmarks-title').value;
    fetchGetBookmarkTitle(title);
  });
}
function watchDelete() {
  var formPostBookmarks = document.querySelector('.form-delete-bookmarks');
  formPostBookmarks.addEventListener('submit', (event) => {
    event.preventDefault();
    var id = document.getElementById('delete-id').value;
    fetchdeleteBookmark(id);
  });
}

function init() {
  watchGetBookmarks();
  watchPostBookmarks();
  watchGetByTitle();
  watchDelete();
  watchPatchBookmarks();
}

init();
