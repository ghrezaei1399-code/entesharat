/* =========================================================
   Discount Show — Worker module
   بدون وابستگی به OpenAI
   ========================================================= */

const DISCOUNT_OFFERS = {
  innovation: {
    title: "نوآوری اثر",
    discount: "10%",
    type: "مجوز"
  },

  social: {
    title: "حل مشکل اجتماعی، فردی و کشوری",
    discount: "10%",
    type: "چاپ"
  },

  youth: {
    title: "جذاب برای جوانان",
    discount: "10%",
    type: "چاپ"
  },

  technology: {
    title: "رویکرد حوزه فناوری و هوش مصنوعی",
    discount: "20%",
    type: "مجوز"
  }
};


/* ---------------------------------------------------------
   پاسخ JSON
--------------------------------------------------------- */

function json(data, status = 200, cors = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...cors,
        "Content-Type": "application/json; charset=UTF-8"
      }
    }
  );
}


/* ---------------------------------------------------------
   تولید کد رهگیری
--------------------------------------------------------- */

function createTrackingCode() {

  const random =
    crypto.randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();

  return `DS-${random}`;
}


/* ---------------------------------------------------------
   ثبت درخواست تخفیف
--------------------------------------------------------- */

export async function createDiscountApplication(body, env) {

  const type = body.type;
  const email = String(body.email || "").trim();
  const description = String(body.description || "").trim();

  if (!type || !DISCOUNT_OFFERS[type]) {
    return {
      ok: false,
      status: 400,
      error: "نوع تخفیف معتبر نیست."
    };
  }

  if (!email) {
    return {
      ok: false,
      status: 400,
      error: "آدرس ایمیل وارد نشده است."
    };
  }

  if (!description) {
    return {
      ok: false,
      status: 400,
      error: "معرفی اثر وارد نشده است."
    };
  }

  const trackingCode = createTrackingCode();

  const application = {
    trackingCode,

    type,

    offer: DISCOUNT_OFFERS[type],

    email,

    description,

    fileName: body.fileName || "",

    fileSize: Number(body.fileSize || 0),

    status: "received",

    statusTitle: "درخواست دریافت شد",

    createdAt: new Date().toISOString()
  };


  /*
   * اگر KV متصل باشد، درخواست ذخیره می‌شود.
   *
   * نام Binding:
   * DISCOUNT_KV
   */

  if (env.DISCOUNT_KV) {

    await env.DISCOUNT_KV.put(
      `discount:${trackingCode}`,
      JSON.stringify(application)
    );

  }


  return {
    ok: true,
    status: 200,

    trackingCode,

    status: application.status,

    statusTitle: application.statusTitle,

    message:
      "درخواست شما با موفقیت دریافت شد. کد رهگیری خود را نگهداری کنید."
  };
}


/* ---------------------------------------------------------
   پیگیری درخواست
--------------------------------------------------------- */

export async function checkDiscountTracking(code, env) {

  const trackingCode =
    String(code || "")
      .trim()
      .toUpperCase();

  if (!trackingCode) {
    return {
      ok: false,
      status: 400,
      error: "کد رهگیری وارد نشده است."
    };
  }


  if (!env.DISCOUNT_KV) {

    return {
      ok: false,
      status: 503,
      error:
        "سامانه ذخیره درخواست‌ها هنوز به Worker متصل نشده است."
    };
  }


  const raw =
    await env.DISCOUNT_KV.get(
      `discount:${trackingCode}`
    );


  if (!raw) {

    return {
      ok: false,
      status: 404,
      error:
        "درخواستی با این کد رهگیری پیدا نشد."
    };
  }


  const application =
    JSON.parse(raw);


  return {
    ok: true,
    status: 200,

    trackingCode:
      application.trackingCode,

    status:
      application.status,

    statusTitle:
      application.statusTitle,

    offer:
      application.offer,

    createdAt:
      application.createdAt
  };
}


/* ---------------------------------------------------------
   تغییر وضعیت توسط مدیر
--------------------------------------------------------- */

export async function updateDiscountStatus(body, env) {

  if (!env.DISCOUNT_KV) {

    return {
      ok: false,
      status: 503,
      error:
        "سامانه ذخیره درخواست‌ها هنوز متصل نشده است."
    };
  }


  const trackingCode =
    String(body.trackingCode || "")
      .trim()
      .toUpperCase();


  const newStatus =
    String(body.status || "").trim();


  const allowedStatuses = {

    received: "درخواست دریافت شد",

    reviewing: "در حال بررسی",

    approved: "درخواست تأیید شد",

    rejected: "درخواست رد شد",

    completed: "فرایند تکمیل شد"

  };


  if (!allowedStatuses[newStatus]) {

    return {
      ok: false,
      status: 400,
      error: "وضعیت نامعتبر است."
    };
  }


  const raw =
    await env.DISCOUNT_KV.get(
      `discount:${trackingCode}`
    );


  if (!raw) {

    return {
      ok: false,
      status: 404,
      error: "کد رهگیری پیدا نشد."
    };
  }


  const application =
    JSON.parse(raw);


  application.status =
    newStatus;


  application.statusTitle =
    allowedStatuses[newStatus];


  application.updatedAt =
    new Date().toISOString();


  await env.DISCOUNT_KV.put(

    `discount:${trackingCode}`,

    JSON.stringify(application)

  );


  return {

    ok: true,

    status: 200,

    trackingCode,

    statusTitle:
      application.statusTitle

  };
}
