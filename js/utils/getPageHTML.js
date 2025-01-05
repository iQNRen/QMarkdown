// 获取页面HTML的函数
export const getPageHTML = () => {

    const urlXpathMap = {
        'deepseek': '//*[@id="root"]/div/div[2]/div[2]/div/div[2]/div/div/div[1]',
        'chatgpt': '/html/body/div[1]/div[2]/main/div[1]/div[1]/div/div/div/div'
    }

    // 移除<style>和<script>标签
    const styles = document.querySelectorAll('style');
    const scripts = document.querySelectorAll('script');

    styles.forEach(style => style.remove());
    scripts.forEach(script => script.remove());

    // return document.documentElement.outerHTML;
    // 获取目标 div
    for (const key in urlXpathMap) {
        if (window.location.href.includes(key)) {
            const xpathResult = document.evaluate(urlXpathMap[key], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const targetDiv = xpathResult.singleNodeValue;
            return targetDiv.outerHTML;
        }
    }
}