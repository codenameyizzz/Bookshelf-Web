const RENDER_EVENT = "render-book";
const SAVE_EVENT = "save-book";
const MOVE_EVENT = "move-book";
const REMOVE_EVENT = "remove-book";
const STORAGE_IDENTIFIER = "BOOKSHELF_APPS";
const bookList = [];

const storageExists = () => {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung penyimpanan web");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const notFinishedBooks = document.getElementById("belumDibaca");
  notFinishedBooks.innerHTML = "";

  const finishedBooks = document.getElementById("sudahDibaca");
  finishedBooks.innerHTML = "";

  for (const bookItem of bookList) {
    const bookElement = createBookElement(bookItem);
    if (!bookItem.isComplete) {
      notFinishedBooks.append(bookElement);
    } else {
      finishedBooks.append(bookElement);
    }
  }
});

document.addEventListener(SAVE_EVENT, () => {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Disimpan!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(() => {
    customAlert.remove();
  }, 2000);
});

document.addEventListener(MOVE_EVENT, () => {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Dipindahkan!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(() => {
    customAlert.remove();
  }, 2000);
});

document.addEventListener(REMOVE_EVENT, () => {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Dihapus!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(() => {
    customAlert.remove();
  }, 2000);
});

const loadStorageData = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_IDENTIFIER));

  if (data !== null) {
    for (const item of data) {
      bookList.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveStorageData = () => {
  if (storageExists()) {
    const serializedData = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_IDENTIFIER, serializedData);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
};

const moveStorageData = () => {
  if (storageExists()) {
    const serializedData = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_IDENTIFIER, serializedData);
    document.dispatchEvent(new Event(MOVE_EVENT));
  }
};

const deleteStorageData = () => {
  if (storageExists()) {
    const serializedData = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_IDENTIFIER, serializedData);
    document.dispatchEvent(new Event(REMOVE_EVENT));
  }
};

const addNewBook = () => {
  const titleInput = document.getElementById("judul");
  const authorInput = document.getElementById("penulis");
  const yearInput = document.getElementById("tahun");
  const isReadInput = document.getElementById("isRead");
  let completionStatus;

  if (isReadInput.checked) {
    completionStatus = true;
  } else {
    completionStatus = false;
  }

  bookList.push({
    id: +new Date(),
    title: titleInput.value,
    author: authorInput.value,
    year: Number(yearInput.value),
    isComplete: completionStatus,
  });

  titleInput.value = null;
  authorInput.value = null;
  yearInput.value = null;
  isReadInput.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveStorageData();
};

const createBookElement = (book) => {
  const bookTitleElement = document.createElement("p");
  bookTitleElement.classList.add("item-title");
  bookTitleElement.innerHTML = `${book.title} <span>(${book.year})</span>`;

  const bookAuthorElement = document.createElement("p");
  bookAuthorElement.classList.add("item-writer");
  bookAuthorElement.innerText = `Penulis: ${book.author}`;

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("item-desc");
  descriptionContainer.append(bookTitleElement, bookAuthorElement);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("item-action");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(descriptionContainer);
  container.setAttribute("id", `book-${book.id}`);

  if (book.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-btn");
    undoButton.innerHTML = `<i class="uil uil-repeat"></i>`;

    undoButton.addEventListener("click", () => {
      returnBookToNotFinished(book.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("del-btn");
    deleteButton.innerHTML = `<i class="uil uil-trash"></i>`;

    deleteButton.addEventListener("click", () => {
      removeBook(book.id);
    });

    actionContainer.append(undoButton, deleteButton);
    container.append(actionContainer);
  } else {
    const finishButton = document.createElement("button");
    finishButton.classList.add("check-btn");
    finishButton.innerHTML = `<i class="uil uil-check"></i>`;

    finishButton.addEventListener("click", () => {
      markBookAsFinished(book.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("del-btn");
    deleteButton.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteButton.addEventListener("click", () => {
      removeBook(book.id);
    });

    actionContainer.append(finishButton, deleteButton);
    container.append(actionContainer);
  }

  return container;
};

const markBookAsFinished = (bookId) => {
  const targetBook = findBook(bookId);

  if (targetBook == null) return;

  targetBook.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveStorageData();
};

const returnBookToNotFinished = (bookId) => {
  const targetBook = findBook(bookId);

  if (targetBook == null) return;

  targetBook.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveStorageData();
};

const removeBook = (bookId) => {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  bookList.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteStorageData();
};

const findBook = (bookId) => {
  for (const book of bookList) {
    if (book.id === bookId) {
      return book;
    }
  }

  return null;
};

const findBookIndex = (bookId) => {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

document.addEventListener("DOMContentLoaded", () => {
  if (storageExists()) {
    loadStorageData();
  }

  const saveForm = document.getElementById("formDataBuku");
  saveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addNewBook();
  });

  const searchForm = document.getElementById("formSearch");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });

  const resetButton = document.querySelector(".reset-btn");
  resetButton.addEventListener("click", () => {
    document.getElementById("pencarian").value = "";
    searchBook();
  });
});

const searchBook = () => {
  const searchQuery = document.getElementById("pencarian").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");

  for (let i = 0; i < bookItems.length; i++) {
    const bookTitle = bookItems[i].querySelector(".item-title");
    if (bookTitle.textContent.toLowerCase().includes(searchQuery)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
};
