// Confetti Animation
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const pieces = [];
const numberOfPieces = 100;

function randomColor() {
  const colors = [
    "#FFC107",
    "#FF5722",
    "#E91E63",
    "#9C27B0",
    "#00BCD4",
    "#4CAF50"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function ConfettiPiece() {
  this.x = Math.random() * width;
  this.y = Math.random() * height - height;
  this.size = Math.random() * 8 + 4;
  this.speed = Math.random() * 3 + 2;
  this.gravity = 0.05;
  this.rotation = Math.random() * 2 * Math.PI;
  this.rotationSpeed = Math.random() * 0.1 - 0.05;
  this.color = randomColor();
}

ConfettiPiece.prototype.update = function() {
  this.y += this.speed;
  this.rotation += this.rotationSpeed;
  this.speed += this.gravity;
  if (this.y > height) {
    this.y = -10;
    this.x = Math.random() * width;
    this.speed = Math.random() * 3 + 2;
  }
};

ConfettiPiece.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.fillStyle = this.color;
  ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
  ctx.restore();
};

for (let i = 0; i < numberOfPieces; i++) {
  pieces.push(new ConfettiPiece());
}

function updateConfetti() {
  ctx.clearRect(0, 0, width, height);
  pieces.forEach(function(piece) {
    piece.update();
    piece.draw();
  });
  requestAnimationFrame(updateConfetti);
}
updateConfetti();

window.addEventListener("resize", function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Countdown Timer
const targetDate = new Date("March 8, 2024 00:00:00").getTime();
const timerElement = document.getElementById("timer");

function updateTimer() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  
  if (distance < 0) {
    timerElement.innerHTML = "Holi is here!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  timerElement.innerHTML = `Countdown to Holi: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateTimer, 1000);

// Message Form
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp8jPbZMrUU1M_aZ4XHTRS_MT_y6uYcXo",
  authDomain: "happy-holi-f0cba.firebaseapp.com",
  projectId: "happy-holi-f0cba",
  storageBucket: "happy-holi-f0cba.firebasestorage.app",
  messagingSenderId: "173972648321",
  appId: "1:173972648321:web:4ea8354423f3559ba4f880",
  measurementId: "G-Z9RKW619MN"
};
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Message Form Handling
const form = document.getElementById("wishForm");
const messagesList = document.getElementById("messagesList");

// Load existing messages
db.collection("messages").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
  messagesList.innerHTML = "";
  snapshot.forEach((doc) => {
    const message = doc.data();
    addMessageToDOM(message.name, message.text);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  try {
    await db.collection("messages").add({
      name: name,
      text: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    form.reset();
  } catch (error) {
    console.error("Error saving message:", error);
    alert("Error sending message. Please try again.");
  }
});

function addMessageToDOM(name, message) {
  const p = document.createElement("p");
  p.textContent = `${name}: ${message}`;
  messagesList.appendChild(p);
}
// Social Media Sharing
document.querySelectorAll('.share-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const platform = this.dataset.platform;
    const pageUrl = encodeURIComponent(window.location.href);
    const message = encodeURIComponent("Celebrate Holi with us! 🎉");

    switch(platform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${message}%0A%0A${pageUrl}`, '_blank');
        break;
        
      case 'instagram':
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert('Link copied! Paste in Instagram'))
          .catch(() => prompt('Copy this URL:', window.location.href));
        break;
        
      case 'snapchat':
        window.open(`https://www.snapchat.com/scan?attachmentUrl=${pageUrl}`, '_blank');
        break;
    }
  });
});
