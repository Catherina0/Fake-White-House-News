document.addEventListener('DOMContentLoaded', function() {
    // 获取Canvas元素和上下文
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    
    // 获取控制元素
    const textInput = document.getElementById('textInput');
    const fontSize = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const fontColor = document.getElementById('fontColor');
    const fontFamily = document.getElementById('fontFamily');
    const textX = document.getElementById('textX');
    const textXValue = document.getElementById('textXValue');
    const textY = document.getElementById('textY');
    const textYValue = document.getElementById('textYValue');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // 图片对象
    const img = new Image();
    img.src = 'bgp.png';
    
    // 保存原始图片尺寸
    let imgWidth, imgHeight;
    
    // 固定文本设置
    let currentText = '';
    const currentFontSize = 75; // 字体大小为75px
    let currentFontColor = fontColor.value;
    const englishFontFamily = 'Instrument Serif'; // 英文字体
    const chineseFontFamily = 'Noto Serif SC'; // 中文字体
    const currentTextX = 0.5; // 固定为50%
    const currentTextY = 0.45; // 上移到45%
    const maxLineWidth = 0.8; // 文本宽度占图片宽度的最大比例
    
    // 更新HTML控件的默认值以匹配固定设置
    fontSize.value = currentFontSize;
    fontSizeValue.textContent = `${currentFontSize}px`;
    fontFamily.value = englishFontFamily;
    textX.value = currentTextX * 100;
    textXValue.textContent = `${currentTextX * 100}%`;
    textY.value = currentTextY * 100;
    textYValue.textContent = `${currentTextY * 100}%`;
    
    // 当图片加载完成后设置Canvas尺寸并绘制图片
    img.onload = function() {
        // 保存图片的原始尺寸
        imgWidth = img.width;
        imgHeight = img.height;
        
        // 设置canvas尺寸为图片尺寸
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        
        // 绘制初始图片
        drawImage();
    };
    
    // 对文本进行自动换行处理
    function wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';
        
        ctx.font = `${currentFontSize}px ${englishFontFamily}`;
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    }
    
    // 处理中文文本自动换行
    function wrapChineseText(text, maxWidth) {
        const chars = text.split('');
        const lines = [];
        let currentLine = chars[0] || '';
        
        ctx.font = `${currentFontSize}px ${chineseFontFamily}`;
        
        for (let i = 1; i < chars.length; i++) {
            const char = chars[i];
            const width = ctx.measureText(currentLine + char).width;
            
            if (width < maxWidth && char !== '\n') {
                currentLine += char;
            } else {
                if (char === '\n') {
                    lines.push(currentLine);
                    currentLine = '';
                } else {
                    lines.push(currentLine);
                    currentLine = char;
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    // 绘制图片和文字
    function drawImage() {
        // 清除Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        if (currentText.trim() === '') return;
        
        // 自动换行处理
        const maxWidth = canvas.width * maxLineWidth;
        
        // 检测文本是否包含中文字符
        const containsChinese = /[\u4e00-\u9fa5]/.test(currentText);
        
        // 根据是否包含中文选择字体和换行处理
        const useFont = containsChinese ? chineseFontFamily : englishFontFamily;
        const lines = containsChinese ? 
            wrapChineseText(currentText, maxWidth) : 
            wrapText(currentText, maxWidth);
        
        // 设置文字样式
        ctx.font = `${currentFontSize}px ${useFont}`;
        ctx.fillStyle = currentFontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top'; // 改为top，让文本从顶部开始
        
        const lineHeight = parseInt(currentFontSize) * 1.2;
        
        // 计算起始Y位置，使第一行文本的顶部对齐指定位置
        const x = canvas.width * currentTextX;
        let y = canvas.height * currentTextY;
        
        lines.forEach(line => {
            if (line.trim() !== '') {
                // 选择要使用的字体，混合文本时会更精确判断
                if (/[\u4e00-\u9fa5]/.test(line)) {
                    ctx.font = `${currentFontSize}px ${chineseFontFamily}`;
                } else {
                    ctx.font = `${currentFontSize}px ${englishFontFamily}`;
                }
                ctx.fillText(line, x, y);
            }
            y += lineHeight;
        });
    }
    
    // 文本输入事件监听
    textInput.addEventListener('input', function() {
        currentText = this.value;
        drawImage();
    });
    
    // 字体颜色事件监听
    fontColor.addEventListener('input', function() {
        currentFontColor = this.value;
        drawImage();
    });
    
    // 重置按钮事件监听
    resetBtn.addEventListener('click', function() {
        textInput.value = '';
        fontColor.value = '#ffffff';
        
        currentText = '';
        currentFontColor = '#ffffff';
        
        drawImage();
    });
    
    // 下载按钮事件监听
    downloadBtn.addEventListener('click', function() {
        // 创建临时链接
        const link = document.createElement('a');
        link.download = '编辑后的图片.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}); 