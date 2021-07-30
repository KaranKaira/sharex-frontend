const dropZone = document.querySelector('.dropbox');
const fileOpener = document.querySelector('#fileopener');
const file_selector_btn = document.querySelector('.file_selector_btn');
const progessContainer = document.querySelector('.progress_container');

const uploadedPercentage = document.querySelector('#value');
const progressBar = document.querySelector('.progress_bar');
const showURL = document.querySelector('#fileURL');
const sharingContainer = document.querySelector('.sharing_container');
const copyButton = document.querySelector('#copy');
const copyMessage = document.querySelector('.msg');

const host = 'https://karan-kaira-sharex.herokuapp.com/';
// const host="http://localhost:5000/"
const uploadURL = host + 'api/file';

dropZone.addEventListener('dragover', (e) => {
  //? event listener for drag and drop over element

  e.preventDefault(); //? default behaviour is dowloading the file,we don't want that

  if (!dropZone.classList.contains('dragged'))
    dropZone.classList.add('dragged');
});

dropZone.addEventListener('dragleave', (e) => {
  //? event listener when u move away
  if (dropZone.classList.contains('dragged'))
    dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
  //? when file dropped on the box

  e.preventDefault();

  if (dropZone.classList.contains('dragged'))
    dropZone.classList.remove('dragged');
  const files = e.dataTransfer.files;
  if (files.length) {
    //? when files dropped on the box , then attach those files to the choose file button
    fileOpener.files = files;
    upload();
  }
});

file_selector_btn.addEventListener('click', (e) => {
  //? transfer click to the button
  fileOpener.click();
});

fileOpener.addEventListener('change', () => {
  //? when file uploaded through browse and not through drag and drop
  upload();
});

const upload = () => {
  const file = fileOpener.files[0]; //? only 1 file allowed
  const formData = new FormData();

  formData.append('myFile', file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      //console.log(xhr.response);
      //? show the link which we get from backend
      showLink(JSON.parse(xhr.response));
    }
  };
  //? because initially progress bar was hidden
  progessContainer.style.display = 'block';
   
  xhr.upload.onprogress = progressReport;//? see upload report 
  xhr.open('POST', uploadURL);
  xhr.send(formData);
};

const progressReport = (e) => {
  progressBar.style.transform = `scaleX(0)`;
  progessContainer.style.display = 'block';
  const perc = parseInt((e.loaded / e.total) * 100);
  console.log(perc);

  uploadedPercentage.innerText = perc;
  progressBar.style.transform = `scaleX(${perc / 100})`;
};

const showLink = (link) => {
  sharingContainer.style.display = 'block';
  //console.log(link.file);
  //? now hide the progress bar to show the received link
  progessContainer.style.display = 'none';
  showURL.value = link.file;
};

//? paste to clipboard
copyButton.addEventListener('click', () => {

    //? select the link
    showURL.select();

  document.execCommand('copy'); //? copy everything which is selected

  copyMessage.style.display = 'block';
  window.scrollBy(0, 200);
  let copyMsg;
  clearTimeout(copyMsg);
  //? remove the 'copy to clipboard' after 3 seconds
  copyMsg = setTimeout(() => {
    copyMessage.style.display = 'none';
  }, 3000);
});
