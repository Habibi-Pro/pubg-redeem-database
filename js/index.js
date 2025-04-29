function updateDescription() {
    const type = document.getElementById('uc-type').value;
    const desc = document.getElementById('description');
    if (type) {
      desc.innerText = `PUBG MOBILE ${type} UC Redemption Code`;
    } else {
      desc.innerText = 'لطفاً نوع UC را انتخاب کنید.';
    }
  }
  
  function saveCode() {
    const type = document.getElementById('uc-type').value;
    const code = document.getElementById('redeem-code').value.trim();
  
    if (!type || !code) {
      alert('لطفاً نوع UC و کد را کامل وارد کنید.');
      return;
    }
  
    const savedCodes = JSON.parse(localStorage.getItem('codes') || '{}');
  
    if (!savedCodes[type]) {
      savedCodes[type] = [];
    }
  
    savedCodes[type].push({
      code: code,
      description: `PUBG MOBILE ${type} UC Redemption Code`,
      used: false
    });
  
    localStorage.setItem('codes', JSON.stringify(savedCodes));
  
    alert('کد با موفقیت ذخیره شد!');
    document.getElementById('uc-type').value = '';
    document.getElementById('description').innerText = 'لطفاً نوع UC را انتخاب کنید.';
    document.getElementById('redeem-code').value = '';
  }
  