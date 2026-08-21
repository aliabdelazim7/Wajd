import React, { useEffect, useRef } from 'react';

const LiquidGoldBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (isMobile) drawStatic(); // Draw once for mobile
        };

        const drawStatic = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Simple static gradients for mobile to save battery and GPU
            const gradient = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.5, 0, canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8);
            gradient.addColorStop(0, 'rgba(197, 168, 98, 0.05)');
            gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const draw = () => {
            if (isMobile) return; // Skip animation on mobile
            
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < 3; i++) {
                const x = Math.sin(time + i) * canvas.width * 0.3 + canvas.width * 0.5;
                const y = Math.cos(time * 0.8 + i) * canvas.height * 0.3 + canvas.height * 0.5;
                const radius = canvas.width * 0.6;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                if (i === 0) {
                    gradient.addColorStop(0, 'rgba(197, 168, 98, 0.08)');
                    gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
                } else if (i === 1) {
                    gradient.addColorStop(0, 'rgba(139, 92, 24, 0.05)');
                    gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
                } else {
                    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.03)');
                    gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.globalCompositeOperation = 'overlay';
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.01})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        if (!isMobile) draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-0"
            style={{ filter: window.innerWidth < 768 ? 'none' : 'blur(40px)' }}
        />
    );
};

export default LiquidGoldBackground;
