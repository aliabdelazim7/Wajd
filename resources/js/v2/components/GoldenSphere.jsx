import React, { useEffect, useRef } from 'react';

const GoldenSphere = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let mouse = { x: 0, y: 0 };
        let spherePos = { x: 0, y: 0 };

        const resize = () => {
            canvas.width = 600;
            canvas.height = 600;
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (clientX && clientY) {
                mouse.x = clientX - rect.left - canvas.width / 2;
                mouse.y = clientY - rect.top - canvas.height / 2;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Smooth movement
            spherePos.x += (mouse.x - spherePos.x) * 0.05;
            spherePos.y += (mouse.y - spherePos.y) * 0.05;

            const centerX = canvas.width / 2 + spherePos.x * 0.2;
            const centerY = canvas.height / 2 + spherePos.y * 0.2;
            const radius = 180;

            // Complex Gradient for 3D look
            const gradient = ctx.createRadialGradient(
                centerX - radius * 0.3, 
                centerY - radius * 0.3, 
                radius * 0.1,
                centerX, 
                centerY, 
                radius
            );
            
            gradient.addColorStop(0, '#fff3b0'); // Highlight
            gradient.addColorStop(0.2, '#c5a862'); // Base Gold
            gradient.addColorStop(0.6, '#8b5c18'); // Shadow
            gradient.addColorStop(1, '#050505'); // Outer Shadow

            // Outer Glow
            ctx.shadowBlur = 80;
            ctx.shadowColor = 'rgba(197, 168, 98, 0.4)';
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Sub-glows for more "Liquid" look
            for (let i = 0; i < 3; i++) {
                const angle = Date.now() * 0.001 + i * (Math.PI * 2 / 3);
                const gx = centerX + Math.cos(angle) * radius * 0.4;
                const gy = centerY + Math.sin(angle) * radius * 0.4;
                
                const subGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius * 0.4);
                subGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
                subGrad.addColorStop(1, 'rgba(197, 168, 98, 0)');
                
                ctx.fillStyle = subGrad;
                ctx.beginPath();
                ctx.arc(gx, gy, radius * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-full"
            />
        </div>
    );
};

export default GoldenSphere;
