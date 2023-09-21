

const qtyInput = document.getElementById('qty_input')
const total = document.getElementById('total')
const productId = document.getElementById('productId')
const productPrice = document.getElementById('productPrice')
const productQty = document.getElementById('productQty')
const productTotal = document.getElementById('productTotal')
const userEmail = document.getElementById('user_email')
const addCartBtn = document.getElementById('add_cart_btn')

addCartBtn.onclick = function() {
    const baseURL = window.location.origin
    console.log(userEmail.innerText)
    axios({
      method: "post",
      url: `${baseURL}/cart`,
      data: {     
            email: userEmail.innerText,
            productID: productId,
            productQTY: productQty,
            productTOTAL: productTotal
      },
    }).then(function (response) {
      console.log(response);
    });

}



qtyInput.addEventListener('change', (event)=>{
    
    
    if(event.target.value < 1) return;

    const qty = Number(event.target.value);
    
    const price = Number(productPrice.value);
    
    productQty.value = qty;

    const totalPrice = qty * price;
    
    const formatPrice = new Intl.NumberFormat().format(totalPrice)

    productTotal.value = formatPrice

    total.innerHTML = `<strong>Total:</strong> <i>&#8369;${formatPrice}</i>`


})

//TODO : create a add to cart function
