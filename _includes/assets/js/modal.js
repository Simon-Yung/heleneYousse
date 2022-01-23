const modalWindow = document.getElementById('modal');
const modalBackground = document.getElementById('modalBackground');
const modalImage = document.getElementById('modalContent');
const caption = document.getElementById('caption');
const closeButton = document.getElementById('close');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const loader = document.getElementById('loader');

const previews = document.getElementsByClassName('preview__image');
const numberOfPreviews = previews.length;

let currentImage = null; 
for ( let i=0; i < previews.length; i++){
	previews[i].addEventListener('click', () => { openModal( previews[i].id ); })
}
closeButton.addEventListener('click', (e) => {closeModal()});
modalImage.addEventListener('click', (e) => {closeModal()});
loader.addEventListener('click', (e) => {closeModal()});
previousButton.addEventListener('click', (e) => {previousModal()});
nextButton.addEventListener('click', (e) => {nextModal()});

modalImage.addEventListener("load", (e) => { loader.style.opacity = '0.0' });
modalImage.addEventListener('contextmenu', (e) => e.preventDefault());

function openModal( image ){
	loader.style.opacity = '1.0' 
	document.body.style.overflow = 'hidden';
	modalWindow.style.display = 'grid';
	modalImage.src = document.getElementById(`${image}`).dataset.targetUrl;
	caption.innerHTML = document.getElementById(`${image}`).dataset.caption;
	currentImage = parseInt(image);
}
function nextModal(){
	if ( currentImage + 1 > numberOfPreviews - 1 ){
		openModal( 0 )
	} else {
		openModal( currentImage + 1 )
	}
}
function previousModal(){
	if ( currentImage -1 < 0 ){
		openModal( numberOfPreviews - 1 )
	} else {
		openModal( currentImage - 1 )
	}
}
function closeModal(){
	modalWindow.style.display = 'none';
	document.body.style.overflow = 'auto';
	modalImage.src = "";
	caption.innerHTML = "";
	currentImage = null;
}