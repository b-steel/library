'use strict';

function Book(
    title = 'Unknown', 
    author = 'Unknown', 
    isRead = false
    ) {
    this.title = title;
    this.author = author;
    this.isRead = isRead;
} 
Book.prototype.addToLibrary = function () {
    myLibrary.push(this);
    const card = new BookCard(this);
    libraryContainer.appendChild(card.element);
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

function BookCard (book) {
    this.book = book
    this.element = document.createElement('div');
    this.title = document.createElement('h3');
    this.author = document.createElement('h3');
    this.read = document.createElement('h4');
    this.buttonContainer = document.createElement('div');
    this.removeBtn = document.createElement('button')
    this.toggleReadBtn = document.createElement('button');

    this.element.classList.add('book');
    this.element.dataset.title = book.title;
    this.buttonContainer.classList.add('button-container');
    this.buttonContainer.append(this.removeBtn, this.toggleReadBtn);
    this.title.classList.add('title');
    this.author.classList.add('author');
    this.read.classList.add('is-read');
    this.removeBtn.classList.add('btn-warn');
    this.toggleReadBtn.classList.add('btn-toggle');

    this.title.textContent = book.title;
    this.author.textContent = book.author;
    this.read.textContent = book.isRead ? 'Read' : 'Unread';
    this.removeBtn.textContent = '×';
    this.toggleReadBtn.textContent = book.isRead ? 'Mark Unread' : 'Mark Read';

    this.element.append(this.title, this.author, this.read, this.buttonContainer);

    this.removeBtn.addEventListener('click', this.removeBook);
    this.toggleReadBtn.addEventListener('click', this.toggleRead)
}
BookCard.prototype.removeBook = function () {
    let index = myLibrary.findIndex(elem => elem === this.book);
    myLibrary.splice(index, 1);
    localStorage.setItem('library', JSON.stringify(myLibrary));
    libraryContainer.removeChild(this.parentElement.parentElement)
};
BookCard.prototype.toggleRead = function () {
    const bookCard = this.parentElement.parentElement
    const book = getBook(bookCard.dataset.title)
    let status = book.isRead;
    book.isRead = !status;
    bookCard.querySelector('.is-read').textContent = status ? 'Unread' : 'Read';;
    bookCard.querySelector('.btn-toggle').textContent = 'Mark '+(status?'Read':'Unread');

};
function getBook(bookTitle) {
    return myLibrary.find(book => book.title === bookTitle)
}
function addBookToLibrary(title, author, isRead) {
    if (!myLibrary.some(book => book.title === title)) {
        const book = new Book(title, author, isRead);
        book.addToLibrary()
        return true
        }
    return false
}


// SX Modal 
const modalBtn = document.querySelector("#modal-btn");
const modal = document.querySelector(".modal"); // This is the modal background, not the content
const closeBtn = document.querySelector(".close-btn");
// show modal
modalBtn.onclick = function () {
    modal.style.display = "block";
};
// close modal 
closeBtn.onclick = function () {
    modal.style.display = "none";
};
// close modal when clicking outside
window.onclick = function (e) {
    if(e.target == modal) {
        modal.style.display = "none";
    }
}
// Create book
const addBookBtn = modal.querySelector('button#add-book-btn');
addBookBtn.addEventListener('click', handleModalSubmit);

function handleModalSubmit () {
    let title = document.querySelector('#title-inpt').value;
    let author = document.querySelector('#author-inpt').value;
    let isRead = document.querySelector('#is-read-inpt').checked;
    let titleValid = validateTitle(title);
    let authorValid = validateAuthor(author);
    if (titleValid && authorValid) {
        let success = addBookToLibrary(title, author, isRead);
        if (success) {modal.style.display = "none"}
    };
}
function validateTitle (title) {
    let errorMessage;
    const errorElem = document.querySelector('#title-error');
    let regex = new RegExp(title, 'gi');
    if (myLibrary.find(book => {
        return book.title.match(regex)
    })) {
        errorMessage = 'That book is already in the Library';
        errorElem.textContent = errorMessage;
        return false
    }
    else if (!(title.length) > 0) {
        errorMessage = 'Title cannot be empty';
        errorElem.textContent = errorMessage;
        return false 
    }
    return true
}
function validateAuthor (author) {
    let errorMessage;
    const errorElem = document.querySelector('#author-error');
    if (!author) {
        errorMessage = 'Author cannot be empty';
        errorElem.textContent = errorMessage;
        return false
    }
    return true
}
// SX Variables and Utilities
var myLibrary = [];
const libraryContainer = document.querySelector('.library-container');
if(!localStorage.getItem('library')) {
    populateLocalStorage();
} else {
    myLibrary = updateFromLocalStorage();
    renderLibraryOnLoad();
}
function populateLocalStorage() {
    localStorage.setItem('library', JSON.stringify(myLibrary));
}
function updateFromLocalStorage () {
    return JSON.parse(localStorage.getItem('library'));
}
function renderLibraryOnLoad () {
    myLibrary.forEach(book => {
        const card = new BookCard(book);
        libraryContainer.appendChild(card.element)
    });
}

// document.querySelector('#load').addEventListener('click', renderLibraryOnLoad);
// // SX Utilities for Testing
// let bookOne = addBookToLibrary('the Hobbit', 'JRR Tolkein', true)
// let bookTwo = addBookToLibrary('Parable of the Sower', 'Octavia Butler', false);
// let bookThree = addBookToLibrary('War and Piece', 'Someone', false);
// let bookFour = addBookToLibrary('Lolita', 'Another person', true);
// let bookFive = addBookToLibrary('Joy of Cooking', 'Everyone', false);
// let bookSix = addBookToLibrary('Dune', 'Frank Herbert', true);