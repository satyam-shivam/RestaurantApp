import { menuArray } from '/data.js'

const menuList = document.getElementById("menu-list")
const billingModal = document.getElementById("billing-details")
const modalCloseButton = document.getElementById("modal-close-btn")
let cartItems = document.getElementById("cart-items")
let totalPrice = document.getElementById("total-price")
let totalAmount = 0
let checkedOutItems = {}


document.addEventListener('click', function(e){
    if (e.target.dataset.additem){
        handleAddItem(e.target.dataset.additem)

    }

    else if (e.target.dataset.removeitemid){
        handleRemoveItem(e.target.dataset.removeitemid)
    }

    else if(e.target.id == "complete-order"){
        if(Object.keys(checkedOutItems).length){
            document.getElementById("billing-details").style.display = "flex"
        }
    }
})

billingModal.addEventListener("submit", function(e){
    e.preventDefault()
    handlePayBtnClick()
})

modalCloseButton.addEventListener("click", function(){
    billingModal.style.display = "none"
})


// functions

function handleAddItem(itemId){

    if (itemId in checkedOutItems){
        checkedOutItems[itemId][1] += 1
    }
    else{
        let selectedItem = menuArray.filter(function(menuItem){
            return menuItem.id == itemId
        })[0]
        // id : [selectedObject , frquency of selection]
        checkedOutItems[itemId] = [selectedItem, 1]
    }

    renderCheckedOutList()
    totalAmount += checkedOutItems[itemId][0].price
    totalPrice.textContent = '$' + totalAmount
}


function handleRemoveItem(itemId){
    if (checkedOutItems[itemId][1] === 1){
        totalAmount -= parseInt(document.getElementById(`item-cost-${itemId}`).textContent) 
        delete (checkedOutItems[itemId])
    }
    else{
        checkedOutItems[itemId][1] -= 1
        totalAmount -= checkedOutItems[itemId][0].price
    }
    totalPrice.textContent = '$' + totalAmount
    renderCheckedOutList()
}

function renderCheckedOutList(){
    let checkedOutHtml = ``
    for (let checkedItem in checkedOutItems){
        checkedOutHtml += `
                        <div class="checked-out-item d-flex w-100">
                            <div class="item-option d-flex">
                                <h1 class="item-name">${checkedOutItems[checkedItem][0].name}</h1>
                                <button 
                                    class="remove-item"
                                    data-removeItemId = ${checkedItem}>remove</button>
                            </div>
                            <div class = "item-pricing d-flex">
                                <div>
                                    <h1>x</h1>
                                    <h1 id="item-quantity-${checkedItem}">${checkedOutItems[checkedItem][1]}</h1>
                                </div>
                                <div>
                                    <h1>$</h1>
                                    <h1 id="item-cost-${checkedItem}">${checkedOutItems[checkedItem][1] * checkedOutItems[checkedItem][0].price}</h1>
                                </div>
                            </div>
                        </div>` 
    }
    cartItems.innerHTML = checkedOutHtml
}


function handlePayBtnClick(){
    billingModal.style.display = "none"
    const billingFormData = new FormData(billingModal)
    const customerName    = billingFormData.get("customerName")
    document.getElementById("checkout-section").innerHTML = `
                                                <div id="thanks-message" class="ta-center"> Thanks, ${customerName}! Your order is on it's way! </div>
                                                <div class="star-rating-container d-flex">
                                                    <h1>Rate us !</h1>
                                                    <div class="star-widget">
                                                        <input type="radio" name="rate" id="rate-5">
                                                        <label for="rate-5" class="fas fa-star"></label>
                                                        <input type="radio" name="rate" id="rate-4">
                                                        <label for="rate-4" class="fas fa-star"></label>
                                                        <input type="radio" name="rate" id="rate-3">
                                                        <label for="rate-3" class="fas fa-star"></label>
                                                        <input type="radio" name="rate" id="rate-2">
                                                        <label for="rate-2" class="fas fa-star"></label>
                                                        <input type="radio" name="rate" id="rate-1">
                                                        <label for="rate-1" class="fas fa-star"></label>
                                                        <h2 class="ta-center"></h2>
                                                    </div>
                                                </div>`
}

function getFeedHtml() {
    let feedHtml = ``
    menuArray.forEach(function(menuItem){
        feedHtml += `<div class="menu-item d-flex w-100">
                        <div class="item-details d-flex">
                            <img src="${menuItem.emoji}" alt="${menuItem.name} representative image">
                            <div class="item-desc d-flex">
                                <h1 class="item-name">${menuItem.name}</h1>
                                <span class="item-ingredients">${menuItem.ingredients.join(", ")}</span>
                                <h1 class="item-cost">$ ${menuItem.price}</h1>
                            </div>
                        </div>
                        
                        <button class="add-button">
                         <img src="images/add-btn.png" alt="Add Button" data-additem = "${menuItem.id}">
                        </button>
                    </div>             
                    `
    })
    return feedHtml
}

function render(){
    menuList.innerHTML = getFeedHtml()
}

render()