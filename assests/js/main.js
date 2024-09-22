// Scroll navbar
const navbar = document.querySelector('.navbar');
const headercontent = document.querySelector('.header-content');

window.addEventListener('scroll', function() {
  if (window.scrollY > headercontent.offsetTop) {
    navbar.style.backgroundColor = '#fff';
  } else {
    navbar.style.backgroundColor = 'transparent';
  }
});

let productsDOM = document.querySelector('.products');
let cartProductDOM = document.querySelector('.cart-items div');
let cartCount = 0; // To keep track of items in the cart

// Define product and cart variables as an array of objects
let products = [
  {
    id: 1,
    imageUrl:"assests/imges/image-waffle-desktop.jpg",
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.50,
    qty: 1
 },
 {
     id: 2,
     imageUrl:"assests/imges/image-creme-brulee-desktop.jpg",
     name: "Vanilla Bean Creme Brulee",
     category: "Creme Brulee",
     price: 7.00,
     qty: 1
  },
  {
     id: 3,
     imageUrl:"assests/imges/image-macaron-desktop.jpg",
     name: "Macaron Mix of Five",
     category: "Macaron",
     price: 8.00,
     qty: 1
  },
  {
     id: 4,
     imageUrl:"assests/imges/image-tiramisu-desktop.jpg",
     name:"Classic Tiramisu",
     category: "Tiramisu",
     price: 5.50,
     qty: 1
  },
  {
     id: 5,
     imageUrl:"assests/imges/image-baklava-desktop.jpg",
     name: "Pistachio Baklava",
     category: "Baklava",
     price: 4.00,
     qty: 1
  },
  {
     id: 6,
     imageUrl:"assests/imges/image-meringue-desktop.jpg",
     name: "Lemon Meringue Pie",
     category: "Pie",
     price: 5.00,
     qty: 1
  },
  {
     id: 7,
     imageUrl:"assests/imges/image-cake-desktop.jpg",
     name: "Red Velvet Cake",
     category: "Cake",
     price: 4.50,
     qty: 1
  },
  {
     id: 8,
     imageUrl:"assests/imges/image-brownie-desktop.jpg",
     name: "Salted Caramel Brownie",
     category: "Brownie",
     price: 4.50,
     qty: 1
  },
  {
     id: 9,
     imageUrl: "assests/imges/image-panna-cotta-desktop.jpg",
     name: "Vanilla Panna Cotta",
     category: "Panna Cotta",
     price: 6.50,
     qty: 1
  }
];

// Draw Products UI
function drawProductsUI() {
  let productsUI = products.map(item => {
    return `
      <div class="prod">
        <div class="image-container">
          <img src=${item.imageUrl} alt=${item.name}>
          <button id="actionButton" class="add-to-cart" onclick="addedToCart(${item.id})"><i class="fa fa-shopping-cart"></i>Add to Cart</button>
        </div>
        <p class="brown-color" id="item">${item.name}</p>
        <h4>${item.category}</h4>
        <p class="red">$${item.price.toFixed(2)}</p>
      </div>
      `;
  }).join(""); // Join the array of HTML strings
  productsDOM.innerHTML = productsUI;
}

drawProductsUI();

let allItems = [];

function addedToCart(id) {
  let choosenItem = products.find(item => item.id === id);
  let itemInCart = allItems.find(item => item.id === choosenItem.id);

  if (itemInCart) {
    itemInCart.qty += 1; // Increment quantity if item is already in the cart
  } else {
    allItems.push({ ...choosenItem, qty: 1 }); // Add new item to the cart using the spread operator
    localStorage.setItem('productsInCart', JSON.stringify(allItems));
  }

  cartCount++; // Increase cart count
  drawCartItems(); // Redraw the cart
}

// Draw Cart Items
function drawCartItems() {
  cartProductDOM.innerHTML = ""; // Clear the cart display
  let totalCartPrice = 0; 

  // Loop through all items in the cart and display them
  allItems.forEach(item => {
    let totalPriceForOneItem = item.qty * item.price;
    totalCartPrice += totalPriceForOneItem; 
    cartProductDOM.innerHTML += `
      <p>
        <span style="display: inline-block; font-size:15px;">${item.name}</span>
        <hr style="border: none; margin: 10px 0;"> 
        <span style="color:red">${item.qty} x</span> 
        <span style="margin-left: 20px;">$${item.price.toFixed(2)}</span>
        <span style="margin-left: 20px;">$${totalPriceForOneItem.toFixed(2)}</span>
        <button onclick="removeFromCart(${item.id})" style="color: red; margin-left: 20px;
         border-radius:60px; padding:2px 4px; border-width:1px; border-color:red; 
         background-color:white; float: right; margin-right: 20px;">
         <i class="fa-solid fa-xmark"></i></button>
        <hr>
      </p>`;
  });

  // Add the order total at the bottom of the cart
  cartProductDOM.innerHTML += `
    <p>
      <strong>Order Total:</strong>
      <span style="margin-left: 60px; font-size:20px;">$${totalCartPrice.toFixed(2)}</span>
      <button class="confirm-order" id="confirmOrderBtn" onclick="openConfirmWindow()" >confirm order</button> 
    </p>`;

  // Update cart count in the header
  document.querySelector('.item-num span').textContent = `(${cartCount})`;

  // Show the empty cart message and image if there are no items in the cart
  if (totalCartPrice === 0) {
    document.getElementById("empty-text").style.display = "block";
    document.getElementById("myImage").style.display = "block";
  } else {
    document.getElementById('empty-text').style.display = "none";
    document.getElementById("myImage").style.display = "none";
  }

  // Add event listener for the dynamically created 'Confirm Order' button
  document.querySelector('#confirmOrderBtn').addEventListener('click', () => {
    document.getElementById('orderConfirmedModal').style.display = 'flex'; // Show modal
  });
}

function removeFromCart(id) {
  let choosenItem = allItems.find(item => item.id === id);

  if (choosenItem.qty > 1) {
    choosenItem.qty -= 1; 
  } else {
    allItems = allItems.filter(item => item.id !== id); // Remove item from cart if qty is 1
  }

  cartCount--;

  // Update localStorage after removing an item
  localStorage.setItem('productsInCart', JSON.stringify(allItems));
  drawCartItems();
}

// Modal for confirming order
const modal = document.getElementById('orderConfirmedmodal');

function openConfirmWindow(){
  modal.style.display = 'flex'; 
  displayOrderSummary();
}

function closeConfirmwindow(){
  modal.style.display = 'none';
  allItems = []; // Clear all items in the cart
  cartCount = 0; // Reset cart count
  localStorage.removeItem('productsInCart'); // Clear local storage
  drawCartItems(); // Redraw cart items (which should be empty now)
}

// Close modal if clicked outside modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeConfirmwindow(); // Close modal
  }
});

// Display Order Summary
function displayOrderSummary(){
  let itemInCart = localStorage.getItem('productsInCart');
  let itemsDOM = document.getElementById('order-item'); 
  let totalPriceInConfirm = document.querySelector('.modal-total-price');
      
  if (itemInCart) {
    let desserts = JSON.parse(itemInCart); 
    drawCartProductsUI(desserts);
  }
      
  function drawCartProductsUI(products) {
    let total = 0;
    let productsUI = products.map((item) => {
      let itemTotal = item.qty * item.price;
      total += itemTotal; // Add to the total price
      return `
        <li style="display: flex; align-items: center; margin-bottom: 10px;">
          <img src="${item.imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
          <span style="flex-grow: 1;">${item.qty} x ${item.name} - $${itemTotal.toFixed(2)}</span>
        </li>
      `;
    }).join(""); 
  
    const itemsDOM = document.getElementById('order-item');
    const totalPriceInConfirm = document.querySelector('.modal-total-price');
  
    itemsDOM.innerHTML = productsUI; 
    totalPriceInConfirm.innerHTML = `Order Total: 
    <span style="font-weight: bold" >$${total.toFixed(2)}</span>`;

  }
}

// Check and display cart items from local storage on page load
(function CartItem(){
  let storedItems = localStorage.getItem('productsInCart') ?
    JSON.parse(localStorage.getItem('productsInCart')) : [];

  if (storedItems.length > 0) {
    allItems = storedItems;
    cartCount = storedItems.reduce((total, item) => total + item.qty, 0);
    drawCartItems(); // Redraw cart items if they exist in local storage
  }
})();
