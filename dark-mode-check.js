// 检测暗黑模式插件
function isDarkModePluginActive() {
    // 检查 body 的背景颜色是否被插件修改
    const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
    const isDarkBackground = bodyBackgroundColor === 'rgb(0, 0, 0)' || bodyBackgroundColor === 'rgb(18, 18, 18)'; // 常见暗黑模式背景色

    // 检查 body 的 filter 或 transform 属性是否被插件修改
    const bodyFilter = window.getComputedStyle(document.body).filter;
    const isFilterApplied = bodyFilter.includes('invert') || bodyFilter.includes('hue-rotate');

    return isDarkBackground || isFilterApplied;
}

// 尝试禁用暗黑模式插件
function tryDisableDarkModePlugin() {
    // 尝试移除 body 的 filter 和 transform 属性
    document.body.style.filter = 'none';
    document.body.style.transform = 'none';

    // 尝试恢复默认背景颜色
    document.body.style.backgroundColor = '';
    document.documentElement.style.backgroundColor = '';

    // 检查是否禁用成功
    return !isDarkModePluginActive();
}

// 弹窗提示用户禁用暗黑模式插件
function showDarkModeWarning() {
    const warningMessage = `
        检测到您正在使用暗黑模式插件（如 Dark Reader），
        这可能会影响页面显示效果。
        请手动禁用插件以获得最佳体验。
    `;
    alert(warningMessage);
}

// 主函数：检测并处理暗黑模式插件
function handleDarkModePlugin() {
    if (isDarkModePluginActive()) {
        const isDisabled = tryDisableDarkModePlugin();
        if (!isDisabled) {
            showDarkModeWarning();
        }
    }
}

// 页面加载时执行
window.onload = function () {
    handleDarkModePlugin();
};

// 监听页面变化（防止插件在页面加载后动态应用样式）
new MutationObserver(handleDarkModePlugin).observe(document.body, {
    attributes: true,
    attributeFilter: ['style'],
});