export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.warn("toast element not found:", message);
    return;
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  setTimeout(() => (toast.style.opacity = "0"), 2300);
}
