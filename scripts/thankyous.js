
  
// Select campaign based on whether this is a VIP page or not  
const getVrioCampaignInfoBasedOnPaymentMethod = (isVipUpsell) => {
    const vrioCampaigns = [{"_id":"696a4531a531c62359271f0b","integration":[{"_id":"685435949a3a8c5ffb4854ef","workspace":"develop","platform":"vrio","description":"dev, team api","fields":{"publicApiKey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjoibXZtdHNhbmRib3gudnJpbyIsImlkIjoiNTQxNzM0MWMtOTI3ZS00YTc5LTk5MTQtMzcxM2IyM2RlMTNlIiwiaWF0IjoxNzUwMDk4ODg1LCJhdWQiOiJ1cm46dnJpbzphcGk6dXNlciIsImlzcyI6InVybjp2cmlvOmFwaTphdXRoZW50aWNhdG9yIiwic3ViIjoidXJuOnZyaW86YXBpOjE4In0.z4qwr2v87T3wq73w1nT8aSASKIMVLnL0HX1E-2tavrs"},"status":"active","createdAt":1750335264215,"updatedAt":1750349204667,"__v":0,"category":"CRM","id":"685435949a3a8c5ffb4854ef"}],"externalId":"39","name":"Vi-Shift - Network - (1)","currency":"USD","countries":[223,38],"metadata":{"campaign_id":39,"campaign_name":"","payment_type_id":1,"campaign_active":true,"campaign_prepaid":true,"campaign_payment_method_required":true,"campaign_group_transactions":true,"campaign_global_js":"","campaign_global_seo_title":"","campaign_global_seo_keywords":"","campaign_global_seo_description":"","date_created":"2026-03-30 16:13:14","created_by":0,"date_modified":"2026-03-30 16:13:14","modified_by":0,"campaign_notes":"","offers":[],"shipping_profiles":[],"campaignId":"39","externalId":39,"description":"","payment_methods":["amex","discover","visa","master"],"alternative_payments":[],"countries":[{"iso_numeric":840,"calling_code":"1","id":223,"name":"United States of America","iso_2":"US","iso_3":"USA"},{"iso_numeric":124,"calling_code":"1","id":38,"name":"Canada","iso_2":"CA","iso_3":"CAN"}]},"funnels":[],"createdAt":1768339039473,"updatedAt":1774887194515,"packages":[],"status":"active","platform":"vrio","__v":6,"id":"696a4531a531c62359271f0b"}];

    const vrioIntegration = vrioCampaigns.find(({ integration }) =>
      integration.find((int) => int.platform === 'vrio'),
    )?.integration.find((int) => int.platform === 'vrio');
    if (!vrioIntegration) {
      console.log('CRM Integration not available in funnel campaign.');
      throw new Error('CRM Integration not available in funnel campaign.');
    }

    // If this is a VIP page (recurring billing), try to find a VIP campaign
    // const campaignBasedOnBillingModel = vrioCampaigns.find((campaign) => {
    //   if (!campaign.name) {
    //     return false;
    //   }
    //   const isVipCampaign = campaign.name.toUpperCase().includes('VIP');
    //   if (isVipUpsell) {
    //     return isVipCampaign;
    //   }
    //   return !isVipCampaign;
    // });
    const campaignBasedOnBillingModel = vrioCampaigns[0];

    if (!campaignBasedOnBillingModel) {
      throw new Error(`No ${isVipUpsell ? 'VIP' : 'non-VIP'} campaign found in funnel.`);
    }

    const auditedVrioCampaignId = (() => window.VRIO?.campaignId)();
    const vrioCampaignId = auditedVrioCampaignId ?? campaignBasedOnBillingModel.externalId;
    const countries = campaignBasedOnBillingModel.metadata.countries;
    const integrationId = vrioIntegration?._id.toString();
    const currency = (campaignBasedOnBillingModel.currency || "USD").toLowerCase();

    return {
      vrioCampaignId,
      countries,
      integrationId,
      currency,
    };
  };

;
// For thank you without upsell, use non-VIP campaign
const campaignInfo = getVrioCampaignInfoBasedOnPaymentMethod(false);
const CAMPAIGN_ID = campaignInfo.vrioCampaignId;
const INTEGRATION_ID = campaignInfo.integrationId;
const CURRENCY = "USD";

const CURRENCY_LOCALE_MAP = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
};
const LOCALE = getLocaleFromCurrency(CURRENCY);

function getLocaleFromCurrency(currencyCode) {
  const code = (currencyCode || '').toUpperCase();
  if (code && CURRENCY_LOCALE_MAP[code]) return CURRENCY_LOCALE_MAP[code];
  return navigator.language || 'en-US';
};

function formatPrice(amount, suffix = '') {
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted}${suffix}`;
};


const i18n = {
  "iso2": "US",
  "phoneInitialCountry": "us",
  "dateFormat": "MM/DD/YYYY",
  "fallbackCountry": {
    "iso_numeric": 840,
    "calling_code": "1",
    "id": 223,
    "name": "United States of America",
    "iso_2": "US",
    "iso_3": "USA"
  },
  "pricingText": {
    "off": "OFF",
    "free": "FREE",
    "freeShipping": "Free Shipping",
    "perUnit": "/ea",
    "selectedProduct": "Selected Product"
  },
  "validation": {
    "expirationDateRequired": "* Expiration date is required",
    "expirationDateInvalid": "* Invalid or expired date",
    "cardNumberRequired": "* Enter a valid card number",
    "cardNumberInvalid": "* Invalid card number",
    "cardCvvRequired": "* Card CVV is required",
    "cardCvvMinLength": "* Card CVV must have at least 3 digits",
    "emailRequired": "* Please enter the e-mail address",
    "emailInvalid": "* Email is invalid",
    "firstNameRequired": "* First name is required",
    "lastNameRequired": "* Last name is required",
    "invalidCharacter": "* Contains an invalid character",
    "shippingAddressRequired": "* Shipping address is required",
    "cityRequired": "* City is required",
    "countryRequired": "* Country is required",
    "stateRequired": "* State/Province is required",
    "zipRequired": "* ZIP/Postcode is required",
    "zipInvalid": "* Invalid ZIP/Postcode code",
    "phoneInvalid": "* Please enter a valid phone number",
    "maxLength255": "* Maximum 255 characters",
    "billingAddressRequired": "* Billing address is required",
    "billingCityRequired": "* Billing city is required",
    "billingZipRequired": "* Billing ZIP/Postcode code is required"
  },
  "errors": {
    "walletVerificationFailed": "This payment needs additional verification. Please try a different payment method.",
    "walletOrderFailed": "Something went wrong creating your order, please try again",
    "unexpectedError": "An unexpected error occurred. Please try again.",
    "paymentDeclined": "Your payment could not be processed. Please try a different payment method.",
    "systemErrorOffer": "There was a problem with this offer. Please contact support or try again later.",
    "systemErrorGeneric": "Something went wrong processing your order. Please try again or contact support if the problem persists.",
    "klarnaNotAvailableRecurring": "Klarna is not available for recurring products.",
    "klarnaNotAvailable": "Klarna is not available.",
    "klarnaSubscriptionsNotSupported": "Subscriptions are not supported with Klarna",
    "klarnaOrderFailed": "Something went wrong creating the order, please try again",
    "klarnaProcessingFailed": "Something went wrong processing your order, please try again",
    "klarnaPaymentNotCompleted": "Klarna payment was not completed",
    "klarnaPaymentNotCompletedRedirect": "Klarna payment was not completed. Redirecting to checkout...",
    "klarnaCompletionFailed": "Something went wrong completing your Klarna payment.",
    "orderAlreadyCompleteRedirect": "Order is already complete. Redirecting to the next page...",
    "unexpectedErrorRedirect": "An unexpected error occurred. Redirecting to checkout...",
    "orderNotFoundRedirect": "Order not found. Redirecting to checkout...",
    "orderNotFound": "Order not found. Please try again.",
    "orderCanceled": "Order canceled",
    "creditCardOrderFailed": "Something went wrong, please try again",
    "upsellOrderFailed": "Something went wrong adding offers, please try again",
    "countryNotAvailableNamed": "The country {name} is not available, please choose another.",
    "countryNotAvailable": "This country is not available, please choose another."
  },
  "labels": {
    "noStatesAvailable": "No States or Provinces Available for this Country",
    "selectState": "Select state",
    "phoneSearchPlaceholder": "Search"
  }
};

// Validation patterns (RegExp – cannot be serialised as JSON)
i18n.validationPatterns = {
  zipCodeRegex: /^(?:\d{5}(?:-\d{4})?|[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d|\d{4}|[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[ABD-HJLN-UW-Z]{2})$/,
  nameRegex: /\b([A-ZÀ-ÿ][-,a-zÀ-ÿ. ']+[ ]*)+$/i,
};

function formatDateByConvention(year, month, day) {
  return `${month}/${day}/${year}`;
}

const THANK_YOU_NEXT_PAGE_SLUG = "";

function getNextPageSlugForRedirect() {
  const normalize = (value) => {
    if (!value) return "";
    return value.startsWith("/") ? value : "/" + value;
  };
  if (THANK_YOU_NEXT_PAGE_SLUG) return normalize(THANK_YOU_NEXT_PAGE_SLUG);
  return "/";
}
const PAYMENT_METHODS_IDS = {"creditCard":1,"googlePay":3,"applePay":4,"paypal":6,"klarna":12};

const prices = [{"id":232,"name":"1x EXTRA Vi-Shift Glasses","quantity":1,"price":19.99,"shippable":false,"fullPrice":19.99,"finalPrice":19.99,"productName":"1x EXTRA Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"id":224,"name":"1x Flexible Glasses","quantity":1,"price":29.99,"shippable":false,"fullPrice":29.99,"finalPrice":29.99,"productName":"1x Flexible Glasses","discountAmount":0,"discountPercentage":0},{"id":59,"name":"1x USB 3.0 Quick Charger","quantity":1,"price":0,"shippable":false,"fullPrice":10,"finalPrice":10,"productName":"1x USB 3.0 Quick Charger","discountAmount":0,"discountPercentage":0},{"id":225,"name":"2x Vi-Shift Glasses","quantity":1,"price":53.98,"shippable":false,"fullPrice":53.98,"finalPrice":53.98,"productName":"2x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"id":230,"name":"3 Year Extended Warranty","quantity":1,"price":10,"shippable":false,"fullPrice":10,"finalPrice":10,"productName":"3 Year Extended Warranty","discountAmount":0,"discountPercentage":0},{"id":226,"name":"3x Vi-Shift Glasses","quantity":1,"price":71.97,"shippable":false,"fullPrice":71.97,"finalPrice":71.97,"productName":"3x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"id":227,"name":"4x Vi-Shift Glasses","quantity":1,"price":83.96,"shippable":false,"fullPrice":83.96,"finalPrice":83.96,"productName":"4x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"id":228,"name":"5x Vi-Shift Glasses","quantity":1,"price":89.95,"shippable":false,"fullPrice":89.95,"finalPrice":89.95,"productName":"5x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"id":231,"name":"Journey Package Protection","quantity":1,"price":3.5,"shippable":false,"fullPrice":3.5,"finalPrice":3.5,"productName":"Journey Package Protection","discountAmount":0,"discountPercentage":0},{"id":233,"name":"Vi-Shift Glasses - Expedited Shipping","quantity":1,"price":9.99,"shippable":false,"fullPrice":9.99,"finalPrice":9.99,"productName":"Vi-Shift Glasses - Expedited Shipping","discountAmount":0,"discountPercentage":0},{"id":229,"name":"Vi-Shift Protective Case Upgrade","quantity":1,"price":9.95,"shippable":false,"fullPrice":9.95,"finalPrice":9.95,"productName":"Vi-Shift Protective Case Upgrade","discountAmount":0,"discountPercentage":0}];
const isKlarnaSelected = ({ walletsConfig } = {}) => {
  if (walletsConfig && typeof walletsConfig === "object") {
    if (!(walletsConfig.enabled && walletsConfig.enableKlarna)) return false;
  } else {
    try {
      const stored = sessionStorage.getItem("isKlarnaEnabled");
      if (stored !== null && JSON.parse(stored) !== true) return false;
    } catch {}
  }
  try {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    return Number(orderData?.payment_method_id) === 12;
  } catch {
    return false;
  }
};
const isKlarnaPayment = isKlarnaSelected();

const applyKlarnaVisibilityForThankYou = () => {
  
  const setKlarnaElementVisibility = (element, shouldHide) => {
    if (!element) return;
    if (shouldHide) {
      element.style.setProperty("display", "none", "important");
      element.setAttribute("aria-hidden", "true");
    } else {
      element.style.removeProperty("display");
      element.setAttribute("aria-hidden", "false");
    }
  };
  let hiddenKlarnaTargetsCount = 0;
  document
    .querySelectorAll("[data-hide-on-klarna]")
    .forEach((element) => {
      if (isKlarnaPayment) hiddenKlarnaTargetsCount += 1;
      setKlarnaElementVisibility(element, isKlarnaPayment);
    });
  document
    .querySelectorAll("[data-show-on-klarna]")
    .forEach((element) => setKlarnaElementVisibility(element, !isKlarnaPayment));
  

};

if (false) {
  sessionStorage.removeItem('cart');
  sessionStorage.removeItem('cart_token');
  sessionStorage.removeItem('payment_token_id');
  sessionStorage.removeItem('PayerID');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('ba_token');
}
const elementsMappingContent = {
  // lead data
  "[data-email]": (orderDetails) => orderDetails.customer.email,
  "[data-first-name]": (orderDetails) => orderDetails.customer_address_shipping.fname,
  "[data-last-name]": (orderDetails) => orderDetails.customer_address_shipping.lname,
  "[data-billing-first-name]": (orderDetails) => orderDetails.customer_address_billing.fname ?? orderDetails.customer_address_shipping.fname,
  "[data-billing-last-name]": (orderDetails) => orderDetails.customer_address_billing.lname ?? orderDetails.customer_address_shipping.lname,
  "[data-phone]": (orderDetails) => orderDetails.customer.phone,

  // shipping address
  "[data-line-1]": (orderDetails) =>
    orderDetails.customer_address_shipping.address1,
  "[data-line-2]": (orderDetails) =>
    orderDetails.customer_address_shipping.address2,
  "[data-city]": (orderDetails) => orderDetails.customer_address_shipping.city,
  "[data-select-countries]": (orderDetails) =>
    orderDetails.customer_address_shipping.country,
  "[data-select-states]": (orderDetails) =>
    orderDetails.customer_address_shipping.state,
  "[data-zip-code]": (orderDetails) =>
    orderDetails.customer_address_shipping.zipcode,

  // billing address
  "[data-billing-line-1]": (orderDetails) =>
    orderDetails.customer_address_billing.address1,
  "[data-billing-line-2]": (orderDetails) =>
    orderDetails.customer_address_billing.address2,
  "[data-billing-city]": (orderDetails) =>
    orderDetails.customer_address_billing.city,
  "[data-billing-select-countries]": (orderDetails) =>
    orderDetails.customer_address_billing.country,
  "[data-billing-select-states]": (orderDetails) =>
    orderDetails.customer_address_billing.state,
  "[data-billing-zip-code]": (orderDetails) =>
    orderDetails.customer_address_billing.zipcode,

  // order data
  "[data-holder='order_date']": (orderDetails) => {
    if (orderDetails) {
      // "2023-04-01 00:00:00" → "2023-04-01"
      const isoDate = orderDetails.date_created.split(" ")[0]; 
      const [year, month, day] = isoDate.split("-");
      return formatDateByConvention(year, month, day);
    }

    // Fallback: today's date
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return formatDateByConvention(year, month, day);
  },
};


let isTest = JSON.parse(sessionStorage.getItem("test"));
if (isTest === null && isTest !== false) {
  isTest = true;
  sessionStorage.setItem("test", isTest);
}
const getProductElement = (productId) => {
  const productElement = document.querySelector(`[data-product-id="${productId}"]`);
  if (productElement) {
    return productElement;
  } else {
    throw new Error(`Product element with ID ${productId} not found.`);
  }
};
const getBindedShippableProductAndQuantity = (productElement) => {
  if (productElement && productElement.dataset.shippableProductId) {
    const shippableId = Number(productElement.dataset.shippableProductId);
    let quantity = 1;
    if (!isNaN(productElement.dataset.productQuantity)) {
      quantity = Number(productElement.dataset.productQuantity);
    } else if (!isNaN(Number(productElement.value))) {
      quantity = Number(productElement.value);
    }
    return { product: shippables.find((s) => s.id === shippableId), quantity };
  }
  return null;
};;

// Setup variants and shippable map
const shippables = [{"id":223,"name":"Flexible Glasses"},{"id":36,"name":"USB 3.0 Quick Charger"}];
const shippableMap = new Map();
shippables.forEach((product) => {
  shippableMap.set(product.name, { ...product, id: Number(product.id) });
});

const variants = [[], [], []];
shippables.forEach((product) => {
  product.name.split("-").forEach((variant, i) => {
    if (!variants[i]) variants[i] = [];
    variants[i].push(variant.trim());
  });
});

let selectedProduct;

const getPrices = async function upsellGetPrices(allPrices) {
  const productId = document.querySelector('[data-product-id]').getAttribute('data-product-id');
  selectedProduct = allPrices.find((price) => price.id === Number(productId));

  const currencyClass = document.querySelectorAll('[data-holder="currency"]');
  currencyClass.forEach((el) => {
    el.innerHTML = "$";
  });

  const priceClass = document.querySelectorAll('[data-holder="product_full_price"]');
  priceClass.forEach((el) => {
    el.innerHTML = selectedProduct.finalPrice;
  });

  const discountClass = document.querySelectorAll('[data-holder="product_discount_percentage"]');
  discountClass.forEach((el) => {
    el.innerHTML = selectedProduct.discountPercentage;
  });

  return selectedProduct;
};;

function removeObjectUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "")
      delete obj[key];
  }
  return obj;
}
const getVariantsToShip = function() {
  const variantSelect = document.querySelectorAll("[data-variant-selector]");
  const itemsToShip = Array.from(variantSelect).map((select) => {
    const variantSelects = Array.from(
      select.querySelectorAll("[data-variant]")
    );
    const variantSelected = variantSelects
      .map((variant) => variant.value)
      .filter(Boolean);
    return variants[0][0] + " - " + variantSelected.join(" - ");
  });
  
  const itemQuantities = new Map();
  itemsToShip.forEach((itemName) => {
    const shippableItem = shippableMap.get(itemName);
    if (shippableItem) {
      if (itemQuantities.has(shippableItem.id)) {
        itemQuantities.get(shippableItem.id).quantity += 1;
      } else {
        itemQuantities.set(shippableItem.id, {
          ...shippableItem,
          quantity: 1
        });
      }
    }
  });
  
  return Array.from(itemQuantities.values());
};

const createCart = async (sanitizedOrderData) => {
    let cartResponse = await fetch(
    `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/carts`,
    {
      method: 'POST',
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        offers: sanitizedOrderData.offers,
        campaign_id: CAMPAIGN_ID,
        connection_id: sanitizedOrderData.connection_id,
      }),
      keepalive: false,
    }
  );
  if (cartResponse.status === 200) {
    cartResponse = await cartResponse.json();
    sessionStorage.setItem('cart_token', cartResponse.cart_token);
    return cartResponse.cart_token;
  }
};;
const getVrioOfferIdByProductId = (productId) => {
    const vrioOffers = [{"id":99,"offerTypeId":1,"name":"Vi-Shift - Network","items":[{"id":232,"name":"1x EXTRA Vi-Shift Glasses","quantity":1,"price":19.99,"shippable":false},{"id":224,"name":"1x Flexible Glasses","quantity":1,"price":29.99,"shippable":false},{"id":59,"name":"1x USB 3.0 Quick Charger","quantity":1,"price":0,"shippable":false},{"id":225,"name":"2x Vi-Shift Glasses","quantity":1,"price":53.98,"shippable":false},{"id":230,"name":"3 Year Extended Warranty","quantity":1,"price":10,"shippable":false},{"id":226,"name":"3x Vi-Shift Glasses","quantity":1,"price":71.97,"shippable":false},{"id":227,"name":"4x Vi-Shift Glasses","quantity":1,"price":83.96,"shippable":false},{"id":228,"name":"5x Vi-Shift Glasses","quantity":1,"price":89.95,"shippable":false},{"id":223,"name":"Flexible Glasses","quantity":1,"price":0,"shippable":true},{"id":231,"name":"Journey Package Protection","quantity":1,"price":3.5,"shippable":false},{"id":36,"name":"USB 3.0 Quick Charger","quantity":1,"price":0,"shippable":true},{"id":233,"name":"Vi-Shift Glasses - Expedited Shipping","quantity":1,"price":9.99,"shippable":false},{"id":229,"name":"Vi-Shift Protective Case Upgrade","quantity":1,"price":9.95,"shippable":false}]}];
    const recurringOfferTypeIds = [2, '2'];
    let matchedOffer = null;
    let isRecurringOffer = false;

    // prefer recurring offer match, fallback to first non-recurring match
    for (const offer of vrioOffers) {
      if (offer.items.some((item) => String(item.id) === String(productId))) {
        if (recurringOfferTypeIds.includes(offer.offerTypeId)) {
          matchedOffer = offer;
          isRecurringOffer = true;
          break;
        }
        if (!matchedOffer) matchedOffer = offer;
      }
    }

    return {
      offerId: matchedOffer?.id,
      isRecurringOffer,
    };
  };
const productCustomData = JSON.parse(sessionStorage.getItem("productCustomData")) || {};
const saveProductCustomData = (productElement) => {
  productCustomData[productElement.dataset.productId] = {
    customProductName: productElement.dataset.customProductName,
    customSummaryRow: productElement.dataset.customSummaryRow,
    customIsGift: productElement.dataset.customIsGift,
  };
}
const processUpsell = async () => {
  try {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    orderData.pageId = "YgsMLHoWn6crLXRdZyfPRFicc06HwVNJS1SIfXYqgiQtk0X3ycAYRfTpT6xi42-6";
    const lastOrderId = sessionStorage.getItem("cms_oid");
    const originalOfferId = orderData.offers[0]?.offer_id;
    const cartToken = await createCart(orderData);    
    // Reset offers array for upsell
    orderData.offers = [];
    
    // Add selected variants to order
    getVariantsToShip().forEach((product) => {
      const variantOfferData = getVrioOfferIdByProductId(product.id);
      const variantOfferId = variantOfferData.offerId ?? originalOfferId;
      orderData.offers.push({
        offer_id: variantOfferId,
        order_offer_quantity: 1,
        item_id: product.id,
        order_offer_upsell: true,
        parent_offer_id: originalOfferId,
        parent_order_id: lastOrderId,
      });
    });

    orderData.cart_token = cartToken;
    localStorage.setItem("cart_token", cartToken);
    const selectedProductOfferData = getVrioOfferIdByProductId(selectedProduct.id);
    const selectedProductOfferId = selectedProductOfferData.offerId ?? originalOfferId;

    orderData.offers.push(
        {
          offer_id: selectedProductOfferId,
          order_offer_quantity: 1,
          item_id: selectedProduct.id,
          order_offer_upsell: true,
          parent_offer_id: originalOfferId,
          parent_order_id: lastOrderId,
    }
    );
    const selectedProductElement = getProductElement(selectedProduct.id);
    saveProductCustomData(selectedProductElement);
    let { product, quantity } = getBindedShippableProductAndQuantity(selectedProductElement) ?? {};
    if (product) {
      const bindedProductOfferData = getVrioOfferIdByProductId(product.id);
      const bindedProductOfferId = bindedProductOfferData.offerId ?? selectedProductOfferId;
      orderData.offers.push({
        offer_id: bindedProductOfferId,
        item_id: product.id,
        order_offer_quantity: quantity,
      });
    }

    const addressData = JSON.parse(sessionStorage.getItem("addressData"));
    const sanitizedOrderData = removeObjectUndefinedProperties(!orderData.email ? {...orderData, ...addressData} : orderData);

    if (isTest) console.log("Sending upsell to VRIO", orderData);
    MVMT.track("UPSELL_SUBMITTED", {
      page: "thankyou",
      page_type: "ThankYou",
      page_url: window.location.href,
      order_data: orderData,
    });

    const response = await fetch(
      `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/orders`,
      {
        method: "POST",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8",
        },
          body: JSON.stringify({
          ...sanitizedOrderData,
          order_id: lastOrderId
        }),
      }
    );

    const result = await response.json();
    console.log(result);

    if (result.error) {
      console.error("Something went wrong");
      MVMT.track("UPSELL_ERROR", {
        page: "thankyou",
        page_type: "ThankYou",
        page_url: window.location.href,
        order_data: orderData,
      });
      return;
    }

    MVMT.track("UPSELL_SUCCESS", {
      page: "thankyou",
      page_type: "ThankYou",
      page_url: window.location.href,
      order_data: orderData,
    });

    if (isTest) console.log(result);
    sessionStorage.setItem("cms_oid", result.order_id);
    sessionStorage.setItem("orderData", JSON.stringify(orderData));
    const orderids = JSON.parse(sessionStorage.getItem("orderids")) || [];
    sessionStorage.setItem("orderids", JSON.stringify([...orderids, result.order_id]));

    let orderSummaryData = JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    orderSummaryData.push(result);
    sessionStorage.setItem("orderSummary", JSON.stringify(orderSummaryData));
    sessionStorage.setItem("productCustomData", JSON.stringify(productCustomData));

    sendTransactionToDataLayer(vrioToTransaction(result), addressData.paymentOption ?? sanitizedOrderData.payment_method_id === "6" ? "PayPal" : "creditCard");

    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('cart_token');
    sessionStorage.removeItem('payment_token_id');
    sessionStorage.removeItem('PayerID');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('ba_token');
    // Mark that upsell was completed to prevent showing it again
    sessionStorage.setItem("upsellCompleted", "true");
    if (THANK_YOU_NEXT_PAGE_SLUG) {
      window.location.href = getNextPageSlugForRedirect();
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
  btn.setAttribute("disabled", "false");
  btn.style.cursor = "default";
  document.body.style.cursor = "default";
};


document.addEventListener("DOMContentLoaded", async () => {
  applyKlarnaVisibilityForThankYou();
  const orderids = JSON.parse(sessionStorage.getItem("orderids"));

  const endpoint =
    `orders?order_id=${orderids.join(",")}` +
    `&with=order_offers,customer_address_billing,customer_address_shipping,customer,transactions,cart&pageId=YgsMLHoWn6crLXRdZyfPRFicc06HwVNJS1SIfXYqgiQtk0X3ycAYRfTpT6xi42-6`

  const response = await fetch(
    `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/${endpoint}`,
    {
      method: "GET",
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );

  const orderDetails = await response.json();

  for (const selector in elementsMappingContent) {
    const htmlElements = Array.from(document.querySelectorAll(selector));
    if (htmlElements.length > 0) {
      const elementContent = elementsMappingContent[selector];
      if (typeof elementContent === "function") {
        const content = elementsMappingContent[selector](
          orderDetails.orders[0]
        );
        if (htmlElements) {
          htmlElements.forEach((element) => (element.innerHTML = content || ''));
        }
      } else if (typeof elementContent === "string") {
        const content = orderDetails.orders[0][elementContent];
        htmlElements.forEach((element) => (element.innerText = content || ''));
      } else {
        htmlElements.forEach((element) => (element.style.display = "none"));
      }
    }
  }

  const orderSummaryItems = document.querySelector(
    "[data-order-summary-items]"
  );
  const initSummary = {
    items: [],
    totals: { subtotal: 0, shipping: 0, tax: 0 },
  };

  summary = initSummary;
  const totalPriceOfProductsChargedAfterMonth = orderDetails.orders.reduce(
    (accOrdersPrice, order) =>
      accOrdersPrice +
      (order.order_offers
        ?.filter((orderOffer) => orderOffer.charge_timeframe_name === 'Monthly')
        ?.reduce(
          (accOfferPrice, offer) => {
            const isVipUpsellFree = Number(offer.order_offer_price) === 0;
            if (!isVipUpsellFree) {
              return accOfferPrice;
            }
            const recurringAmount = Number(offer.last_recurring_amount) || 0;
            return accOfferPrice + recurringAmount;
          },
          0,
        ) ?? 0),
    0,
  );

  const ordersWithFilteredTransactions = orderDetails.orders.map((order) => ({
    ...order,
    filteredTransactions: (order.transactions || []).filter(
      (transaction) =>
        transaction?.transaction_declined !== true && !!transaction?.date_complete
    ),
  }));

  const orderTotal = ordersWithFilteredTransactions.reduce((acc, order) => {
    if (order.cart) return Number(order.cart.total_items) + acc;
    // Fallback: sum transaction prices when cart is null (e.g. Klarna)
    return order.filteredTransactions.reduce(
      (tAcc, t) => tAcc + Number(t.transaction_price || 0),
      acc
    );
  }, 0)
  summary.totals.subtotal = Math.max(orderTotal - totalPriceOfProductsChargedAfterMonth, 0);
  summary.totals.shipping = ordersWithFilteredTransactions.reduce((acc, order) => {
    if (order.cart) return Number(order.cart.total_shipping) + acc;
    return order.filteredTransactions.reduce(
      (tAcc, t) => tAcc + Number(t.transaction_shipping || 0),
      acc
    );
  }, 0);
  summary.totals.tax = ordersWithFilteredTransactions.reduce((acc, order) => {
    if (order.cart) return Number(order.cart.total_tax) + acc;
    return order.filteredTransactions.reduce(
      (tAcc, t) => tAcc + Number(t.transaction_tax || 0),
      acc
    );
  }, 0);

  const productCustomData = JSON.parse(sessionStorage.getItem("productCustomData")) || {};
  orderDetails.orders.forEach((order) => {
    const offers = order.cart
      ? order.cart.offers
      : (order.order_offers || []).map((oo) => ({
          item_id: oo.order_offer_items?.[0]?.item_id,
          item_name: oo.order_offer_items?.[0]?.item_name || oo.offer_name,
          order_offer_quantity: oo.order_offer_quantity,
          total: Number(oo.order_offer_price)
        })); 

    offers.forEach((item) => {
      const itemData = item;
      const notExtra = !itemData.item_name.toLowerCase().includes("extra");
      const notGift = productCustomData[itemData.item_id]?.customIsGift !== "true";
      const qtyZeroOrFree = itemData.order_offer_quantity <= 0 || itemData.total <= 0;
      if (notExtra && notGift && qtyZeroOrFree) {
        return;
      }
      const line_item = {
        name:
          productCustomData[itemData.item_id]?.customProductName ||
          itemData.item_name,
        quantity: itemData.order_offer_quantity,
        price: Number(itemData.total),
        summaryRowOrder: productCustomData[itemData.item_id]?.customSummaryRow || 0,
      };
      summary.items.push(line_item);
    });
  });

  const total = 
    summary.totals.subtotal +
    summary.totals.shipping +
    summary.totals.tax
  ;
  let items = '';
  initSummary.items
    .sort((i1, i2) => i1.summaryRowOrder - i2.summaryRowOrder)
    .forEach((item) => {
      items += `
        <div style="display: flex;justify-content: space-between;width: 100%;">
          <div> ${item.quantity > 1 ? `${item.quantity}x` : '' } ${item.name}</div>
          <div style="text-align:center; min-width: 50px;">${item.price > 0 ? formatPrice(item.price) : i18n.pricingText.free}</div>
        </div>
        `;
    });

  orderSummaryItems.innerHTML = items;
  const editSubmitBtn = document.querySelector('[data-submit-address]');
  if (editSubmitBtn) {
    const editableElements = [...document.querySelectorAll('[data-content-editable]')];
    const editBtn = document.querySelector('[data-edit-address]');
    const editBtnText = editBtn.innerText;
    let confirmClickedOnce = false;
    const countryEl = document.querySelector("[data-select-countries]");
    const countriesMap = {
      "US": "United States",
      "CA": "Canada",
      "GB": "United Kingdom",
      "AU": "Australia",
      "DE": "Deutschland",
      "FR": "France",
      "ES": "España",
      "IT": "Italia",
    }

    function buildCountrySelect(currentValue) {
      const select = document.createElement("select");
      select.style.width = "100%";
      campaignInfo.countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.iso_2;
        option.textContent = countriesMap[country.iso_2] || country.name;
        if (country.iso_2 === currentValue || country.name === currentValue) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      return select;
    }

    function enterCountryEditMode() {
      if (!countryEl) return;
      const currentValue = countryEl.innerHTML.trim();
      countryEl.innerHTML = "";
      countryEl.appendChild(buildCountrySelect(currentValue));
      countryEl.classList.add("editable-on");
    }

    function exitCountryEditMode() {
      if (!countryEl) return;
      const select = countryEl.querySelector("select");
      if (!select) return;
      countryEl.innerHTML = select.value;
      countryEl.classList.remove("editable-on");
    }

    async function submitEditAddress() {
      editSubmitBtn.setAttribute('disabled', 'true');
      editSubmitBtn.style.cursor = 'wait';
      document.body.style.cursor = 'wait';

      if (editableElements[0]?.getAttribute('contenteditable') === 'true') {
        editBtn.click();
      }
      const data = editableElements.reduce((acc, el) => {
        const firstDataSet = Object.keys(el.dataset)[0];
        const innerSelect = el.querySelector("select");
        acc[firstDataSet] = innerSelect ? innerSelect.value : el.innerHTML;
        return acc;
      }, {});

      const orderIds = JSON.parse(sessionStorage.getItem('orderids'));

      const customerId = orderDetails.orders[0].customer.customer_id;

      try {
        const body = {
          orders: orderIds,
          fname: data.firstName,
          lname: data.lastName,
          address1: data['line-1'],
          city: data.city,
          state: data.selectStates,
          zipcode: data.zipCode,
          country: data.selectCountries,
          address2: data['line-2'] || '',
          address_type: 'shipping',
        };

        const response = await fetch(
          `https://app-cms-api-proxy-dev-001.azurewebsites.net/vrio/customers/${customerId}/addresses`,
          {
            method: 'POST',
            headers: {
              authorization: `appkey ${INTEGRATION_ID}`,
              'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body),
          }
        );

        const orderData = await JSON.parse(sessionStorage.getItem('orderData'));

        orderData.ship_fname = data.firstName;
        orderData.ship_lname = data.lastName;
        orderData.ship_address1 = data['line-1'];
        orderData.ship_city = data.city;
        orderData.ship_state = data.selectStates;
        orderData.ship_zipcode = data.zipCode;
        orderData.ship_country = data.selectCountries;
        orderData.ship_address2 = data['line-2'] || '';

        sessionStorage.setItem('orderData', JSON.stringify(orderData));

        editSubmitBtn.setAttribute("style", "display:none !important");
        editBtn.setAttribute("style", "width: 100% !important");
        editBtn.innerHTML = `<span>${editBtnText}</span>`;
        editBtn.classList.add("edit-btn-shw");
        editBtn.classList.remove("cancel-btn");

        exitCountryEditMode();
        editableElements.forEach((el) => {
          if (el === countryEl) return;
          el.setAttribute("contenteditable", false);
          el.classList.remove("editable-on");
        });

        document.body.style.cursor = 'default';
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  formEl = document.querySelector('[data-address-form]');
  const validate = new JustValidate(formEl, {
    errorFieldCssClass: ['field__is-invalid'],
    errorLabelCssClass: ['label__is-invalid'],
    validateBeforeSubmitting: true,
    validateOnBlur: true,
    focusInvalidField: true,
    lockForm: true,
    tooltip: {
      position: 'top',
    },
    errorFieldCssClass: 'is-invalid',
    errorLabelCssClass: 'error-message',
    errorLabelStyle: {
      color: '#ff3860',
      marginTop: '0.25rem',
      fontSize: '0.875rem',
    },
  });

  initializeFormValidation();
  function getInputs() {
    return document.querySelectorAll(`
      [data-first-name], 
      [data-last-name],
      [data-line-1],
      [data-line-2],
      [data-city],
      [data-select-states],
      [data-select-countries],
      [data-zip-code]
    `);
  }
  function clearValidationFeedback() {
    getInputs().forEach((input) => {
      input.classList.remove(
        "error",
        "is-invalid",
        "valid",
        "just-validate-success-field",
      );
    });
  }

  editSubmitBtn.addEventListener("click", (e) => {
    clearValidationFeedback();

    if (
      !editableElements
        .filter((el) => el !== countryEl)
        .every((el) => el.getAttribute("contenteditable") === "true")
    ) {
      e.preventDefault();
      confirmClickedOnce = true;
      editSubmitBtn.setAttribute("style", "display:none !important");
      editBtn.setAttribute("style", "width: 100% !important");
    } else {
      confirmClickedOnce = true;
    }
  });

  editBtn.addEventListener("click", () => {
    clearValidationFeedback();

    if (
      editableElements
        .filter((el) => el !== countryEl)
        .every((el) => el.getAttribute("contenteditable") === "true")
    ) {
      editBtn.innerHTML = `<span>${editBtnText}</span>`;
      editBtn.classList.add("edit-btn-shw");
      editBtn.classList.remove("cancel-btn");
      
      exitCountryEditMode();
      editableElements.forEach((el) => {
        if (el === countryEl) return;
        el.setAttribute("contenteditable", false);
        el.classList.remove("editable-on");
      });

      if (confirmClickedOnce) {
        editSubmitBtn.setAttribute("style", "display:none !important");
        editBtn.setAttribute("style", "width: 100% !important");
      } else {
        editSubmitBtn.removeAttribute("style");
        editSubmitBtn.style.flex = "1";
        editBtn.removeAttribute("style");
      }
    } else {
      editSubmitBtn.removeAttribute("style");
      editSubmitBtn.style.flex = "none";
      editBtn.removeAttribute("style");

      editBtn.classList.add("cancel-btn");
      editBtn.classList.remove("edit-btn-shw");

      editBtn.innerHTML = `
        <img
          src="https://stdigitalmvmtprod001.blob.core.windows.net/assets/develop/edit-address-back-tr.png"
          alt="Cancel Edit"
          width="9.5"
          height="16"
          class="back-btn-img"
        />`;

      editBtn.addEventListener("mouseover", () => {
        const backImg = document.querySelector(".back-btn-img");
        if (backImg) backImg.src = "https://stdigitalmvmtprod001.blob.core.windows.net/assets/develop/edit-address-back-white.png";
      });

      editBtn.addEventListener("mouseout", () => {
        const backImg = document.querySelector(".back-btn-img");
        if (backImg) backImg.src = "https://stdigitalmvmtprod001.blob.core.windows.net/assets/develop/edit-address-back-tr.png";
      });

      enterCountryEditMode();
      editableElements.forEach((el) => {
        if (el === countryEl) return;
        el.setAttribute("contenteditable", true);
        el.classList.add("editable-on");
      });
      editableElements[0].focus();
    }
  });

  generalError = document.querySelector('[data-general-error]');

  async function initializeFormValidation() {
    const fields = getInputs();
    const validateField = async (field) => {
      const dataAttr = Object.keys(field.dataset)[0]?.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`
      );
      if (dataAttr) {
        const selector = `[data-${dataAttr}]`;
        const isValid = await validate.revalidateField(selector);
        if (!isValid) {
          field.classList.add('error');
        } else {
          field.classList.remove('error');
          field.classList.add('valid');
          editSubmitBtn.removeAttribute('disabled');
        }
      }
    };

    let debounceTimer;
    Array.from(fields).forEach((field) => {
      field.addEventListener('input', async () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          await validateField(field);
        }, 500);
      });
      field.addEventListener('blur', () => validateField(field));
    });
  }

  // Just Validate validation for each field in the form
  function getFieldContent(selector) {
    const el = document.querySelector(selector);
    if (!el) return '';
    const innerSelect = el.querySelector("select");
    if (innerSelect) return innerSelect.value;
    if (el.hasAttribute('contenteditable')) {
      return el.innerHTML.trim();
    }
    if (el.innerHTML === "<br>") {
      el.innerHTML = '';
    }
    return el.innerHTML !== undefined ? el.innerHTML.trim() : '';
  }

  validate
    .addField('[data-first-name]', [
      {
        validator: () => getFieldContent('[data-first-name]').length > 0,
        errorMessage: i18n.validation.firstNameRequired,
      },
      {
        validator: () => getFieldContent('[data-first-name]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
      {
        validator: () => i18n.validationPatterns.nameRegex.test(getFieldContent('[data-first-name]')),
        errorMessage: i18n.validation.invalidCharacter,
      },
    ])
    .addField('[data-last-name]', [
      {
        validator: () => getFieldContent('[data-last-name]').length > 0,
        errorMessage: i18n.validation.lastNameRequired,
      },
      {
        validator: () => getFieldContent('[data-last-name]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
      {
        validator: () => i18n.validationPatterns.nameRegex.test(getFieldContent('[data-last-name]')),
        errorMessage: i18n.validation.invalidCharacter,
      },
    ])
    .addField('[data-line-1]', [
      {
        validator: () => getFieldContent('[data-line-1]').length > 0,
        errorMessage: i18n.validation.shippingAddressRequired,
      },
      {
        validator: () => getFieldContent('[data-line-1]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField('[data-line-2]', [
      {
        validator: () => getFieldContent('[data-line-2]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField('[data-city]', [
      {
        validator: () => getFieldContent('[data-city]').length > 0,
        errorMessage: i18n.validation.cityRequired,
      },
      {
        validator: () => getFieldContent('[data-city]').length <= 255,
        errorMessage: i18n.validation.maxLength255,
      },
    ])
    .addField('[data-select-countries]', [
      {
        validator: () => getFieldContent('[data-select-countries]').length > 0,
        errorMessage: i18n.validation.countryRequired,
      },
    ])
    .addField('[data-zip-code]', [
      {
        validator: () => getFieldContent('[data-zip-code]').length > 0,
        errorMessage: i18n.validation.zipRequired,
      },
      {
        validator: () => i18n.validationPatterns.zipCodeRegex.test(getFieldContent('[data-zip-code]')),
        errorMessage: i18n.validation.zipInvalid,
      },
    ])
    .onFail((fields) => {
      const fieldsArray = Object.entries(fields);
      for (let i = 0; i < fieldsArray.length; i += 1) {
        const [fieldSelector, data] = fieldsArray[i];
        const field = document.querySelector(fieldSelector);
        data.isValid
          ? field.classList.remove('error')
          : field.classList.add('error');
      }
      editSubmitBtn.setAttribute('disabled', true);
      const id = setTimeout(() => {
        const field = fieldsArray[0][1];
        field.elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearTimeout(id);
      }, 150);
    })
    .onSuccess(submitEditAddress);
    const stateField = document.querySelector("[data-select-states]");
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    const hasState = orderData?.ship_state;

    if (stateField && !hasState) {
      stateField.remove();
    } else {
      validate.addField("[data-select-states]", [
        {
          validator: () => getFieldContent("[data-select-states]").length > 0,
          errorMessage: i18n.validation.stateRequired,
        },
      ]); 
    }
  }
  const totalExclTax = document.querySelector("[data-holder='total_excl_tax']");
  if (totalExclTax) {
    totalExclTax.innerText = formatPrice(summary.totals.subtotal + summary.totals.shipping);
  }
  const shippingExclTax = 
  document.querySelector("[data-holder='shipping_excl_tax']");
  if (shippingExclTax) {
    shippingExclTax.innerText = summary.totals.shipping ? formatPrice(summary.totals.shipping) : i18n.pricingText.free;
  }
  const totalInclTax = document.querySelectorAll("[data-holder='total_incl_tax']");
  
  if (totalInclTax && totalInclTax.length > 0) {
    totalInclTax.forEach((element) => (element.innerText = formatPrice(total)));
  }

  const orderNumber = document.querySelector("[data-holder='order_number']");
  if (orderNumber) {
    orderNumber.innerText = orderids.join(", ");
  }

  const orderData = JSON.parse(sessionStorage.getItem('orderData'));
  const orderEmail = document.querySelector("[data-holder='order_email']");
  if (orderEmail && orderData?.email) {
    orderEmail.innerText = orderData?.email;
  }

  
    // Check if upsell was already completed
    const upsellCompleted = sessionStorage.getItem("upsellCompleted");
    
    if (!upsellCompleted && !isKlarnaPayment) {
      // Initialize upsell functionality
      await getPrices(prices);

      const takeUpsellBtns = document.querySelectorAll("[data-submit-button]");

      takeUpsellBtns.forEach((btn) => {
        btn.addEventListener("click", async () => {
          btn.setAttribute("disabled", "true");
          btn.style.cursor = "wait";
          document.body.style.cursor = "wait";
          await processUpsell();
        });
      });
    } else {
      // Hide upsell elements if already completed
      const upsellElements = document.querySelectorAll("[data-upsell-container]");
      upsellElements.forEach((element) => {
        element.style.display = "none";
      });
      const takeUpsellBtns = document.querySelectorAll("[data-submit-button]");
      takeUpsellBtns.forEach((btn) => {
        btn.setAttribute("disabled", "true");
      });
    }
  
});

const vrioToTransaction = (orderResult) => {
  return {
    orderId: orderResult.order_id.toString(),
    customerId: orderResult.customer_id || orderResult.customerId,
    subtotal: orderResult.order.cart?.subtotal,
    tax: orderResult.order.cart?.total_tax,
    shippingAmount: orderResult.order.cart?.total_shipping,
    shippingMethod: orderResult.order.cart?.order.shipping_profile_id,
    total: orderResult.order.cart?.total,
    grandTotal: orderResult.order.cart?.total,
    isTestOrder: orderResult.order.is_test,
    line_items: orderResult.order.cart.offers.map((item) => {
      return {
        product_id: item.item_id,
        productName: item.item_name,
        quantity: item.order_offer_quantity,
        discount: item.discount,
        discountCode: item.discount_code,
        price: Number(item.total)
      }
    }),
    discountAmount: Number(orderResult.order.cart?.total_discount) || 0,
    couponCode: orderResult.order.cart?.order.discount_code || '',
  }
};
const sendTransactionToDataLayer = (response, paymentOption) => {
  const details = Array.isArray(response) ? response.at(-1) : response;
  const customerId = details.customerId || details.customer_id;
  const address = JSON.parse(sessionStorage.getItem('addressData'));
  sessionStorage.setItem('customerId', customerId);
  const transaction = {
    event: 'transaction',
    offer: offerName,
    customer_id: details.customerId.toString(),
    page: {
      type: "ThankYou",
      isReload: performance.getEntriesByType('navigation')[0].type === 'reload',
      isExclude: false,
    },
    order: {
      id: details.orderId.toString(),
      subtotal: parseFloat(details.subtotal),
      tax: parseFloat(details.tax),
      shippingAmount: parseFloat(details.shippingAmount),
      shippingMethod: details.shippingMethod,
      paymentMethod: paymentOption,
      total: parseFloat(details.total),
      grandTotal: parseFloat(details.grandTotal),
      count: 1,
      step: "ThankYou",
      isTestOrder: isTest || details.isTestOrder,
      product: details.line_items
        .reduce((acc, curr) => {
          if (acc.find((item) => item.product_id === curr.product_id)) {
            curr.quantity += acc.find(
              (item) => item.product_id === curr.product_id
            ).quantity;
          }
          return [...acc, curr];
        }, [])
        .map((item) => {
          const p = prices.find((p) => p.id === +item.product_id);
          let qty = 1;
          const productEl = document.querySelector(
            `[data-product-id="${item.product_id}"]`
          );
          if (productEl) qty = Number(productEl.dataset.productQuantity) || 1;
          if (p) {
            return {
              type: offerName,
              name: p.productName,
              price: item.price,
              regprice: p.fullPrice,
              individualPrice: item.price / (qty * item.quantity),
              quantity: item.quantity,
              packageQuantity: qty,
              group: "upsell",
            };
          }
          const variant = shippables.find((s) => s.id === +item.product_id);
          if (variant) {
            return {
              type: offerName,
              name: variant.name,
              price: 0.00,
              regprice: 0.00,
              individualPrice: 0.00,
              quantity: item.quantity,
              packageQuantity: 1,
              group: "upsell",
            };
          }
        }),
    },
    customer: {
      billingInfo: {
        address1: address.billingAddress1 ?? address.bill_address1,
        address2: address.billingAddress2 ?? address.bill_address2,
        city: address.billingCity ?? address.bill_city,
        country: address.billingCountry ?? address.bill_country,
        state: address.billingState ?? address.bill_state,
        postalCode: address.billingZip ?? address.bill_zipcode,
      },
      shippingInfo: {
        firstName: address.firstName ?? address.ship_fname,
        lastName: address.lastName ?? address.ship_lname,
        address1: address.shippingAddress1 ?? address.ship_address1,
        address2: address.shippingAddress2 ?? address.ship_address2,
        city: address.shippingCity ?? address.ship_city,
        countryCode: address.shippingCountry ?? address.ship_country,
        state: address.shippingState ?? address.ship_state,
        postalCode: address.shippingZip ?? address.ship_zipcode,
        emailAddress: address.email,
        phoneNumber: address.phone,
      },
    },
  };
  if (Number(details.discountAmount) > 0) {
    transaction.order.couponCode = details.couponCode;
  } else {
    transaction.order.couponCode = '';
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(transaction);
};;
