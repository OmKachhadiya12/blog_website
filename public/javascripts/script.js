document.addEventListener('DOMContentLoaded',() => {
    const allButons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar'); 
    const searchInput = document.getElementById('searchInput'); 
    const searchClose = document.getElementById('searchClose'); 

    for(var i = 0; i < allButons.length; i++){
        allButons[i].addEventListener('click',() => {
            searchBar.style.visiblity = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus(); 
        })
    }

    searchClose.addEventListener('click',() => {
        searchBar.style.visiblity = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'flase');
    })
});