$(document).ready(function () {
    /* ===== ДЕМО-БАЗА ВОПРОСОВ ===== */
    /* Формат: [баллы, категория, id, правильные, картинки, bg_заголовок, bg_ответы, en_заголовок, en_ответы] */
    var demoQuestions = [
      [1, "B", 1, [0], [],
        "Что означает этот знак?",
        [["0", "Остановка запрещена"], ["1", "Стоянка разрешена"]],
        "What does this sign mean?",
        [["0", "No stopping"], ["1", "Parking allowed"]]],
  
      [2, "B", 2, [1], [],
        "Максимальная скорость в населённом пункте?",
        [["0", "40 км/ч"], ["1", "50 км/ч"], ["2", "60 км/ч"]],
        "Max speed in a settlement?",
        [["0", "40 km/h"], ["1", "50 km/h"], ["2", "60 km/h"]]],
  
      [1, "A", 3, [0], [],
        "Можно ли ездить на мотоцикле без шлема?",
        [["0", "Нет"], ["1", "Да"]],
        "Can you ride a motorcycle without a helmet?",
        [["0", "No"], ["1", "Yes"]]],
  
      [1, "B", 4, [1, 2], [],
        "Какие сигналы регулировщика разрешают движение?",
        [["0", "Красный свет"], ["1", "Рука поднята вверх"], ["2", "Рука вытянута вперёд"]],
        "Which traffic controller signals allow movement?",
        [["0", "Red light"], ["1", "Hand raised up"], ["2", "Arm extended forward"]]],
  
      [1, "T", 5, [0], [],
        "Что означает жёлтый мигающий сигнал?",
        [["0", "Движение разрешено"], ["1", "Движение запрещено"]],
        "What does flashing yellow mean?",
        [["0", "Movement allowed"], ["1", "Movement prohibited"]]],
  
      [2, "B", 6, [2], [],
        "Кто имеет преимущество на перекрёстке?",
        [["0", "Тот, кто справа"], ["1", "Тот, кто слева"], ["2", "Тот, кто на главной дороге"]],
        "Who has priority at the intersection?",
        [["0", "The one on the right"], ["1", "The one on the left"], ["2", "The one on the main road"]]]
    ];
  
    /* 19 тем — для демо все ссылаются на один набор */
    var themesDB = [];
    for (var i = 0; i < 19; i++) themesDB.push(demoQuestions.slice());
  
    /* ===== ИНДЕКСЫ ===== */
    var Q_PTS = 0, Q_CAT = 1, Q_ID = 2, Q_ANSW = 3, Q_IMG = 4,
        Q_BG = 5, Q_BG_A = 6, Q_EN = 7, Q_EN_A = 8;
  
    /* ===== КОНФИГ ===== */
    var config = { lang: "bg", cat: "b", themeID: null };
  
    /* ===== СОСТОЯНИЕ ===== */
    var currentTheme = [];
    var currentQuestion = 0;
    var flipflop = 1;
    var checkQuestion = false;
    var correct = 0, wrong = 0;
  
    var sixPack = [1, 6, 9, 11, 16, 19];
  
    /* ===== ОБНОВЛЕНИЕ КОНФИГА ===== */
    function updateConfig(property, value) {
      currentTheme = [];
      config.themeID = null;
      config[property] = value;
  
      $("#dropdown .dropdown-toggle").removeClass("disabled");
  
      $("#my-btn").addClass("disabled");
  
      correct = 0; wrong = 0; flipflop = 1; currentQuestion = 0;
      checkQuestion = false;
      $("#mid>.question").remove();
      $("#wrong").empty().hide();
      $("#correct").empty().hide();
      $("#results").empty().hide();
      $(".dropdown-toggle .icon").text("☰");
      $(".dropdown-toggle").contents().last()[0].textContent = " Выберите тему";
      updateButton(0, 0);
    }
  
    /* ===== ВЫБОР ЯЗЫКА / КАТЕГОРИИ ===== */
    $("#lang :input").change(function () { updateConfig("lang", this.id); });
    $("#cat :input").change(function () { updateConfig("cat", this.id); });
  
    /* ===== DROPDOWN ===== */
    $(".dropdown-toggle").click(function (e) {
      e.preventDefault();
      if ($(this).hasClass("disabled")) return;
      $("#dropdown").toggleClass("open");
    });
  
    $(document).click(function (e) {
      if (!$(e.target).closest("#dropdown").length) {
        $("#dropdown").removeClass("open");
      }
    });
  
    /* ===== ВЫБОР ТЕМЫ ===== */
    $(".dropdown-menu li").click(function () {
      $("#mid>.question").remove();
      $("#wrong").empty().hide();
      $("#correct").empty().hide();
      $("#results").empty().hide();
  
      var index = $(".dropdown-menu li").index(this);
      updateConfig("themeID", index);
  
      $(".dropdown-toggle").html($(this).find("a").html());
      $("#dropdown").removeClass("open");
  
      currentQuestion = 0;
      flipflop = 1;
  
      if (config.themeID !== 18) {
        /* обычная тема */
        currentTheme = themesDB[config.themeID].slice();
      } else {
        /* случайный экзамен */
        currentTheme = [];
        for (var i = 0; i < 10; i++) {
          currentTheme.push(demoQuestions[Math.floor(Math.random() * demoQuestions.length)]);
        }
      }
  
      renderQuestion();
      updateButton(currentQuestion + 1, currentTheme.length);
    });
  
    /* ===== ПРОВЕРКА ===== */
    $("#my-btn").click(function () {
      if (config.themeID === null) return;
  
      if (config.themeID === 18 || flipflop === 1) {
        var myLang = config.lang === "bg" ? [Q_BG, Q_BG_A] : [Q_EN, Q_EN_A];
        var userInput = [];
        var $question = $("#mid>.question");
  
        $(".qzone .btn", $question).each(function (index) {
          if ($(this).hasClass("active")) userInput.push(index);
        });
  
        var answersDB = [];
        var answers = currentTheme[currentQuestion][myLang[1]];
        $.each(answers, function (key, value) {
          if (value[0] === "1") {
            $question.find(".h4:eq(" + key + ")").css("color", "blue");
            answersDB.push(key);
          }
        });
  
        checkQuestion = userInput.toString() === answersDB.toString();
        $question.css("border-left", "4px solid " + (checkQuestion ? "green" : "red"));
      }
  
      if (config.themeID === 18 || flipflop === 2) {
        var $q = $("#mid>.question").detach();
        $q.css("border-left", "4px solid " + (checkQuestion ? "green" : "red"));
        $q.appendTo("#results");
  
        if (checkQuestion) correct++; else wrong++;
  
        if (currentQuestion < currentTheme.length - 1) {
          currentQuestion++;
          renderQuestion();
          updateButton(currentQuestion + 1, currentTheme.length);
        } else {
          updateButton(correct, currentTheme.length);
          $("#wrong").show();
          $("#correct").show();
          $("#results").show();
        }
      }
  
      flipflop = flipflop === 1 ? 2 : 1;
    });
  
    /* ===== КНОПКА ===== */
    function updateButton(fraction, whole) {
      var progress = ((fraction / whole) * 100).toFixed(0);
      if (isNaN(progress) || progress === "Infinity") progress = 0;
      $("#my-btn")
        .text("[" + fraction + "/" + whole + "][" + progress + "%]")
        .css("background", "linear-gradient(90deg, #337ab7 " + progress + "%, #286090 0%)");
    }
  
    /* ===== РЕНДЕР ВОПРОСА ===== */
    function renderQuestion() {
      var cQuestion = currentTheme[currentQuestion];
      if (!cQuestion) return;
  
      var myLang = config.lang === "bg" ? [Q_BG, Q_BG_A] : [Q_EN, Q_EN_A];
      var qtitle = cQuestion[myLang[0]];
      var qanswers = cQuestion[myLang[1]];
  
      var html = '<div class="question">';
      html += '<h3>';
      html += '<p>' + qtitle + '</p>';
      html += '<div><div>' + (currentQuestion + 1) + '.</div>';
      html += '<div>' + cQuestion[Q_PTS] + '/' + cQuestion[Q_ANSW].length + '</div></div>';
      html += '</h3>';
      html += '<div class="qzone"><div class="answers">';
  
      for (var i = 0; i < qanswers.length; i++) {
        html += '<button type="button" class="btn">';
        html += '<span class="mark"></span>';
        html += '<span class="h4">' + qanswers[i][1] + '</span>';
        html += '</button>';
      }
  
      html += '</div></div></div>';
  
      $("#mid").append(html);
  
      $("#mid>.question .qzone .btn").on("click", function (e) {
        e.preventDefault();
        $(this).toggleClass("active");
      });
    }
  
    /* ===== ИНИЦИАЛИЗАЦИЯ ===== */
    updateConfig("lang", "bg");
  });
