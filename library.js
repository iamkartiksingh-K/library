const addBookBtn = document.querySelector("#form-control");
const form = document.querySelector(".form");
const editForm = document.querySelector(".edit-form");
const controls = form.querySelector(".controls");
const editControls = editForm.querySelector(".controls");
const cardContainer = document.querySelector(".card-container");
const inputs = [...form.querySelectorAll(".form .field input")];
const newDetails = [...editForm.querySelectorAll(".field input")];

let selectedToEdit = "";
const library = [
	{
		title: "Harry Potter and the philosopher's stone",
		author: "JK Rowling",
		read: true,
		cover: "https://m.media-amazon.com/images/I/71u-cpucTRL._AC_UF1000,1000_QL80_.jpg",
		id: "lj00lv7epn6f0xzywn",
	},
	{
		title: "Harry Potter and the chamber of secrets",
		author: "JK Rowling",
		read: true,
		cover: "https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg",
		id: "lj00m5eytas90el6oqc",
	},
	{
		title: "Harry Potter and prisonar of Azkaban",
		author: "JK Rowling",
		read: true,
		cover: "https://m.media-amazon.com/images/I/51n7uF9FfxL.jpg",
		id: "lj00mg7ua0gvnkbdc1",
	},
	{
		title: "Harry Potter and the Half Blood Prince",
		author: "JK Rowling",
		read: true,
		cover: "https://m.media-amazon.com/images/I/51ibZl+yt8L.jpg",
		id: "lj00mm9rqr8w6t42h6g",
	},
	{
		title: "Harry Potter and the Goblet of Fire",
		author: "JK Rowling",
		read: true,
		cover: "https://m.media-amazon.com/images/I/51UPokab7LL._AC_UF1000,1000_QL80_.jpg",
		id: "lj00myx4tb0w3q96e2o",
	},
];
addBookBtn.addEventListener("click", () => {
	form.classList.add("show");
});

controls.addEventListener("click", ({ target }) => {
	if (target.id === "cancel") {
		form.classList.remove("show");
		clearForm();
	}
	if (target.id === "save") {
		const values = inputs.map((input) => {
			if (input.type === "checkbox") return input.checked;
			return input.value;
		});
		if (values[0] && values[1]) {
			addBookToLibrary(new Book(...values, getUniqueID()));
			form.classList.remove("show");
			clearForm();
		}
	}
});
editControls.addEventListener("click", ({ target }) => {

	if (target.id === "cancel-changes") {
		editForm.classList.remove("show");
	}
	if (target.id === "save-changes") {
		const values = newDetails.map((input) => {
			if (input.type === "checkbox") return input.checked;
			return input.value;
		});
		editBook(...values);
	}
});
function getIndex(id) {
	for (let i = 0; i < library.length; i++) {
		if (library[i].id === id) return i;
	}
	return -1;
}

cardContainer.addEventListener("click", ({ target }) => {
	if (target.id === "delete") {
		let card = target.parentElement.parentElement;
		let index = getIndex(card.getAttribute("data"));
		card.remove();
		library.splice(index, 1);
	}
	if (target.classList.contains("status")) {
		const card = target.parentElement.parentElement.parentElement;
		let index = getIndex(card.getAttribute("data"));
		if (target.classList.contains("is-success")) {
			target.classList.remove("is-success");
			target.classList.add("is-black");
			target.innerText = "Not Read";
			library[index].read = false;
		} else {
			target.classList.remove("is-black");
			target.classList.add("is-success");
			target.innerText = "Read";
			library[index].read = true;
		}
	}
	if (target.id === "edit") {
		const card = target.parentElement.parentElement;
		editForm.classList.add("show");
		selectedToEdit = card.getAttribute("data");
		let index = getIndex(selectedToEdit);
		newDetails[0].value = library[index].title;
		newDetails[1].value = library[index].author;
		newDetails[2].value = library[index].cover;
	}
});
function editBook(title, author, cover, read) {
	let index = getIndex(selectedToEdit);
	const card = cardContainer.querySelector(`[data=${selectedToEdit}]`)
	const book = library[index];
	book.title = title;
	book.author = author;
	book.cover = cover;
	book.read = read;
	card.querySelector('img').src = cover;
	card.querySelector('.title').innerText = title;
	card.querySelector('.subtitle').innerText =`by ${author}`;
	editForm.classList.remove("show");
}
function getUniqueID() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function clearForm() {
	for (let input of inputs) {
		input.value = input.defaultValue;
		if (input.checked) input.checked = false;
	}
}

function Book(title, author, cover, read, id) {
	this.title = title;
	this.author = author;
	this.read = read;
	this.cover = cover;
	this.id = id;
}

function addBookToLibrary(book) {
	const card = makeCard(book);
	card.setAttribute("data", book.id);
	library.push(book);
	cardContainer.append(card);
}

function makeCard(book) {
	const card = document.createElement("div");
	card.classList.add("card", "mb-4");
	card.setAttribute("data", book.id);
	card.innerHTML = `<div class="card-image">
                        <figure class="image is-4by3">
                            <img src="${book.cover}"
                                alt="Book cover">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <p class="title is-4">${book.title}</p>
                            <p class="subtitle is-6">by ${book.author}</p>
                            <button class="button status ${
								book.read ? "is-success" : "is-black"
							}">${book.read ? "Read" : "Not Read"}</button>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item has-text-weight-semibold" id="edit">Edit</a>
                        <a href="#" class="card-footer-item has-text-danger-dark has-text-weight-semibold" id="delete">Delete</a>
                    </footer>`;
	return card;
}

function init() {
	for (let book of library) {
		const card = makeCard(book);
		cardContainer.append(card);
	}
}
init();
