document.addEventListener("DOMContentLoaded", function () {
    // انتخاب المان‌های HTML
    const container = document.getElementById("saved-codes-container");
    const searchInput = document.getElementById("searchInput");

    // بارگذاری کدهای ذخیره‌شده از localStorage
    const savedCodes = JSON.parse(localStorage.getItem("codes") || "{}");

    // انواع کدهای UC که ذخیره‌شده‌اند
    const ucTypes = ["60", "325", "660", "1800", "3850", "8100"];

    // برای هر نوع کد UC، یک جعبه ایجاد می‌کنیم
    ucTypes.forEach((type) => {
        const codes = savedCodes[type] || []; // دریافت کدها برای هر نوع
        const box = document.createElement("div");
        box.className = "uc-box"; // کلاس برای جعبه کد
        box.innerHTML = `
            <div class="uc-header" onclick="toggleBox(this)">
                کدهای ${type} UC
            </div>
            <div class="uc-codes" style="display:none;"></div>
        `;

        const codesContainer = box.querySelector(".uc-codes");

        // بررسی اینکه آیا کدی برای این دسته ذخیره شده است یا خیر
        if (codes.length === 0) {
            codesContainer.innerHTML = "<p>کدی برای این دسته ذخیره نشده است.</p>";
        } else {
            // برای هر کد ذخیره‌شده، یک المان ایجاد می‌کنیم
            codes.forEach((item, index) => {
                const codeElement = document.createElement("div");
                codeElement.className = `code-entry${item.used ? " used" : ""}${item.copied ? " copied" : ""}`;

                // تاریخ ثبت کد
                const createdDate = new Date(item.date);
                const created = isNaN(createdDate.getTime()) ? 'نامعتبر' : createdDate.toLocaleDateString('fa-IR');

                // تاریخ برداشت کد
                const claimed = item.claimedDate ? new Date(item.claimedDate).toLocaleDateString('fa-IR') : "ثبت نشده";

                // نمایش کد و توضیحات
                const displayCode = item.copied || item.used ? item.code : "******";
                const displayDesc = item.description || "توضیحی وارد نشده";

                // تولید شناسه کد (مثل 0001)
                const codeID = (index + 1).toString().padStart(4, "0");

                // اضافه کردن محتویات به المان کد
                codeElement.innerHTML = `
                    <div class="code-cell"><strong>شناسه:</strong> ${codeID}</div>
                    <div class="code-cell"><strong>تاریخ ثبت:</strong> ${created}</div>
                    <div class="code-cell"><strong>کد:</strong> <span class="code-text">${displayCode}</span></div>
                    <div class="code-cell"><strong>استفاده شده به آیدی :</strong> <span class="code-desc">${displayDesc}</span></div>
                    <div class="code-cell"><strong>تاریخ برداشت:</strong> <span class="code-claim">${claimed}</span></div>
                    <div class="actions">
                        <button onclick="copyCode('${item.code}', this, '${type}', ${index})">کپی</button>
                        <button onclick="deleteCode('${type}', ${index}, this)">حذف</button>
                    </div>
                `;

                // افزودن کد به جعبه
                codesContainer.appendChild(codeElement);
            });
        }

        // افزودن جعبه به کانتینر
        container.appendChild(box);
    });

    // نمایش کدهای حذف‌شده
    displayDeletedCodes();

    // جستجو در کدها
    searchInput.addEventListener("input", function () {
        const value = searchInput.value.toLowerCase();
        document.querySelectorAll(".code-entry").forEach(entry => {
            const code = entry.querySelector(".code-text").textContent.toLowerCase();
            const date = entry.querySelector(".code-cell:nth-child(2)").textContent.toLowerCase();
            entry.style.display = (code.includes(value) || date.includes(value)) ? "block" : "none";
        });
    });
});

// تابع برای نمایش کدهای حذف‌شده
function displayDeletedCodes() {
    const deletedCodesContainer = document.getElementById("deleted-codes-container");
    const deletedCodes = JSON.parse(localStorage.getItem("deletedCodes") || "[]");

    if (deletedCodes.length === 0) {
        deletedCodesContainer.innerHTML = "<p>هیچ کدی حذف نشده است.</p>";
    } else {
        deletedCodesContainer.innerHTML = "<h3>کدهای حذف‌شده:</h3>";

        deletedCodes.forEach((item, index) => {
            const deletedCodeElement = document.createElement("div");
            deletedCodeElement.className = "deleted-code-entry";

            // تاریخ حذف
            const deletedDate = new Date(item.date);
            const deleted = isNaN(deletedDate.getTime()) ? 'نامعتبر' : deletedDate.toLocaleDateString('fa-IR');

            // اضافه کردن اطلاعات کد حذف‌شده به نمایش
            deletedCodeElement.innerHTML = `
                <div class="code-cell"><strong>شناسه:</strong> ${item.code}</div>
                <div class="code-cell"><strong>تاریخ حذف:</strong> ${deleted}</div>
                <div class="code-cell"><strong>توضیحات:</strong> ${item.description || "توضیحی وارد نشده"}</div>
            `;

            // افزودن کد حذف‌شده به کانتینر
            deletedCodesContainer.appendChild(deletedCodeElement);
        });
    }
}

// تابع برای باز و بسته کردن جعبه‌های UC
function toggleBox(header) {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === "none" ? "block" : "none";
}

// تابع برای کپی کردن کد
function copyCode(code, btn, type, index) {
    const codeElement = btn.closest('.code-entry');

    if (codeElement.classList.contains('copied')) {
        alert("این کد قبلاً کپی شده است.");
        return;
    }

    const desc = prompt("لطفاً توضیحاتی برای این کد وارد کنید:\nمثلاً:\n〆96・AMIN〆\nPlayer ID: 5622641704");

    if (!desc) return;

    navigator.clipboard.writeText(code).then(() => {
        const savedCodes = JSON.parse(localStorage.getItem("codes") || "{}");
        const now = new Date().toISOString();

        savedCodes[type][index].description = desc;
        savedCodes[type][index].copied = true;
        savedCodes[type][index].claimedDate = now;

        localStorage.setItem("codes", JSON.stringify(savedCodes));

        const codeText = codeElement.querySelector(".code-text");
        codeText.innerText = code;

        codeElement.querySelector(".code-desc").innerText = desc;
        codeElement.querySelector(".code-claim").innerText = new Date(now).toLocaleDateString('fa-IR');

        codeElement.classList.add("copied");
        codeElement.style.backgroundColor = "#ffcccc";

        alert("کد با موفقیت کپی شد و توضیحات ذخیره گردید.");
    }).catch(err => {
        console.error("خطا در کپی:", err);
    });
}

// تابع برای حذف کد
function deleteCode(type, index, btn) {
    const savedCodes = JSON.parse(localStorage.getItem("codes") || "{}");

    if (savedCodes[type] && savedCodes[type][index]) {
        // حذف کد از localStorage
        const deletedCode = savedCodes[type].splice(index, 1)[0];
        deletedCode.date = new Date().toISOString(); // افزودن تاریخ حذف

        // ذخیره کد حذف شده در یک بخش جداگانه
        const deletedCodes = JSON.parse(localStorage.getItem("deletedCodes") || "[]");
        deletedCodes.push(deletedCode);
        localStorage.setItem("deletedCodes", JSON.stringify(deletedCodes));

        localStorage.setItem("codes", JSON.stringify(savedCodes));

        // حذف کد از صفحه
        const codeElement = btn.closest(".code-entry");
        codeElement.remove();

        alert("کد با موفقیت حذف شد.");
    }
}

// ویژگی گالری مانند (فقط در دسکتاپ)
document.addEventListener("DOMContentLoaded", function () {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    const allBoxes = document.querySelectorAll(".uc-box");

    allBoxes.forEach((box) => {
        const header = box.querySelector(".uc-header");
        header.addEventListener("click", () => {
            allBoxes.forEach(b => b.classList.remove("opened"));
            box.classList.add("opened");
        });
    });
});
