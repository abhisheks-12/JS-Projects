const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnShowModal  = document.querySelectorAll('.show-modal');
const btncloseModal = document.querySelector('.close-modal');

// Creating fun to close modal
function showModal(){
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
// Creating fun to close modal
function closeModal(){
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

// Opening Modal
for(let i=0; i<btnShowModal.length; i++){
  btnShowModal[i].addEventListener('click',showModal);
}

// Closing Modal
btncloseModal.addEventListener('click',closeModal);
overlay.addEventListener('click',closeModal);

// Handling ESC
document.addEventListener('keydown',function(elements){
  // console.log(elements);

  if(elements.key === 'Escape' && !modal.classList.contains('hidden')){
    closeModal();
  }
});

