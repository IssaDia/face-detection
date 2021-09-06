const fileUpload = document.getElementById("fileUpload");
fileUpload.addEventListener("change", getImage, false);
const uploadedImageDiv = document.getElementById("uploadedImage");

const MODEL_URL = "./models";
let modelsLoaded = [];

faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).then(() => {
  console.log("tinyFaceDetector loaded");
  modelsLoaded = [...modelsLoaded, "tinyFaceDetector loaded"];
});

faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL).then(()=> {
    modelsLoaded = [...modelsLoaded, "ssdMobilenetv1 loaded"];
})

function getImage() {
uploadedImageDiv.innerHTML = "";
  const imageToProcess = this.files[0];
  let image = new Image(imageToProcess.width, imageToProcess.height);
  image.src = URL.createObjectURL(imageToProcess);
  // uploadedImageDiv.style.border = "4px solid #FCB514";
  uploadedImageDiv.appendChild(image);
  image.addEventListener("load", ()=> {

      const imageDimension = {width : image.width, height: image.height}
      const data = {
          image,
          imageDimension
      }
      processImage(data);
  })
}

function processImage({image, imageDimension}) {
    if(modelsLoaded.length !==2) {
        console.log("please wait while : models are still loading");
        return;
    }
  faceapi.detectAllFaces(image).then((facesDetected) => {
    facesDetectedImage = faceapi.resizeResults(image,{
        height : imageDimension.height,
        width : imageDimension.width
    })
    const canvas = faceapi.createCanvasFromMedia(image);
    faceapi.draw.drawDetections(canvas, facesDetected);
    uploadedImageDiv.innerHTML = "";
    uploadedImageDiv.appendChild(canvas);
    canvas.style.position = "absolute";
    canvas.style.top = uploadedImageDiv.y + "px";
    canvas.style.left = uploadedImageDiv.x + "px";

    facesDetected.map (face => {
            faceapi.draw.drawDetections(canvas, face);

    })
  });
}
