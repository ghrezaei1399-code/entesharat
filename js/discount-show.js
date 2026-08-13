/* =========================================================
   تخفیف شو — Discount Show
   ========================================================= */

const DiscountShow = (() => {

    const API_URL = "https://entesharat-ai.ghrezaei1399.workers.dev/";

    const offers = {
        innovation: {
            title: "نوآوری اثر",
            description: "۱۰٪ تخفیف در هزینه مجوز"
        },

        social: {
            title: "حل مشکل اجتماعی، فردی و کشوری",
            description: "۱۰٪ تخفیف در هزینه چاپ به هر تعداد"
        },

        youth: {
            title: "جذاب برای جوانان",
            description: "۱۰٪ تخفیف در چاپ تا حداقل ۱۰۰ نسخه فیزیکی"
        },

        technology: {
            title: "رویکرد حوزه فناوری و هوش مصنوعی",
            description: "۲۰٪ تخفیف در هزینه مجوز"
        }
    };


    function openForm(type) {

        const offer = offers[type];

        if (!offer) return;

        document.getElementById("discountType").value = type;

        document.getElementById("discountFormTitle").textContent =
            "ارسال اثر — " + offer.title;

        document.getElementById("discountFormDescription").textContent =
            offer.description;

        document.getElementById("discountFormStatus").textContent = "";

        const modal = document.getElementById("discountFormModal");

        modal.setAttribute("aria-hidden", "false");
        modal.classList.add("active");

        document.body.classList.add("discount-modal-open");
    }


    function closeForm() {

        const modal = document.getElementById("discountFormModal");

        if (!modal) return;

        modal.setAttribute("aria-hidden", "true");
        modal.classList.remove("active");

        document.body.classList.remove("discount-modal-open");
    }


    async function submitForm(event) {

        event.preventDefault();

        const status = document.getElementById("discountFormStatus");

        const email =
            document.getElementById("discountEmail").value.trim();

        const description =
            document.getElementById("discountAuthor").value.trim();

        const file =
            document.getElementById("discountFile").files[0];

        const type =
            document.getElementById("discountType").value;


        if (!email || !description || !file || !type) {

            status.textContent =
                "لطفاً همه اطلاعات را تکمیل کنید.";

            status.className = "error";

            return;
        }


        status.textContent =
            "در حال ارسال درخواست...";

        status.className = "loading";


        /*
         * فعلاً اطلاعات فرم را آماده می‌کنیم.
         * ارسال فایل و ارسال ایمیل در گام بعدی به Worker
         * متصل خواهد شد.
         */

        const requestData = {
            type,
            email,
            description,
            fileName: file.name,
            fileSize: file.size,
            createdAt: new Date().toISOString()
        };


        console.log(
            "Discount Show request:",
            requestData
        );


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are the Discount Show request assistant."
                        },
                        {
                            role: "user",
                            content:
                                JSON.stringify(requestData)
                        }
                    ]

                })

            });


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result?.error?.message ||
                    result?.error ||
                    "خطا در ارتباط با سرویس."
                );

            }


            status.textContent =
                "درخواست شما با موفقیت ثبت شد.";

            status.className = "success";


        } catch (error) {

            console.error(
                "Discount Show error:",
                error
            );

            status.textContent =
                "فعلاً امکان ارسال درخواست وجود ندارد.";

            status.className = "error";

        }

    }


    async function checkTracking() {

        const input =
            document.getElementById("discountTrackingCode");

        const result =
            document.getElementById("discountTrackingResult");

        const code =
            input.value.trim();


        if (!code) {

            result.textContent =
                "کد رهگیری را وارد کنید.";

            result.className = "error";

            return;
        }


        /*
         * اتصال واقعی رهگیری در گام Worker انجام می‌شود.
         */

        result.textContent =
            "در حال بررسی کد رهگیری...";

        result.className = "loading";


        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a tracking assistant for Discount Show."
                        },
                        {
                            role: "user",
                            content:
                                `کد رهگیری را بررسی کن: ${code}`
                        }
                    ]

                })

            });


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data?.error?.message ||
                    data?.error ||
                    "خطا در بررسی کد."
                );

            }


            const answer =
                data?.choices?.[0]?.message?.content ||
                "اطلاعاتی برای این کد پیدا نشد.";


            result.textContent = answer;
            result.className = "success";


        } catch (error) {

            console.error(
                "Tracking error:",
                error
            );

            result.textContent =
                "در حال حاضر امکان بررسی کد رهگیری وجود ندارد.";

            result.className = "error";

        }

    }


    function init() {

        const form =
            document.getElementById("discountSubmissionForm");

        if (form) {

            form.addEventListener(
                "submit",
                submitForm
            );

        }


        const modal =
            document.getElementById("discountFormModal");

        if (modal) {

            modal.addEventListener(
                "click",
                event => {

                    if (event.target === modal) {
                        closeForm();
                    }

                }
            );

        }

    }


    return {
        init,
        openForm,
        closeForm,
        checkTracking
    };

})();


document.addEventListener(
    "DOMContentLoaded",
    () => DiscountShow.init()
);
