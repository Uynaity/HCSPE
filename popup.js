document.addEventListener('DOMContentLoaded', function() {
    // 获取开关和按钮元素
    const enableSwitch = document.querySelector('.switch input[type="checkbox"]');
    const feedbackButton = document.querySelector('.button-secondary');
    const platformButton = document.querySelector('.button-primary');

    // 从 storage 加载开关状态
    chrome.storage.sync.get('enabled', function(result) {
        enableSwitch.checked = result.enabled ?? true; // 使用空值合并运算符，默认为 true
    });

    // 监听开关变化
    enableSwitch.addEventListener('change', function() {
        const isEnabled = enableSwitch.checked;
        chrome.storage.sync.set({
            enabled: isEnabled
        }, function() {
            console.log('启用状态已更新:', isEnabled);
            // 可选：添加视觉反馈
            if (chrome.runtime.lastError) {
                console.error('保存状态失败:', chrome.runtime.lastError);
            }
        });
    });

    // 反馈按钮点击事件
    feedbackButton.addEventListener('click', () => {
        window.open('https://github.com/your-repo/issues', '_blank');
    });

    // RIC选课平台按钮点击事件
    platformButton.addEventListener('click', () => {
        window.open('https://richku.com', '_blank');
    });
}); 