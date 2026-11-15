// Footer interactions: newsletter validation and dynamic copyright year.
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("currentYear");
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const message = document.getElementById("newsletterMessage");

  if (yearElement) yearElement.textContent = new Date().getFullYear();

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    message.className = "newsletter-message";

    const email = emailInput.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validEmail) {
      message.textContent = "Please enter a valid email address.";
      message.classList.add("error");
      emailInput.focus();
      return;
    }

    if (!termsCheckbox.checked) {
      message.textContent = "Please agree to the terms & conditions first.";
      message.classList.add("error");
      termsCheckbox.focus();
      return;
    }

    // Static demo only — connect this point to your newsletter API/backend.
    message.textContent = "Thank you! Your subscription form is ready to be connected.";
    message.classList.add("success");
    form.reset();
  });
});
