// WeVoteServer/apis_v1/static/js/planDialog.js
$(function () {
  let dialog;
  let form;
  let isMonthly = true;
  const idfld = $('#id');
  const couponCode = $('#coupon_code');
  const premiumPlanTypeEnum = $('#premium_plan_type_enum');
  const hiddenPlanComment = $('#hidden_plan_comment');
  const couponAppliedMessage = $('#coupon_applied_message');
  const monthlyPriceStripe = $('#monthly_price_stripe');
  const annualizedMonthly = $('#annualized_monthly');  // Do not validate this
  const annualPriceStripe = $('#annual_price_stripe');
  const redemptions = $('#redemptions');
  const featuresProvidedBitmap = $('#features_provided_bitmap');
  const planCreatedAt = $('#plan_created_at');
  const couponExpiresDate = $('#coupon_expires_date');
  const allFields = $([]).add(idfld).add(couponCode).add(planTypeEnum).add(hiddenPlanComment).add(couponAppliedMessage)
    .add(monthlyPriceStripe).add(annualPriceStripe).add(redemptions).add(featuresProvidedBitmap).add(planCreatedAt).add(couponExpiresDate);
  const tips = $('.validateTips');
  const spinner = $('#html5Spinner');

  $('.base-expire').each(function() {
    $(this).html($(this).html().substring(0, 10));
  });


  setup();

  dialog = $('#dialog-form').dialog({
    autoOpen: false,
    height: 800,
    width: 900,
    modal: true,
    buttons: {
      // "Run this task now": notYet,
      'Save Plan': saveNewPlan,
      'Save as a new Plan': saveNewPlan,
      Delete: deletePlan,
      Cancel () {
        dialog.dialog('close');
      },
    },
    close () {
      form[0].reset();
      allFields.removeClass('ui-state-error');
    },
  });

  form = dialog.find('form').on('submit', (event) => {
    event.preventDefault();
    addUser();
  });

  // Functions ---------------

  function setup () {
    console.log("SETUP");

    idfld.css('width', '70').css('background', 'ghostwhite');
    couponCode.css('width', '300');
    hiddenPlanComment.css('width', '100%');
    couponAppliedMessage.css('width', '100%');
    couponExpiresDate.datepicker();
    isMonthly = true;
    monthlyPriceStripe.css({'width': '100', 'text-align': 'right', 'background': 'white'}).attr('disabled', false);
    annualPriceStripe.css({'width': '100', 'text-align': 'right', 'background': 'ghostwhite'}).attr('disabled', true);
    annualizedMonthly.css({
      'width': '100',
      'text-align': 'right',
      'background': 'ghostwhite',
      'margin-left': '22px'
      }).attr('disabled', true);
    planCreatedAt.css('background', 'ghostwhite');
    redemptions.css('background', 'ghostwhite');
  }

  function updateTips (t) {
    tips
      .text(t)
      .addClass('ui-state-highlight');
    setTimeout(() => {
      tips.removeClass('ui-state-highlight', 1500);
    }, 500);
  }

  function checkLength (o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
      o.addClass('ui-state-error');
      updateTips(`Length of ${n} must be between ${min} and ${max}.`);
      return false;
    } else {
      return true;
    }
  }

  function checkNumber (o, n) {
    if (Number.isNaN(o.val())) {
      o.addClass('ui-state-error');
      updateTips(`${n} must be a number.`);
      return false;
    } else {
      return true;
    }
  }

  function checkNumberNonZero (o, n) {
    if (Number.isNaN(o.val()) || o.val() < 1) {
      o.addClass('ui-state-error');
      updateTips(`${n} must be a number.`);
      return false;
    } else {
      return true;
    }
  }

  function checkRegexp (o, regexp, n) {
    if (!(regexp.test(o.val()))) {
      o.addClass('ui-state-error');
      updateTips(n);
      return false;
    } else {
      return true;
    }
  }

  function dollarsToCents (cost) {
    costString = cost + ""; // convert to a string
    if (costString.length === 0) {
      return '';
    } else if (costString.indexOf('.') >= 0) {
      const money = (costString).split(".");
      dollars = money[0];
      cents = money[1];

      if (cents.length > 2) {
        return dollars + cents.substring(0, 2);
      } else if (cents.length === 0) {
        return dollars + '00';
      } else if (cents.length === 1) {
        return dollars + cents + '0'
      } else if (cents.length === 2) {
        return dollars + cents;
      }
    }
    return cost + '00';
  }

  function saveNewPlan () {
    let valid = true;
    allFields.removeClass('ui-state-error');
    expires = "";

    valid = valid && checkLength(couponCode, 'Coupon Code', 3, 128);
    if (isMonthly) {
      valid = valid && checkNumberNonZero(monthlyPriceStripe, 'Monthly Price');
    } else {
      valid = valid && checkNumberNonZero(annualPriceStripe, 'Annual Price');
    }

    if (couponExpiresDate.val().length) {
      valid = valid && checkRegexp(couponExpiresDate, /^([0-9]{2}\/[0-9]{2}\/[0-9]{4})+$/, 'Expiration date must use this format: 12/25/2024');
      if (valid) {
        moment().tz('America/Los_Angeles').format();
        expires = moment(couponExpiresDate.val(), 'MM/DD/YYYY HH:mm').format();
      }
    }

    if (valid) {
      const newPlanData = {
        couponCode: couponCode.val(),
        premiumPlanTypeEnum: premiumPlanTypeEnum.val(),
        couponAppliedMessage: couponAppliedMessage.val(),
        hiddenPlanComment: hiddenPlanComment.val(),
        monthlyPriceStripe: dollarsToCents(monthlyPriceStripe.val()),
        annualPriceStripe: dollarsToCents(annualPriceStripe.val()),
        featuresProvidedBitmap: featuresProvidedBitmap.val(),
        couponExpiresDate: expires,
      }

      const apiURL = `${window.location.origin}/apis/v1/createNewPlan`;
      $.getJSON(apiURL, newPlanData, () => { dialog.dialog('close'); location.reload(); })
        .fail((err) => {
          console.log('error', err);
        });
    }
    return valid;
  }

  // https://jqueryui.com/dialog/#modal-form
  // Called to populate the dialog with existing values
  function setInitialValues () {
    idfld.val(activePlan.id);
    couponCode.val(activePlan.coupon_code);
    premiumPlanTypeEnum.val(activePlan.premium_plan_type_enum).change();
    hiddenPlanComment.val(activePlan.hidden_plan_comment);
    couponAppliedMessage.val(activePlan.coupon_applied_message);
    if (isMonthly) {
      monthlyPriceStripe.val(activePlan.monthly_price_stripe);
    } else {
      annualPriceStripe.val(activePlan.annual_price_stripe);
    }
    redemptions.val(activePlan.redemptions);
    featuresProvidedBitmap.val(activePlan.features_provided_bitmap);
    planCreatedAt.val(activePlan.plan_created_at);
  }

  function deleteThisPlan () {
    const apiURL = `${window.location.origin}/apis/v1/deletePlan`;
    const deletePlanData = {
      id: idfld.val(),
    };
    $.getJSON(apiURL, deletePlanData, () => { dialog.dialog('close'); location.reload(); })
      .fail((err) => {
        console.log('error deleteThisPlan ', err);
      });
  }

  function deletePlan () {
    $("<div title='Obliviate'>This instance of the plan will be permanently deleted and cannot be recovered. Are you sure?</div>")
      .dialog({
        resizable: false,
        height: 'auto',
        width: 400,
        modal: true,
        buttons: {
          Delete () {
            deleteThisPlan();
            $(this).dialog('close');
          },
          Cancel () {
            $(this).dialog('close');
          },
        },
      });
  }

  // Called to populate the dialog with new values
  function setNewValues () {
    planCreatedAt.val(moment().format("MM/DD/YYYY")).css('background', 'ghostwhite').attr('readonly', true);
  }

  function notYet () {
    $("<div title='Not yet implemented'>Try back next month</div>").dialog();
    return false;
  }

  function getLimitFromUrl () {
    const newUrl = window.location.href;
    if (newUrl.includes('?limit=')) {
      return newUrl.slice(newUrl.lastIndexOf('=') + 1);
    } else {
      return 0;
    }
  }


  // onClick Handlers

  $('#pl').on('click', (event) => {
    console.log("You clicked on a numbered id button: ", activePlan.id);
    $('label[for=id]').text('Settings copied from id #');
    $('label[for=redemptiosn]').text('Redemptions of source coupon');
    $('button:contains("Save Plan")').hide();
    $('button:contains("Delete")').show();
    $('button:contains("Save task")').hide();
    setInitialValues();
    dialog.dialog('open');
  });

  $('#create-coupon').button().on('click', () => {
    console.log("clicked on create a coupon");
    // $('label[for=idfld]').hide();
    // idfld.hide();
    $('button:contains("Save Plan")').hide();
    $('button:contains("Delete")').hide();
    $('label[for=last_error], input#last_error').hide();
    $('button:contains("Save as a new Plan")').show();
    setNewValues();
    dialog.dialog('open');
  });

  $('#rollupOlderVersions').change(() => {
    let checked = document.getElementById('rollupOlderVersions').checked;
    console.log("clicked on rollupOlderVersions: " + checked);

    let table = document.getElementById('pl');
    let rowLength = table.rows.length;

    let hashmap = {};
    // This assumes that the rows arrive in order of most recently created

    for(let i=1; i<rowLength; i+=1) {
      var row = table.rows[i];
      let coupon = row.cells[1].innerText;
      let type = row.cells[2].innerText;
      let key = coupon + "~" + type;
      if (checked) {
        if (key in hashmap) {
          $(row).css("display", "none");
        } else {
          hashmap[key] = true;
        }
        console.log("Row dump: " + coupon + "~" + type);
      } else {
        $(row).css("display", "");
      }
    }
   });

  $('#rollupOlderVersions').click();

  $('#update').button().on('click', () => {
    event.preventDefault();
    const limit = spinner.val();
    let newUrl = window.location.href;
    if (getLimitFromUrl()) {
      newUrl = newUrl.slice(0, newUrl.lastIndexOf('=') + 1) + limit;
    } else {
      newUrl += `?limit=${limit}`;
    }
    window.location.href = newUrl;
  });

  $('#premium_plan_type_enum').on('change', function (e) {
    event.preventDefault();
    const optionSelected = $("option:selected", this);
    const valueSelected = this.value;
    if (valueSelected.includes('_MONTHLY')) {
      isMonthly = true;
      monthlyPriceStripe.css('background', 'white').attr('disabled', false);
      annualPriceStripe.css('background', 'ghostwhite').attr('disabled', true).val('');
    } else {
      isMonthly = false;
      monthlyPriceStripe.css('background', 'ghostwhite').attr('disabled', true).val('');
      annualPriceStripe.css('background', 'white').attr('disabled', false);
      annualizedMonthly.val('');
    }
  });

  monthlyPriceStripe.on("change paste keyup", () => {
    const value = monthlyPriceStripe.val();
    const annualized = Number(value.replace(/[^0-9\.]+/g,"")) * 12;
    annualizedMonthly.val(annualized);
  });

});
