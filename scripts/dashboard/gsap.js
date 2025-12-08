document.addEventListener("DOMContentLoaded", () => {
  // Create a GSAP timeline for sequencing animations
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  // Animate the mug icon
  tl.to(".mug-icon", {
    scale: 1,
    opacity: 1,
    duration: 1,
    rotation: 360,
  })
    // Animate the text
    .to(
      ".logo-text",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
      },
      "-=0.5"
    ) // Start slightly before previous animation ends
    // Animate the underline
    .to(
      ".underline",
      {
        width: "100%",
        opacity: 1,
        duration: 3,
      },
      "-=0.3"
    );

  // Add hover animation
  const logoContainer = document.querySelector(".logo-container");

  logoContainer.addEventListener("mouseenter", () => {
    gsap.to(".mug-icon", {
      scale: 1.1,
      duration: 0.3,
    });
    gsap.to(".logo-text", {
      scale: 1.05,
      duration: 0.3,
    });
  });

  logoContainer.addEventListener("mouseleave", () => {
    gsap.to(".mug-icon", {
      scale: 1,
      duration: 0.3,
    });
    gsap.to(".logo-text", {
      scale: 1,
      duration: 0.3,
    });
  });
});
