function downloadJsonAsJson(jsonData, fileName) {
    // 将 JSON 数据转换为 JSON 字符串
    const jsonContent = JSON.stringify(jsonData, null, 2);

    // 创建一个 Blob 对象
    const blob = new Blob([jsonContent], { type: "application/json" });

    // 创建一个链接元素
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".json";

    // 模拟点击下载链接
    link.click();
}
export { downloadJsonAsJson }