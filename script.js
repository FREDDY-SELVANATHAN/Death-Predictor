document.addEventListener('DOMContentLoaded', function() {
  const predictBtn = document.getElementById('predict-btn');
  const resultDiv = document.getElementById('result');
  const walkAudio = document.getElementById('walk-audio');
  const fileInput = document.getElementById('image');
  const fileLabel = document.getElementById('file-label');
  
  let isProcessing = false; 
  
  predictBtn.addEventListener('click', predictDeath);
  setupImageUpload();
  
  function setupImageUpload() {
    const fileUpload = document.querySelector('.file-upload');
    
    fileUpload.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileLabel.classList.add('dragover');
    });
    
    fileUpload.addEventListener('dragleave', () => {
      fileLabel.classList.remove('dragover');
    });
    
    fileUpload.addEventListener('drop', (e) => {
      e.preventDefault();
      fileLabel.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        updateFileLabel(files[0].name);
      }
    });
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        updateFileLabel(e.target.files[0].name);
      }
    });
  }
  
  function updateFileLabel(fileName) {
    fileLabel.textContent = `📷 ${fileName}`;
  }
  
  function predictDeath() {
    if (isProcessing) return; 
    
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const locality = document.getElementById('locality').value.trim();
    const food = document.getElementById('food').value.trim();
    
    if (!name || !age || !gender || !locality || !food) {
      showResult('Please enter all fields before predicting!', 'error');
      return;
    }
    
    if (age <= 0 || age > 150) {
      showResult('Please enter a valid age!', 'error');
      return;
    }
    
    isProcessing = true;
    predictBtn.disabled = true;
    predictBtn.textContent = 'Processing...';
    
    const remainingYears = predictRemainingYears(age, food.toLowerCase());
    if (remainingYears <= 0) {
      showResult('💀 Your time is up! You have 0 years left.', 'death');
    } else {
      showResult(`🕰️ You have approximately ${remainingYears} years left to live.`, 'prediction');
    }
    
    setTimeout(() => {
      updateManPosition(remainingYears);
    }, 2000);
  }
  
  function predictRemainingYears(age, food) {
    let baseLifespan = 90;
    const goodFoods = ['salad', 'fish', 'vegetables', 'fruits', 'oats', 'apple', 'sprouts', 'bread', 'dairy'];
    const badFoods = ['pizza', 'burger', 'soda', 'sandwich', 'chips', 'chocolates', 'candy', 'ice cream', 'biriyani', 'fried rice', 'parotta', 'chicken'];

    if (goodFoods.includes(food)) {
      baseLifespan += 5;
    } else if (badFoods.includes(food)) {
      baseLifespan -= 5;
    }

    const remaining = baseLifespan - age;
    return Math.max(0, remaining);
  }
  
  function showResult(message, type) {
    resultDiv.innerHTML = `<div class="result-${type}">${message}</div>`;
    resultDiv.style.display = 'block';
  }
  
  function updateManPosition(remainingYears) {
    const malak = document.getElementById('malak-character');
    const coffin = document.getElementById('coffin');
    
    if (!malak || !coffin) {
      console.log('Elements not found');
      resetButton();
      return;
    }
    malak.style.left = '100px';
    malak.style.opacity = '1';
    malak.style.transform = 'scaleX(-1) scale(1)';
    
    if (remainingYears <= 0) {
      const coffinLeft = coffin.offsetLeft;
      const coffinWidth = coffin.offsetWidth;
      const malakWidth = malak.offsetWidth;
      const targetPosition = coffinLeft + (coffinWidth / 2) - (malakWidth / 2);
      
      walkAudio.pause();
      walkAudio.currentTime = 0;
      walkAudio.playbackRate = 1.0;
      walkAudio.volume = 1.0;
      walkAudio.play().catch(e => console.log('Audio failed'));
      
      setTimeout(() => {
        malak.style.transition = 'left 4s ease-in-out';
        malak.style.left = `${targetPosition}px`;
      }, 500);
      
      setTimeout(() => {
        malak.style.transition = 'opacity 2s ease-in-out, transform 2s ease-in-out';
        malak.style.opacity = '0';
        malak.style.transform = 'scaleX(-1) scale(0.1)';
        
        setTimeout(() => {
          showResult(`💀 Your fate is sealed! You have 0 years left.`, 'death');
          resetButton();
        }, 2000);
      }, 4500);
      
    } else {
      const startPosition = 100;
      const coffinLeft = coffin.offsetLeft;
      const malakWidth = malak.offsetWidth;
      const maxDistance = coffinLeft - malakWidth - startPosition;
      const yearsPercentage = remainingYears / 100; 
      const distanceFromCoffin = maxDistance * (1 - yearsPercentage);
      const targetPosition = startPosition + distanceFromCoffin;
      walkAudio.pause();
      walkAudio.currentTime = 0;
      walkAudio.playbackRate = 1.0;
      walkAudio.volume = 1.0;
      walkAudio.play().catch(e => console.log('Audio failed'));
      setTimeout(() => {
        malak.style.transition = 'left 4s ease-in-out';
        malak.style.left = `${targetPosition}px`;
      }, 500);
      setTimeout(() => {
        showResult(`🕰️ You still have ${remainingYears} years left to live!`, 'journey');
        resetButton();
      }, 4500);
    }
  }
  
  function resetButton() {
    isProcessing = false;
    predictBtn.disabled = false;
    predictBtn.textContent = '🔮 Predict Death';
  }
});
