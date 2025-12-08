const progress = document.querySelectorAll(`.progress-bg .progress`);
progress.forEach((el, key) => {
    const progress_val = el.getAttribute(`data-progress_value`);
    el.style.width = `${progress_val}%`;
});