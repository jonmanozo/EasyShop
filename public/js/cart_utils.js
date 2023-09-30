export function createCartItem(parent, id, product_img, product_title, product_qty, product_price, callback){

    const productTotal = product_qty * product_price
    

    const cartItemContainer = createDiv() //parent
    cartItemContainer.setAttribute('class', 'cart_item border-bottom p-2')

    const idContainer = document.createElement('input')
    idContainer.type = 'hidden'
    idContainer.name = 'id'
    idContainer.value = id;


    cartItemContainer.appendChild(idContainer)



    const totalElement = createTotalElement(productTotal, function(){
        
        callback(0)
        fetch(`${window.location.origin}/cart`,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({productId : idContainer.value})
        }).then(res => res.json()).then(result => {
            if(result.statusCode == 200){
                window.location.reload()
            }
        })
        

        
    })

    const qtyInputContainer = createQtyElement(product_qty, function(value){
        
        totalElement.setTotal(value * product_price)
        if(callback){

            callback(value * product_price)
        }
    })


    const row = createDiv()
    row.setAttribute('class', 'row')

    const col1 = createDiv()
    col1.setAttribute('class','col-5')


    const titleElement = createTitleElement(product_img, product_title)

    col1.appendChild(titleElement)
    row.appendChild(col1)

    const col2 = createDiv()
    col2.setAttribute('class', 'col d-flex')

    const priceText = document.createElement('h5')
    priceText.setAttribute('class','mt-auto mb-auto')
    const formatPrice = new Intl.NumberFormat().format(product_price)
    priceText.innerHTML = `&#8369 ${formatPrice}`; 

    col2.appendChild(priceText)
    row.appendChild(col2)

    const col3 = createDiv()
    col3.setAttribute('class', 'col d-flex')
    col3.appendChild(qtyInputContainer.create())

    row.appendChild(col3)

    row.appendChild(totalElement.create())

    cartItemContainer.appendChild(row)
    return {

        create: function(){
            return cartItemContainer
        },
        
        getTotal: function(){
            return totalElement.getTotal()
        
        }
    }
        
}

function createTitleElement(img_src, title){
    
    const container = createDiv()
    container.setAttribute('class', 'd-flex gap-5')

    const img = document.createElement('img')
    img.setAttribute('src', img_src)
    img.setAttribute('style', 'height: 6em; width: 6em;')

    const productTitle = document.createElement('h3')
    productTitle.setAttribute('class', 'mt-auto mb-auto' )
    productTitle.innerText = title

    container.appendChild(img)
    container.appendChild(productTitle)
    
    return container

}

function createTotalElement(total, callback){
    
    let t = total
    const container = createDiv()
    container.setAttribute('class', 'col d-flex gap-2')

    const product_total = document.createElement('h5')
    product_total.setAttribute('class', 'mt-auto mb-auto')
    
    product_total.innerHTML = `&#8369; ${new Intl.NumberFormat().format(t)}`
    
    const delBtn = document.createElement('input')
    delBtn.setAttribute('type', 'button')
    delBtn.setAttribute('class', 'btn btn-close mt-auto mb-auto')

    delBtn.onclick = () =>{
        callback()
    }

    container.appendChild(product_total)
    container.appendChild(delBtn)

    return {
        create : function (){
            return container
        },
        setTotal : function(price){
            const formatPrice = new Intl.NumberFormat().format(price)
            product_total.innerHTML = `&#8369; ${formatPrice}`
            t = price
        },
        getTotal : function(){
            return Number(t)
        }
    }
}

function createQtyElement(qty, callback){
    const qtyInputContainer =  createDiv()
    qtyInputContainer.setAttribute('class', 'mt-auto mb-auto d-flex')

    const decrementBtn = document.createElement('input')
    decrementBtn.setAttribute('type', 'button')
    decrementBtn.setAttribute('class', 'rounded-start-pill border p-2')
    decrementBtn.setAttribute('value', '-')
    
    const qtyInput = document.createElement('input')
    qtyInput.readOnly = true
    qtyInput.setAttribute('type', 'text')
    qtyInput.setAttribute('class', ' w-25 text-center bg-body-secondary border border-0')
    qtyInput.name = 'qty'
    qtyInput.value = qty

    callback(qtyInput.value)
    const incrementBtn = document.createElement('input')
    incrementBtn.setAttribute('type', 'button')
    incrementBtn.setAttribute('class', 'rounded-end-pill border p-2')
    incrementBtn.setAttribute('value', '+')
    
    incrementBtn.onclick = () =>{
        let val = Number(qtyInput.value)
        val++
        qtyInput.value = val.toString()
        callback(qtyInput.value)
    }

    
    
    decrementBtn.onclick = () =>{
        let val = Number(qtyInput.value)
        if(val > 1){
            val--
            qtyInput.value = val.toString()
            callback(qtyInput.value)
        }
    }

    qtyInputContainer.appendChild(decrementBtn)
    qtyInputContainer.appendChild(qtyInput)
    qtyInputContainer.appendChild(incrementBtn)

    return {
        create : function(){
            return qtyInputContainer
        },
    }
}

function createDiv(){
    return document.createElement('div')
}
