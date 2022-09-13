// localStorage.setItem('products', JSON.stringify([]));
// localStorage.setItem('users', JSON.stringify([]));
// localStorage.setItem('sales', JSON.stringify([]));
// JSON.parse(localStorage.getItem('products'));
// localStorage.removeItem('products');
// localStorage.clear();

// JSON.stringify(): JS -> JSON
// JSON.parse(): JSON -> JS

// localStorage CRUD
// localStorage(products: [])

function initStorage(){
    if(!localStorage.getItem('products-data')){
      localStorage.setItem('products-data', '[]');  
    };
};
initStorage();

function setProductsToStorage(products){
    localStorage.setItem('products-data', JSON.stringify(products));
};

function getProductsFromStorage(){
    let products = JSON.parse(localStorage.getItem('products-data'));
    return products;
};

let isSave = false;
function changeIsSave(){
    let saveChangesBtn = document.querySelector('.save-changes-btn');
    let addProductBtn = document.querySelector('#add-product-btn');
    if(!isSave){ 
        saveChangesBtn.style.display = 'none';
        addProductBtn.style.display = 'block';
    }else{
        saveChangesBtn.style.display = 'block';
        addProductBtn.style.display = 'none';
    };
};
changeIsSave();

function render(data=getProductsFromStorage()){
    let container = document.querySelector('.container');
    container.innerHTML = '';
    data.forEach((item, index) => {
        container.innerHTML += `
            <div class="card" style="width: 18rem;" id="${index}">
                <img src="${item.url}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text"><b>Price:</b> ${item.price}</p>
                    <a href="#" class="btn btn-danger" id="delete-product-btn">Delete</a>
                    <a href="#" class="btn btn-success" id="update-product-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Update</a>
                </div>
            </div>
        `;
    });

    if(data.length === 0) return;
    addDeleteEvent();
    addUpdateEvent();
};

render();

// create
function createProduct(){
    let imgInp = document.querySelector('#product-url-inp');
    let titleInp = document.querySelector('#product-title-inp');
    let priceInp = document.querySelector('#product-price-inp');

    if(!imgInp.value.trim() || !titleInp.value.trim() || !priceInp.value.trim()){
        alert('Some inputs are empty!');
        return;
    };

    let productObj = {
        url: imgInp.value,
        title: titleInp.value,
        price: priceInp.value
    };

    let products = getProductsFromStorage();
    products.push(productObj);
    setProductsToStorage(products);

    imgInp.value = '';
    titleInp.value = '';
    priceInp.value = '';

    render();
};

let addProductBtn = document.querySelector('#add-product-btn');
addProductBtn.addEventListener('click', createProduct);

// delete
function deleteProduct(e){
    let productId = e.target.parentNode.parentNode.id;
    let products = getProductsFromStorage();
    products.splice(productId, 1);
    setProductsToStorage(products);
    render();
};

function addDeleteEvent(){
    let deleteBtns = document.querySelectorAll('#delete-product-btn');
    deleteBtns.forEach(item => item.addEventListener('click', deleteProduct));
};

// update
let imgInp = document.querySelector('#product-url-inp');
let titleInp = document.querySelector('#product-title-inp');
let priceInp = document.querySelector('#product-price-inp');
let saveChangesBtn = document.querySelector('.save-changes-btn');

function getOneProductById(id){
    let productObj = getProductsFromStorage()[+id];
    return productObj;
};

function saveChanges(e){
    if(!saveChangesBtn.id) return;
    let products = getProductsFromStorage();
    let productObj = products[+saveChangesBtn.id];
    productObj.url = imgInp.value;
    productObj.title = titleInp.value;
    productObj.price = priceInp.value;
    setProductsToStorage(products);
    saveChangesBtn.removeAttribute('id');
    imgInp.value = '';
    titleInp.value = '';
    priceInp.value = '';
    isSave = false;
    changeIsSave();
    render();
};

let changeSave = document.querySelector('.change-is-save');
changeSave.addEventListener('click', () => {
    isSave = false;
    changeIsSave();
});

function updateProduct(e){
    let productId = e.target.parentNode.parentNode.id;
    let productObj = getOneProductById(productId);
    imgInp.value = productObj.url;
    titleInp.value = productObj.title;
    priceInp.value = productObj.price;
    isSave = true;
    changeIsSave();
    saveChangesBtn.addEventListener('click', saveChanges);
    saveChangesBtn.setAttribute('id', productId);
};

function addUpdateEvent(){
    let updateBtns = document.querySelectorAll('#update-product-btn');
    updateBtns.forEach(item => item.addEventListener('click', updateProduct));
};

// search
let searchInp = document.querySelector('#search-inp');
searchInp.addEventListener('input', (e) => {
    let products = getProductsFromStorage();
    products = products.filter(item => {
        return item.title.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    });
    render(data=products);
});