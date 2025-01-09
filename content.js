// 在执行主要功能之前，先检查功能是否启用
chrome.storage.sync.get(['enabled'], function (result) {
    const isEnabled = result.enabled ?? true; // 默认为启用状态
    if (isEnabled) {
        console.log('功能已启用');
        // 定义一个函数，负责为当前表格添加超链接
        function enhanceTable() {
            const cells = document.querySelectorAll('div[data-field="COURSE_SUBCLASS"] span');

            cells.forEach((cell) => {
                const fullCourseName = cell.innerText;
                if (fullCourseName) {
                    const courseName = fullCourseName.split('-')[0]; // 仅保留课程名称部分

                    // 检查是否已经有超链接
                    if (cell.querySelector('a')) return;

                    // 将课程名称替换为动态生成的超链接
                    const link = document.createElement('a');
                    link.href = `https://richku.com/courses/${courseName}`;
                    link.innerText = fullCourseName;
                    link.target = '_blank'; // 新标签页打开

                    cell.innerHTML = '';
                    cell.appendChild(link);
                }
            });
        }

        // 使用 MutationObserver 监听表格加载状态（处理加载中和加载完成）
        function monitorLoadingState() {
            const tableContainer = document.querySelector('.MuiDataGrid-root');

            if (!tableContainer) {
                console.log("表格根容器尚未加载，等待...");
                setTimeout(monitorLoadingState, 500); // 每500ms重新检查一次
                return;
            }

            const observer = new MutationObserver(() => {
                const loadingElements = document.querySelectorAll('.MuiSkeleton-root');
                if (loadingElements.length > 0) {
                    console.log("检测到表格加载中...");
                } else {
                    console.log("表格加载完成，启动监听器");
                    enhanceTable(); // 添加超链接
                }
            });

            // 配置 MutationObserver 监听子节点变化
            observer.observe(tableContainer, { childList: true, subtree: true });

            console.log("已启动表格加载状态监听");
        }

        // 使用 MutationObserver 检测页面整体变化（处理动态加载的表格）
        function monitorPageChanges() {
            const pageObserver = new MutationObserver(() => {
                console.log("检测到页面变化，重新检查表格...");
                monitorLoadingState(); // 确保加载状态持续检测
            });

            pageObserver.observe(document.body, { childList: true, subtree: true });

            console.log("已启动页面变化监听");
        }

        // 初始执行加载状态检测和页面变化监听
        setTimeout(() => {
            monitorLoadingState(); // 持久化监听加载状态
            monitorPageChanges(); // 检测表格是否被动态替换
        }, 1000);
    } else {
        console.log('功能已禁用');
    }
});
