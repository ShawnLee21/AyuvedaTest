document.addEventListener("DOMContentLoaded", function () {
    const pages = document.querySelectorAll(".form-page");
    const nextButtons = document.querySelectorAll(".next-button");
    const prevButtons = document.querySelectorAll(".prev-button");
    const form = document.getElementById("ayurveda-test-form");
    const resultContainer = document.getElementById("result-container");

    let currentPage = 0;

    // 页面切换逻辑
    function showPage(index) {
        pages.forEach((page, i) => {
            page.classList.toggle("active", i === index);
        });
        resultContainer.style.display = "none";
    }
    showPage(currentPage);

    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    });

    // 提交表单并计算结果
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // 阻止默认表单提交

        // 初始化分数
        let scores = { vata: 0, pitta: 0, kapha: 0 };

        // 遍历表单数据并计算分数
        const formData = new FormData(form);
        formData.forEach((value) => {
            const inputElement = form.querySelector(`input[value="${value}"]`);
            if (inputElement) {
                const dosha = inputElement.getAttribute("data-dosha");
                if (dosha) {
                    scores[dosha]++;
                }
            }
        });

        // 计算比值
        const total = scores.vata + scores.pitta + scores.kapha;
        const vataRatio = total > 0 ? ((scores.vata / total) * 100).toFixed(2) : "0.00";
        const pittaRatio = total > 0 ? ((scores.pitta / total) * 100).toFixed(2) : "0.00";
        const kaphaRatio = total > 0 ? ((scores.kapha / total) * 100).toFixed(2) : "0.00";

        // 动态生成结果页面
        resultContainer.style.display = "block"; // 显示结果容器
        form.style.display = "none"; // 隐藏表单
        resultContainer.innerHTML = `
            <h2>您的测试结果：</h2>
            <ul>
                <li class="vata">风能 (Vata)：${scores.vata} 分 (${vataRatio}%)</li>
                <li class="pitta">火能 (Pitta)：${scores.pitta} 分 (${pittaRatio}%)</li>
                <li class="kapha">水能 (Kapha)：${scores.kapha} 分 (${kaphaRatio}%)</li>
            </ul>
            <div class="button-container">
                <button id="restart-test" class="restart-button">重新测试</button>
            </div>
        `;

        // 添加重新测试逻辑
        const restartBtn = document.getElementById("restart-test");
        restartBtn.addEventListener("click", function () {
            form.reset(); // 重置表单
            resultContainer.style.display = "none"; // 隐藏结果容器
            form.style.display = "block"; // 显示表单
            showPage(0); // 返回第一页
        });
    });
});
