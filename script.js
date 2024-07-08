//for swiping product images left/right
const galleries = document.querySelectorAll('.gallery');
let currentIndices = Array(galleries.length).fill(0);

function showImage(galleryIndex, imageIndex) {
  const gallery = galleries[galleryIndex];
  const images = gallery.querySelectorAll('.gallery-image');
  if (imageIndex >= images.length) {
    currentIndices[galleryIndex] = 0;
  } else if (imageIndex < 0) {
    currentIndices[galleryIndex] = images.length - 1;
  } else {
    currentIndices[galleryIndex] = imageIndex;
  }
  const offset = -currentIndices[galleryIndex] * 100;
  gallery.style.transform = `translateX(${offset}%)`;
}

function nextImage(galleryIndex) {
  showImage(galleryIndex - 1, currentIndices[galleryIndex - 1] + 1);
}

function prevImage(galleryIndex) {
  showImage(galleryIndex - 1, currentIndices[galleryIndex - 1] - 1);
}

// Initialize the galleries by showing the first image of each
galleries.forEach((_, index) => showImage(index, 0));

//Updating Cart counter whenever products are added
let cart = [];

function addToCart(product) {
    cart.push(product);
    updateCartCounter();
    saveCart();
}

function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    cartCounter.textContent = cart.length;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCounter();
    }
}
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
          const product = {
              name: button.parentElement.querySelector('h3').textContent,
              price: button.parentElement.querySelector('p').textContent,
              image: button.parentElement.querySelector('img').src
          };
          addToCart(product);
      });
  });
});

// Function to add product to cart
function addToCart(event) {
  const product = event.target.closest('.product');
  const productId = product.dataset.id;
  const productName = product.dataset.name;
  const productPrice = parseFloat(product.dataset.price);
  const productImage = product.dataset.image;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingProduct = cart.find(item => item.id === productId);
  if (existingProduct) {
      existingProduct.quantity += 1;
  } else {
      cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1
      });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${productName} has been added to your shopping bag.`);
}

// Function to display cart items
function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>Quantity: ${item.quantity}</p>
              <p>Price: ${item.price} PKR</p>
          </div>
      `;
      cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = total;
}

// If on cart page, display cart items
if (window.location.pathname.includes('cart.html')) {
  displayCartItems();
}

// Function to empty the cart
function emptyCart() {
  localStorage.removeItem('cart');
  displayCartItems();
  alert('Shopping bag has been emptied.');
}

// Attach event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', addToCart);
});

if (window.location.pathname.includes('cart.html')) {
  displayCartItems();
  document.getElementById('empty-cart').addEventListener('click', emptyCart);
  document.getElementById('checkout').addEventListener('click', checkout);
}

//Function for Checkout 
function checkout() {
  const paymentMethod = document.getElementById('payment-method').value;
  alert(`Order has been placed with ${paymentMethod}.`);
  localStorage.removeItem('cart'); // Empty the cart after checkout
  displayCartItems(); 
}