// 背景图片数组
const backgroundImages = [
    'https://www.helloimg.com/i/2025/01/30/679b27300a69e.jpg',
    'https://www.helloimg.com/i/2025/02/01/679da5e2bae02.jpg',
    'https://www.helloimg.com/i/2025/02/01/679da5e33f8b9.jpg',
    'https://www.helloimg.com/i/2025/02/01/679da5e49e246.jpg'
];

// 设置随机背景图片
function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const randomImage = backgroundImages[randomIndex];
    document.body.style.backgroundImage = `url(${randomImage})`;
    document.querySelector('.blur-background').style.backgroundImage = `url(${randomImage})`;
}

// 打字效果函数
function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        document.getElementById("typing-effect").innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1, fnCallback), 170); // 每个字符的显示间隔
    } else if (typeof fnCallback === 'function') {
        setTimeout(fnCallback, 700); // 打字完成后的回调延迟
    }
}

// 页面加载时执行
window.onload = function() {
    setRandomBackground(); // 设置随机背景
    typeWriter("Hi!欢迎来到这里", 0, () => {}); // 启动打字效果
};

// 鼠标特效
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = 0, mouseY = 0;
    let circles = [];
    let fireworks = [];

    // 圆点类
    class Circle {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.radians = Math.random() * Math.PI * 2;
            this.velocity = 0.05; // 旋转速度
            this.distance = Math.random() * 30 + 10; // 距离鼠标的距离
        }

        update() {
            this.radians += this.velocity;
            this.x = mouseX + Math.cos(this.radians) * this.distance;
            this.y = mouseY + Math.sin(this.radians) * this.distance;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }
    }

    // 烟花类
    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];
            for (let i = 0; i < 100; i++) {
                this.particles.push(new Particle(this.x, this.y));
            }
        }

        update() {
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.isDead());
        }

        draw() {
            this.particles.forEach(particle => particle.draw(ctx));
        }
    }

    // 粒子类
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 5 + 2;
            this.friction = 0.95; // 摩擦力
            this.gravity = 0.5; // 重力
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机颜色
        }

        update() {
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        isDead() {
            return this.speed < 0.1; // 粒子速度小于0.1时消失
        }
    }

    // 监听鼠标移动事件
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // 监听鼠标点击事件
    document.addEventListener('click', (event) => {
        fireworks.push(new Firework(event.clientX, event.clientY)); // 点击时生成烟花
    });

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新并绘制圆点
        if (circles.length < 10) {
            circles.push(new Circle(mouseX, mouseY, Math.random() * 3 + 1));
        }
        circles.forEach(circle => {
            circle.update();
            circle.draw();
        });

        // 更新并绘制烟花
        fireworks.forEach((firework, index, arr) => {
            firework.update();
            firework.draw();
            if (firework.particles.length === 0) {
                arr.splice(index, 1); // 烟花粒子消失后移除
            }
        });
    }

    animate(); // 启动动画
});