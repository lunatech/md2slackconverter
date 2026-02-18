import { convert } from './converter.js';

const input = document.getElementById('md-input');
const output = document.getElementById('slack-output');
const copyBtn = document.getElementById('copy-btn');
let syncingScroll = false;

function syncOutput() {
  output.value = input.value.trim() ? convert(input.value) : '';
}

input.addEventListener('input', syncOutput);

function getScrollRatio(element) {
  const maxScrollTop = element.scrollHeight - element.clientHeight;
  return maxScrollTop > 0 ? element.scrollTop / maxScrollTop : 0;
}

function setScrollFromRatio(element, ratio) {
  const maxScrollTop = element.scrollHeight - element.clientHeight;
  element.scrollTop = maxScrollTop > 0 ? ratio * maxScrollTop : 0;
}

function syncScroll(source, target) {
  if (syncingScroll) return;
  syncingScroll = true;
  setScrollFromRatio(target, getScrollRatio(source));
  requestAnimationFrame(() => {
    syncingScroll = false;
  });
}

input.addEventListener('scroll', () => {
  syncScroll(input, output);
});

output.addEventListener('scroll', () => {
  syncScroll(output, input);
});

copyBtn.addEventListener('click', () => {
  if (!output.value) return;

  navigator.clipboard.writeText(output.value).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('copied');
    }, 2000);
  });
});
