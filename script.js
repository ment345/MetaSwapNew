const rates = {
  BTC: { USDT: 27348.12, ETH: 15.82, RUB: 2487000 },
  ETH: { USDT: 1723.4, BTC: 0.063, RUB: 156000 },
  USDT: { BTC: 1 / 27348.12, ETH: 1 / 1723.4, RUB: 90.9 },
  BNB: { USDT: 302.15, BTC: 0.011, ETH: 0.175 }
};

const fromAmount = document.getElementById('fromAmount');
const toAmount = document.getElementById('toAmount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const calculateBtn = document.getElementById('calculateBtn');
const liveRate = document.getElementById('liveRate');
const progressBar = document.getElementById('progressBar');

function formatNumber(value) {
  if (value >= 1) {
    return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  }
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 6 });
}

function getRate(from, to) {
  const rate = rates[from]?.[to];
  if (rate) {
    return rate;
  }
  // Если прямой пары нет, пробуем конвертацию через USDT
  const base = rates[from]?.USDT;
  const target = rates.USDT?.[to];
  if (base && target) {
    return base * target;
  }
  return 1;
}

function calculate() {
  const amount = parseFloat(fromAmount.value) || 0;
  const rate = getRate(fromCurrency.value, toCurrency.value);
  const result = amount * rate;
  toAmount.value = formatNumber(result);
  liveRate.textContent = `1 ${fromCurrency.value} = ${formatNumber(rate)} ${toCurrency.value}`;
}

calculateBtn?.addEventListener('click', (event) => {
  event.preventDefault();
  calculate();
  animateProgress();
});

[fromAmount, fromCurrency, toCurrency].forEach((element) => {
  element?.addEventListener('input', calculate);
});

function animateProgress() {
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBar.style.transition = 'width 1.2s ease';
      progressBar.style.width = `${40 + Math.random() * 60}%`;
    });
  });
}

let counterStarted = false;

function animateCounter() {
  if (counterStarted) return;
  const counter = document.querySelector('[data-counter]');
  if (!counter) return;
  const target = Number(counter.dataset.counter);
  const duration = 1800;
  const start = performance.now();

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const current = Math.floor(progress * target);
    counter.textContent = current.toLocaleString('ru-RU');
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
  counterStarted = true;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter();
      observer.disconnect();
    }
  });
});

const statsSection = document.querySelector('.hero__stats');
if (statsSection) {
  observer.observe(statsSection);
}

calculate();
animateProgress();
