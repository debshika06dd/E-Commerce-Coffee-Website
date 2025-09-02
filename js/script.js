let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}


document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}



// Assume products have the following structure
let products = [
    { id: 1, name: 'Arabica', price: 550, image: '../images/product-1.png' },
    { id: 2, name: 'Robusta', price: 350, image: '../images/product-2.jpg' },
    { id: 3, name: 'Liberica', price: 800, image: '../images/product-3.png' },
    { id: 4, name: 'Excelsa', price: 1000, image: '../images/product-4.png' },
    { id: 5, name: 'Estate-Grown Beans', price: 700, image: '../images/product-5.png' },
    { id: 6, name: 'Shade-Grown Coffee', price: 700, image: '../images/product-6.png' },
    { id: 7, name: 'espresso', price: 220, image: '../images/espresso.jpg' },
    { id: 8, name: 'Cappuccino', price: 230, image: '../images/Cappuccino.jpg' },
    { id: 9, name: 'Latte', price: 230, image: '../images/Latte.jpg' },
    { id: 10, name: 'Americano', price: 210, image: '../images/Americano.jpg' },
    { id: 11, name: 'Cold brew', price: 250, image: '../images/Cold Brew.jpg' },
    { id: 12, name: 'Indian Filter Coffee', price: 80, image: '../images/Indian Filter Coffee.jpg' }
];

// Cart array to hold the added products
let cart = [];

//change 1:
// Save and load cart using localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
        updateCartCount();
    }
}
//----xxxxx----
//changed till this

//Wishlist array to hold the added products
let wishlistItems = [];
const heartBtn = document.getElementById('heart-btn');
const wishlistBox = document.getElementById('wishlist-box');
const wishlistContent = document.getElementById('wishlist-content');
const wishlistCount = document.getElementById('wishlist-count');



// Function to update the cart count
function updateCartCount() {
    let cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Set the text content to the number of items in the cart
        // cartCountElement.textContent = cart.length;
        // Update cart count based on the total number of items in the cart
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}


//Function to update the wishlist count
function updateWishlistCount() {
    let wishlistCountElement = document.getElementById('wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlistItems.length;
    }
}


//Toggle wishlist box
heartBtn.addEventListener('click', () => {
    wishlistBox.style.display = wishlistBox.style.display === 'none' ? 'block' : 'none';
});



//Add to Wishlist Function (call this on "Add to Wishlist" button in product cards):
function addToWishlist(product) {
    // prevent duplicates
    if (!wishlistItems.find(item => item.id === product.id)) {
        wishlistItems.push(product);
        updateWishlist();
    }
}




//Update Wishlist DOM:
function updateWishlist() {
    wishlistContent.innerHTML = '';
    wishlistItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name}</span>
            <button class="add-to-cart-btn" onclick="moveToCart(${item.id})">Add to Cart</button>
        `;
        wishlistContent.appendChild(div);
    });
    wishlistCount.innerText = wishlistItems.length;
}


//Move to Cart Function:
function moveToCart(productId) {
    const product = wishlistItems.find(item => item.id === productId);
    if (product) {
        addToCart(productId); // move to cart

        // Remove from wishlist
        wishlistItems = wishlistItems.filter(item => item.id !== productId);
        updateWishlist();
        updateWishlistCount();

        // Change heart icon color to white
        const heartIcon = document.querySelector(`.add-to-wishlist[data-id="${productId}"]`);
        if (heartIcon) {
            heartIcon.classList.remove('wishlist-added');
            heartIcon.style.color = '';
        }
    }
}







// Function to add product to the cart
function addToCart(dataid) {
    // Find product by ID
    let product = products.find(p => p.id === parseInt(dataid));

    // If product exists, add to cart
    if (product) {
        let cartItem = cart.find(item => item.id === product.id);

        // If item is already in the cart, increase quantity
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Update the cart display
        updateCartDisplay();
        updateCartCount();
        saveCart(); // ✅ added this
    }
}

// Function to update the cart display dynamically
function updateCartDisplay() {
    let cartItemList = document.querySelector('.cart-item-list');
    if (!cartItemList) return; // If cart-item-list doesn't exist, skip

    cartItemList.innerHTML = ''; // Clear the list before re-rendering

    let totalPrice = 0;

    cart.forEach(item => {
        // Create a div for each cart item
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        // Create an image element for the product
        let itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name; // Use the product name as alt text
        itemImage.classList.add('cart-item-image'); // Add a class for styling the image

        // Add image to the div
        itemDiv.appendChild(itemImage);

        // Create and append the product name, quantity, price, and remove button
        let nameSpan = document.createElement('span');
        nameSpan.textContent = `${item.name} x ${item.quantity}`;
        itemDiv.appendChild(nameSpan);

        let priceSpan = document.createElement('span');
        priceSpan.textContent = `₹${(item.price * item.quantity).toFixed(2)}`;
        itemDiv.appendChild(priceSpan);

        // Create and append the remove button
        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeFromCart(item.id);
        itemDiv.appendChild(removeButton);

        // Append the item div to the cart item list
        cartItemList.appendChild(itemDiv);

        // Add to total price
        totalPrice += item.price * item.quantity;
    });

    //Function for rendering again after increasing or decreasing the product quantity
    function renderCart() {
    const cartList = document.querySelector('.cart-item-list');
    cartList.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-id', item.id);

        cartItem.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-price">₹${item.price}</span>
            <div class="quantity-controls">
                <button class="decrease-qty" data-index="${index}">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="increase-qty" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">x</button>
        `;

        cartList.appendChild(cartItem);
    });

    updateCartTotal();
    attachQuantityEventListeners(); // Attach dynamic event listeners after rendering
}

//JavaScript to Handle Quantity Increase/Decrease
function attachQuantityEventListeners() {
    const increaseButtons = document.querySelectorAll('.increase-qty');
    const decreaseButtons = document.querySelectorAll('.decrease-qty');
    const removeButtons = document.querySelectorAll('.remove-item');

    increaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            cart[index].quantity += 1;
            renderCart();
            saveCart(); // ✅ added this
        });
    });

    decreaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1); // remove if quantity is 0
            }
            renderCart();
        });
    });

    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            cart.splice(index, 1);
            renderCart();
        });
    });
}


function updateCartTotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = total.toFixed(2);
}


    // Update the total price dynamically
    let totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}


// Function to remove product from the cart
function removeFromCart(productId) {
    // Find the product in the cart
    let cartItemIndex = cart.findIndex(item => item.id === productId);

    if (cartItemIndex !== -1) {
        // Remove the product from the cart
        cart.splice(cartItemIndex, 1);

        // Update the cart display
        updateCartDisplay();
        updateCartCount();
        saveCart(); // ✅ added this
    }
}

// Function to handle checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        // let totalPrice = 0;

        // cart.forEach(item => {
        //     totalPrice += item.price * item.quantity;
         // Redirect to payment page instead of clearing cart here
        window.location.href = "payment.html";

        }
    // )
    ;

        alert(`Your total is ₹${totalPrice.toFixed(2)}. Thank you for your purchase!`);

        // Empty the cart after checkout
        cart = [];
        updateCartDisplay();
    }



// Add event listener for checkout button
let checkoutBtn = document.querySelector('#checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
        if (cart.length === 0) {
            e.preventDefault(); // Stop navigation
            alert('Your cart is empty!');
        }
    });
}


// Add event listeners for all Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        let dataid = this.dataset.id; // Correctly using dataset.id to get data-id
        addToCart(dataid);
    });
});


//Add event listeners to all product cart icons
document.querySelectorAll('.trigger-cart-toggle').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('cart-btn').click();
    });
});

//Logic for Eye Icon: Description Modal 
const modal = document.getElementById('productModal');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const closeBtn = document.querySelector('.close');

document.querySelectorAll('.view-details').forEach(icon => {
    icon.addEventListener('click', function(event) {
      event.preventDefault();

      // Get data from icon
      const name = this.getAttribute('data-name');
      const description = this.getAttribute('data-description');

      // Fill modal
      productName.textContent = name;
      productDescription.textContent = description;

      // Show modal
      modal.style.display = 'block';
    });
  });

  // Close modal when X is clicked
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  }

  // Close modal when clicking outside the modal content
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }


// Wishlist toggle
document.querySelectorAll('.add-to-wishlist').forEach(heart => {
    heart.addEventListener('click', function (e) {
        e.preventDefault();
        const productId = parseInt(this.dataset.id);
        const product = products.find(p => p.id === productId);

        // Check if already in wishlistItems
        const exists = wishlistItems.find(item => item.id === productId);

        if (!exists) {
            wishlistItems.push(product);
            this.classList.add('wishlist-added');
            this.style.color = 'red';
            console.log(`Product ID ${productId} added to wishlist`);
        } else {
            wishlistItems = wishlistItems.filter(item => item.id !== productId);
            this.classList.remove('wishlist-added');
            this.style.color = '';
            console.log(`Product ID ${productId} removed from wishlist`);
        }

        updateWishlist();
        updateWishlistCount();
    });
});


const form = document.getElementById('contactForm');
    const popupCard = document.getElementById('popupCard');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent actual form submission
        popupCard.style.display = 'block'; // show the card
        form.reset(); // clear form after showing message
    });

    function closePopup() {
        popupCard.style.display = 'none';
    }
// When page loads, restore cart + check payment result
window.onload = function() {
    loadCart();

    const paymentStatus = localStorage.getItem("paymentStatus");

    if (paymentStatus === "success") {
        alert("✅ Payment successful! Your order has been placed.");
        cart = [];
        saveCart();
        updateCartDisplay();
        updateCartCount();
    } else if (paymentStatus === "failed") {
        alert("❌ Payment failed! Your cart is still saved.");
    } else if (paymentStatus === "cancelled") {
        alert("⚠️ Payment cancelled! Your cart is still saved.");
    }

    // Clear payment status so alerts don't repeat
    localStorage.removeItem("paymentStatus");
};
