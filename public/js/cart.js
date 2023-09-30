import { createCartItem } from './cart_utils.js'

const cartContainer = document.getElementById('cartContainer')
const totalContainer = document.getElementById('total')

window.onload = () =>{
    const productsTotal = []
    let total = 0

    const userContainer = document.getElementById('user_email')
    
    const user = userContainer.innerText

    fetch(`${window.location.origin}/cart/all`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        
        data.forEach((item, index) => {
       
            const product = createCartItem(
            cartContainer,
            item.id,
            item.img,
            item.title,
            item.qty,
            item.price,
            
            function (totalPrice){
                productsTotal[index] = totalPrice

                total = 0
                
                productsTotal.forEach(amount =>{
                    total += amount
                    totalContainer.innerHTML = new Intl.NumberFormat().format(total)
                })
            })
            cartContainer.appendChild(product.create())
        });
    });
    




}