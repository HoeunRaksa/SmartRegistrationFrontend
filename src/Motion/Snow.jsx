import React, { useEffect } from "react";

const SnowAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById("snow-canvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numFlakes = 100;
    const flakes = [];

    for (let i = 0; i < numFlakes; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1,
        d: Math.random() * numFlakes
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      ctx.beginPath();
      for (let i = 0; i < numFlakes; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
    };

    let angle = 0;

    const update = () => {
      angle += 0.01;
      for (let i = 0; i < numFlakes; i++) {
        const f = flakes[i];
        f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
        f.x += Math.sin(angle) * 2;

        if (f.y > height) {
          flakes[i] = { x: Math.random() * width, y: 0, r: f.r, d: f.d };
        }
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      id="snow-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default SnowAnimation;
