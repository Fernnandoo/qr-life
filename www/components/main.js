function scanQRCode() {
  // Verifica se o navegador suporta a API de mídia e a funcionalidade getUserMedia
  if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
    console.error('API de mídia não suportada pelo navegador.');
    return;
  }
const image = document.getElementById('image');
  const video = document.getElementById('video');
  const inicio = document.getElementById('inicio');
  const galleryInput = document.getElementById('galleryInput');
  const qrResultDiv = document.getElementById('result');
  const qrLink = document.createElement('a');
  qrLink.id = 'qr-link';
  qrResultDiv.appendChild(qrLink);

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function (stream) {
      inicio.classList.add('hide');
      image.classList.add('hide');
      video.style.display = 'block';
      galleryInput.style.display = 'none';
      video.srcObject = stream;
      video.play();
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const scanQrCodeInterval = setInterval(function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
          qrLink.textContent = 'QR Code detectado: ' + qrCode.data;
          qrLink.href = qrCode.data;
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
          clearInterval(scanQrCodeInterval);
        }
      }, 100);
    })
    .catch(function (error) {
      console.error('Erro ao acessar a câmera:', error);
    });

  galleryInput.addEventListener('change', function (event) {
    const imageFile = event.target.files[0];
    const image = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      image.src = e.target.result;

      image.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
          qrLink.textContent = 'QR Code detectado: ' + qrCode.data;
          qrLink.href = qrCode.data;
        } else {
          alert('Nenhum QR Code encontrado na imagem selecionada.');
        }
      };
    };

    reader.readAsDataURL(imageFile);
  });
}
