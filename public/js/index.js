window.addEventListener('pageshow', (event) =>{
    if(event.persisted){
        console.log('reload')
        window.location.reload();
    }
})