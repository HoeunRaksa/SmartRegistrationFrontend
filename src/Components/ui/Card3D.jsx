// 3D Enhanced Card Component with depth and perspective
import React from 'react';
import { motion } from 'framer-motion';

export const Card3D = ({
    children,
    className = '',
    hover3D = true,
    perspective = 1000,
    rotationIntensity = 10,
    shadowIntensity = 'medium',
    ...props
}) => {
    const [rotateX, setRotateX] = React.useState(0);
    const [rotateY, setRotateY] = React.useState(0);

    const handleMouseMove = (e) => {
        if (!hover3D) return;

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateXValue = (mouseY / (rect.height / 2)) * rotationIntensity;
        const rotateYValue = (mouseX / (rect.width / 2)) * -rotationIntensity;

        setRotateX(-rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const shadowStyles = {
        low: 'shadow-lg',
        medium: 'shadow-xl hover:shadow-2xl',
        high: 'shadow-2xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]',
    };

    return (
        <motion.div
            className={`relative ${shadowStyles[shadowIntensity]} transition-shadow duration-300 ${className}`}
            style={{
                perspective: `${perspective}px`,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX,
                rotateY,
            }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
            }}
            whileHover={{
                scale: 1.02,
                z: 50,
            }}
            {...props}
        >
            <div style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>

            {/* 3D Depth Shadow */}
            <div
                className="absolute inset-0 -z-10 rounded-[inherit] opacity-40 blur-xl transition-opacity duration-300"
                style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
                    transform: 'translateZ(-10px)',
                }}
            />
        </motion.div>
    );
};

export const Button3D = ({ children, className = '', ...props }) => {
    return (
        <motion.button
            className={`relative ${className}`}
            style={{
                transformStyle: 'preserve-3d',
            }}
            whileHover={{
                scale: 1.05,
                rotateX: -5,
                rotateY: 5,
                z: 20,
            }}
            whileTap={{
                scale: 0.95,
                rotateX: 5,
                rotateY: -5,
            }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
            }}
            {...props}
        >
            <div style={{ transform: 'translateZ(10px)' }}>
                {children}
            </div>

            {/* Button Depth */}
            <div
                className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-blue-600/50 to-purple-600/50 blur-md"
                style={{ transform: 'translateZ(-5px)' }}
            />
        </motion.button>
    );
};

export const FloatingCard3D = ({ children, className = '', delay = 0 }) => {
    return (
        <motion.div
            className={`relative ${className}`}
            style={{
                transformStyle: 'preserve-3d',
            }}
            animate={{
                y: [0, -10, 0],
                rotateX: [0, 2, 0],
                rotateY: [0, 3, 0],
            }}
            transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            whileHover={{
                y: -15,
                rotateX: 5,
                rotateY: 5,
                scale: 1.05,
            }}
        >
            {children}
        </motion.div>
    );
};

export const ParallaxCard = ({ children, className = '', depth = 50 }) => {
    const [offsetX, setOffsetX] = React.useState(0);
    const [offsetY, setOffsetY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setOffsetY(scrollY * 0.5);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            className={`relative ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${depth}px) translateY(${offsetY}px)`,
            }}
        >
            {children}
        </motion.div>
    );
};

export default { Card3D, Button3D, FloatingCard3D, ParallaxCard };
