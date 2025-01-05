import { extractHtmlToMarkdown } from './rightClick.js'

// 创建右键菜单项
chrome.contextMenus.create({
    id: "convertHtmlToMarkdown",
    title: "Convert to Markdown",
    contexts: ["all"] // 在所有上下文中显示右键菜单
}, () => {
    if (chrome.runtime.lastError) {
        console.error("Failed to create context menu:", chrome.runtime.lastError);
    } else {
        console.log("Context menu created successfully.");
    }
});


// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "convertHtmlToMarkdown") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractHtmlToMarkdown
        }, (results) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                console.log("Scripts executed successfully:", results);
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.markdown) {
        console.log("Received Markdown:", request.markdown);
    }
});

// 快捷键启动
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'open-memo-extension') {
        try {
            // 获取所有窗口
            const windows = await chrome.windows.getAll();

            if (windows.length > 0) {
                // 如果有活动的窗口，则继续操作
                const popupWindow = windows.find((win) => win.type === 'popup');

                if (popupWindow) {
                    // 如果 Popup 窗口存在，则关闭它
                    chrome.windows.remove(popupWindow.id);
                    console.log('Popup 窗口已关闭');
                } else {
                    // 如果 Popup 窗口不存在，则打开它
                    chrome.action.openPopup();
                    // window.open(chrome.runtime.getURL('popup.html'), '_blank', 'width=400,height=600');
                    console.log('Popup 窗口已打开');
                }
            } else {
                console.error('没有活动的浏览器窗口');
            }
        } catch (error) {
            console.error('操作失败：', error);
        }
    }
});

// 保持 Service Worker 活动状态
setInterval(() => {
    console.log("Service Worker is alive.");
}, 1000 * 60); // 每分钟记录一次

// chrome.commands.onCommand.addListener(async (command) => {
//     if (command === 'open-memo-extension') {
//         try {
//             // 获取所有窗口
//             const windows = await chrome.windows.getAll();

//             if (windows.length > 0) {
//                 // 如果有活动的窗口，则继续操作
//                 const popupWindow = windows.find((win) => win.type === 'popup');

//                 if (popupWindow) {
//                     // 如果 Popup 窗口存在，则关闭它
//                     chrome.windows.remove(popupWindow.id);
//                     console.log('Popup 窗口已关闭');
//                 } else {
//                     // 如果 Popup 窗口不存在，则创建一个新窗口
//                     chrome.windows.create({
//                         url: chrome.runtime.getURL('popup.html'),
//                         type: 'popup',
//                         width: 400,
//                         height: 600
//                     });
//                     console.log('Popup 窗口已打开');
//                 }
//             } else {
//                 console.error('没有活动的浏览器窗口');
//             }
//         } catch (error) {
//             console.error('操作失败：', error);
//         }
//     }
// });