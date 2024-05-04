// WeVoteServer/apis_v1/static/js/TaskDialog.js
$(function () {
  let dialog; let
    form;
  const idfld = $('#id');
  const verboseName = $('#verbose_name');
  const taskParameters = $('#task_parameters');
  const priority = $('#priority');
  const runAt = $('#run_at');
  const runAtTime = $('#run_at_time');
  const repeat = $('#repeat');
  const repeatUntil = $('#repeat_until');
  const repeatUntilTime = $('#repeat_until_time');
  const lastError = $('#last_error');
  const allFields = $([]).add(idfld).add(verboseName).add(taskParameters)
    .add(runAt)
    .add(runAtTime)
    .add(priority)
    .add(repeat)
    .add(repeatUntil)
    .add(repeatUntilTime);
  const tips = $('.validateTips');
  const spinner = $('#html5Spinner');

  setup();

  dialog = $('#dialog-form').dialog({
    autoOpen: false,
    height: 750,
    width: 900,
    modal: true,
    buttons: {
      // "Run this task now": notYet,
      'Save task': saveNewTask,
      'Save as a new task': saveNewTask,
      Delete: deleteTask,
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

    idfld.css('width', '70');
    verboseName.css('width', '500');
    taskParameters.css('width', '100%');
    priority.css('width', '30');
    runAt.datepicker();
    lastError.css('width', '100%');

    repeatUntil.datepicker();
    runAtTime.timepicker({ timeFormat: 'H:i' });
    repeatUntilTime.timepicker({ timeFormat: 'H:i' });
    if (getLimitFromUrl()) {
      spinner.val(getLimitFromUrl());
    }
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

  function checkRegexp (o, regexp, n) {
    if (!(regexp.test(o.val()))) {
      o.addClass('ui-state-error');
      updateTips(n);
      return false;
    } else {
      return true;
    }
  }

  function saveNewTask () {
    let valid = true;
    allFields.removeClass('ui-state-error');

    valid = valid && checkLength(verboseName, 'Task Name', 3, 128);
    valid = valid && checkLength(taskParameters, 'Task Parameters', 3, 1024);
    valid = valid && checkNumber(priority, 'priority');
    valid = valid && checkRegexp(runAt, /^([0-9]{2}\/[0-9]{2}\/[0-9]{4})+$/, 'Run at date must use this format: 12/25/2020');
    valid = valid && checkRegexp(runAtTime, /^([0-9]{2}:[0-9]{2})+$/, 'Run at time must use this format: 13:30');

    valid = valid && checkNumber(repeat, 'repeat');
    valid = valid && checkRegexp(repeatUntil, /^([0-9]{2}\/[0-9]{2}\/[0-9]{4})+$/, 'Repeat until date must use this format: 12/25/2020');
    valid = valid && checkRegexp(repeatUntilTime, /^([0-9]{2}:[0-9]{2})+$/, 'Repeat until time must use this format: 13:30');

    if (valid) {
      moment().tz('America/Los_Angeles').format();
      const sendRunAt = moment(`${runAt.val()} ${runAtTime.val()}`, 'MM/DD/YYYY HH:mm').format();
      const sendRepeatUntil = moment(`${repeatUntil.val()} ${repeatUntilTime.val()}`, 'MM/DD/YYYY HH:mm').format();
      const newTaskData = {
        verbose_task_name: verboseName.val(),
        task_parameters: taskParameters.val(),
        verbose_name: '',
        priority: priority.val(),
        run_at: sendRunAt,
        repeat: repeat.val(),
        repeat_until: sendRepeatUntil,
      };

      const apiURL = `${window.location.origin}/apis/v1/taskSaveNew`;
      $.getJSON(apiURL, newTaskData, () => { dialog.dialog('close'); location.reload(); })
        .fail((err) => {
          console.log('error', err);
        });
    }
    return valid;
  }

  // https://jqueryui.com/dialog/#modal-form
  // Called to populate the dialog with existing values
  function setInitialValues () {
    idfld.val(activeTask.id).css('background', 'ghostwhite');
    verboseName.val(activeTask.verbose_name);
    taskParameters.val(activeTask.task_parameters);
    if (activeTask.run_at.indexOf(' ') > -1) {
      const parts = activeTask.run_at.split(' ');
      runAt.val(parts[0]);
      runAtTime.val(parts[1]);
    }
    priority.val(activeTask.priority);
    repeat.val(activeTask.repeat);
    if (activeTask.repeat_until.indexOf(' ') > -1) {
      const parts = activeTask.repeat_until.split(' ');
      repeatUntil.val(parts[0]);
      repeatUntilTime.val(parts[1]);
    }
    lastError.val(activeTask.last_error);
    lastError.css('background', 'ghostwhite');
  }

  function deleteTheTask () {
    const apiURL = `${window.location.origin}/apis/v1/taskDelete`;
    const deleteTaskData = {
      id: idfld.val(),
    };
    $.getJSON(apiURL, deleteTaskData, () => { dialog.dialog('close'); location.reload(); })
      .fail((err) => {
        console.log('error deleteTask ', err);
      });
  }

  function deleteTask () {
    $("<div title='Obliviate'>The task will be permanently deleted and cannot be recovered. Are you sure?</div>")
      .dialog({
        resizable: false,
        height: 'auto',
        width: 400,
        modal: true,
        buttons: {
          Delete () {
            deleteTheTask();
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
    idfld.css('background', 'ghostwhite');
    moment().tz('America/Los_Angeles').format();
    runAt.val(moment().format('MM/DD/YYYY'));
    runAtTime.val(moment().format('HH:mm'));
    priority.val(1);
    repeat.val('WEEKLY');
    repeatUntil.val(moment().add(1, 'y').format('MM/DD/YYYY'));
    repeatUntilTime.val(moment().format('23:59'));
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

  $('#tasktable').on('click', (event) => {
    console.log("You clicked on a numbered id button: ", activeTask.id);
    $('label[for=idfld]').show();
    idfld.show();
    $('button:contains("Save as")').show();
    $('button:contains("Delete")').show();
    $('label[for=last_error], input#last_error').show();
    $('button:contains("Save task")').hide();
    setInitialValues();
    dialog.dialog('open');
  });

  $('#create-task').button().on('click', () => {
    $('label[for=idfld]').hide();
    idfld.hide();
    $('button:contains("Save as")').hide();
    $('button:contains("Delete")').hide();
    $('label[for=last_error], input#last_error').hide();
    $('button:contains("Save task")').show();
    setNewValues();
    dialog.dialog('open');
  });

  $('.show-output').click(() => {
    const apiURL = `${window.location.origin}/apis/v1/taskCompletedOutput`;
    const completedTaskData = {
      id: this.activeElement.name,
    };

    let text = '';
    const idout = this.activeElement.name;
    $.getJSON(apiURL, completedTaskData, (data) => {
      text = data.data;
      // console.log(`data.DATA: ${text}`);
      $(`<div>${text}</div>`).dialog({
        title: idout,
        width: '80%',
      });
    });
  });

  $('#update').button().on('click', () => {
    const limit = spinner.val();
    let newUrl = window.location.href;
    if (getLimitFromUrl()) {
      newUrl = newUrl.slice(0, newUrl.lastIndexOf('=') + 1) + limit;
    } else {
      newUrl += `?limit=${limit}`;
    }
    window.location.href = newUrl;
  });
});
