const addCartBtn = document.getElementById('add_cart_btn')
const qtyInput = document.getElementById('qty_input')
const total = document.getElementById('total')
const productId = document.getElementById('productId')
const productPrice = document.getElementById('productPrice')
const productQty = document.getElementById('productQty')
const productTotal = document.getElementById('productTotal')
const userEmail = document.getElementById('user_email')

addCartBtn.onclick = function(e) {

    const baseURL = window.location.origin
    
    if(!userEmail){
        window.location.replace(`${baseURL}/login`)
        return
    }

    const data = {
        email: userEmail.innerText,
        prodId: Number(productId.value),
        prodPrice : Number(productPrice.value),
        prodQty: Number(productQty.value),
        prodTotal: Number(productTotal.value)
    }

    const result = async function() { 
        const request = await fetch(`${baseURL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type' : "application/json",
            },
            body: JSON.stringify(data)
        })

        return await request.json()
    }
    
    result().then((res) => {
        if(res.code === 1 || res.code === 2){
            console.log(res.cartItemCount)
            console.log(res.message)
            console.log(res.user)
        }
        if(res.code === -1)
        {
            window.location.replace(`${baseURL}/login`)
        }
    })

}



qtyInput.addEventListener('change', (event)=>{
    
    
    if(event.target.value < 1) return;

    const qty = Number(event.target.value);
    
    const price = Number(productPrice.value);
    
    productQty.value = qty;

    const totalPrice = qty * price;
    
    const formatPrice = new Intl.NumberFormat().format(totalPrice)

    productTotal.value = totalPrice

    total.innerHTML = `<strong>Total:</strong> <i>&#8369;${formatPrice}</i>`


})

//TODO : create a add to cart function
