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
            page.style.display = i === index ? "block" : "none";
        });
        resultContainer.style.display = "none"; // 隐藏结果容器
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
    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // 阻止默认表单提交

        // 收集表单数据
        const formData = new FormData(form);
        const answers = {};
        formData.forEach((value, key) => {
            answers[key] = value;
        });

        // 统计 Dosha 的分数
        const doshaCounts = { vata: 0, pitta: 0, kapha: 0 };
        for (const [key, value] of Object.entries(answers)) {
            const dosha = form.querySelector(`input[name="${key}"][value="${value}"]`)?.getAttribute("data-dosha");
            if (dosha) {
                doshaCounts[dosha]++;
            }
        }

        // 计算比值
        const total = doshaCounts.vata + doshaCounts.pitta + doshaCounts.kapha;
        const ratios = {
            vata: ((doshaCounts.vata / total) * 100).toFixed(2) + "%",
            pitta: ((doshaCounts.pitta / total) * 100).toFixed(2) + "%",
            kapha: ((doshaCounts.kapha / total) * 100).toFixed(2) + "%",
        };

        // 动态生成结果内容
        resultContainer.innerHTML = `
            <h2>测试结果</h2>
            <ul>
                <li class="vata">Vata: ${doshaCounts.vata} 分 (${ratios.vata})</li>
                <li class="pitta">Pitta: ${doshaCounts.pitta} 分 (${ratios.pitta})</li>
                <li class="kapha">Kapha: ${doshaCounts.kapha} 分 (${ratios.kapha})</li>
            </ul>
            <div class="button-container">
                <button id="restart-test" class="restart-button">重新测试</button>
            </div>
        `;
        resultContainer.style.display = "block"; // 显示结果容器
        form.style.display = "none"; // 隐藏表单

        // 添加重新测试功能
        document.getElementById("restart-test").addEventListener("click", function () {
            form.reset(); // 重置表单
            resultContainer.style.display = "none"; // 隐藏结果容器
            form.style.display = "block"; // 显示表单
            showPage(0); // 返回第一页
        });

        // 提交数据到后端
        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(answers),
            });

            const result = await response.json();
            if (result.status === "success") {
                console.log("数据成功保存");
            } else {
                console.error("数据保存失败:", result.message);
            }
        } catch (error) {
            console.error("提交失败:", error);
        }
    });
});
