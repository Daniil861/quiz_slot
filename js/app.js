(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (function() {
        if (document.querySelector("body")) setTimeout((function() {
            document.querySelector("body").classList.add("_loaded");
        }), 200);
    }));
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("page-name")) {
        if (document.querySelector(".name")) document.querySelector(".name").classList.add("_hide");
        if (document.querySelector(".header__player-name")) if (sessionStorage.getItem("name")) document.querySelector(".header__player-name").textContent = sessionStorage.getItem("name"); else document.querySelector(".header__player-name").textContent = "Player#1";
    }
    if (sessionStorage.getItem("money")) if (document.querySelector(".header__money")) document.querySelector(".header__money").textContent = `${sessionStorage.getItem("money")}$`;
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    const page_enter_name = document.querySelector(".name");
    const score_screen = document.querySelector(".score");
    let header_money = document.querySelector(".header__money");
    let arr_complite_num = [];
    let timer;
    const questions = [ "1. What is the bet button?", "2. What does the spin button mean?", "3. Bet X2 is?", "4.What is lastbet?", "5. What are game symbols?" ];
    const answers_1 = [ "setting the player's bet ", "setting the player's bet at which he is going to play.", "game on N lines.", "next button" ];
    const answers_2 = [ "game start button", "setting the player's bet at which he is going to play", "give the player the ability to choose paylines", "Cash Button" ];
    const answers_3 = [ "single bet game", "betting game", "give the player the ability to choose paylines", "multiplied by five" ];
    const answers_4 = [ "multibet buy", "Button Stop", "give add 100 coins ", "the ability to repeat the previous bet" ];
    const answers_5 = [ "This is symbols Wild", 'The traditional symbols for slot machines are images of fruits, cherries, bells and the number "7"', "Symblos is icons", "the ability to repeat the previous bet" ];
    if (document.querySelector(".game")) {
        sessionStorage.setItem("game", 1);
        show_points();
        if (!sessionStorage.getItem("money")) sessionStorage.setItem("money", 8e3);
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".acces-preloader__button")) {
            preloader.classList.add("_hide");
            sessionStorage.setItem("preloader", true);
            wrapper.classList.add("_visible");
            page_enter_name.classList.add("_visible");
        }
        if (targetElement.closest(".name__button")) {
            let name = document.querySelector(".name__input").value;
            sessionStorage.setItem("page-name", true);
            if ("" != name) {
                sessionStorage.setItem("name", name);
                document.querySelector(".header__player-name").textContent = name;
            }
            page_enter_name.classList.remove("_visible");
        }
        if (targetElement.closest(".bonus__arrow")) {
            document.querySelector(".bonus__ball_zero").classList.add("_anim-zero");
            document.querySelector(".bonus__ball_three").classList.add("_anim-three");
            document.querySelector(".bonus__ball_double-three").classList.add("_anim-double-three");
            document.querySelector(".bonus__ball_five").classList.add("_anim-five");
            document.querySelector(".bonus__ball_six").classList.add("_anim-six");
            document.querySelector(".bonus__ball_seven").classList.add("_anim-seven");
            document.querySelector(".bonus__ball_nine").classList.add("_anim-nine");
            document.querySelector(".bonus__arrow").classList.add("_not-active");
            setTimeout((() => {
                let money = parseInt(header_money.innerHTML, 10);
                header_money.innerHTML = `${money - 300}$`;
                header_money.classList.add("_anim-delete-money");
            }), 300);
            setTimeout((() => {
                header_money.classList.remove("_anim-delete-money");
            }), 1e3);
            setTimeout((() => {
                document.querySelector(".bonus__box-body").classList.add("_hide");
                document.querySelector(".bonus__prize").classList.add("_visible");
                let bonus_count = get_random_num();
                document.querySelector(".bonus__count-prize").textContent = `bonus +${bonus_count}$`;
                let money2 = parseInt(header_money.innerHTML, 10);
                header_money.innerHTML = `${money2 + bonus_count}$`;
                sessionStorage.setItem("money", money2 + bonus_count);
                header_money.classList.add("_anim-add-money");
                setTimeout((() => {
                    header_money.classList.remove("_anim-add-money");
                }), 1e3);
            }), 4400);
        }
        if (targetElement.closest(".score")) if (!targetElement.closest(".score__body") && document.querySelector(".score").classList.contains("_visible")) start_game();
        if (targetElement.closest(".header-game__half")) {
            document.querySelector(".header-game__half").classList.add("_no-active");
            check_answer();
        }
        if (targetElement.closest(".header-game__time")) {
            document.querySelector(".header-game__time").classList.add("_no-active");
            document.querySelector(".header-game__timer p").textContent = +document.querySelector(".header-game__timer p").innerHTML + 15;
        }
        if (targetElement.closest(".play__button") || targetElement.closest(".header-game__button") || targetElement.closest(".loose__button")) sessionStorage.setItem("game", 1);
        if (targetElement.closest(".game__answer_one") && 1 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_one").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_one").classList.add("_win");
                sessionStorage.setItem("game", 2);
                show_points();
                setTimeout((() => {
                    clear_forms();
                }), 2500);
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.remove("_win");
                }), 2e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_one") && 2 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_one").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_one").classList.add("_win");
                sessionStorage.setItem("game", 3);
                show_points();
                setTimeout((() => {
                    clear_forms();
                }), 2500);
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.remove("_win");
                }), 2e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_one") && 3 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_one").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_one").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_three").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_one") && 4 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_one").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_one").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_four").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_one") && 5 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_one").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_one").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_two").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        }
        if (targetElement.closest(".game__answer_two") && 1 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_two").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_two").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_two") && 2 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_two").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_two").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_two") && 3 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_two").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_two").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_three").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_two") && 4 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_two").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_two").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_four").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_two") && 5 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_two").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_two").classList.add("_win");
                let current_money = +sessionStorage.getItem("money");
                sessionStorage.setItem("money", current_money + 1e6);
                show_points();
                setTimeout((() => {
                    clear_forms();
                }), 2500);
                setTimeout((() => {
                    document.querySelector(".game__answer_two").classList.remove("_win");
                }), 2e3);
            }), 2e3);
            setTimeout((() => {
                document.querySelector(".play").classList.add("_active");
            }), 4e3);
        }
        if (targetElement.closest(".game__answer_three") && 1 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_three").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_three").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_three") && 2 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_three").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_three").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_three") && 3 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_three").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_three").classList.add("_win");
                sessionStorage.setItem("game", 4);
                show_points();
                setTimeout((() => {
                    clear_forms();
                }), 2500);
                setTimeout((() => {
                    document.querySelector(".game__answer_three").classList.remove("_win");
                }), 2e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_three") && 4 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_three").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_three").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_four").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_three") && 5 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_three").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_three").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_two").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        }
        if (targetElement.closest(".game__answer_four") && 1 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_four").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_four").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_four") && 2 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_four").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_four").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_one").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_four") && 3 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_four").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_four").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_three").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_four") && 4 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_four").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_four").classList.add("_win");
                sessionStorage.setItem("game", 5);
                show_points();
                setTimeout((() => {
                    clear_forms();
                }), 2500);
                setTimeout((() => {
                    document.querySelector(".game__answer_four").classList.remove("_win");
                }), 2e3);
            }), 2e3);
        } else if (targetElement.closest(".game__answer_four") && 5 == sessionStorage.getItem("game")) {
            document.querySelector(".game__answer_four").classList.add("_choice");
            disable_button_choice();
            clearInterval(timer);
            setTimeout((() => {
                document.querySelector(".game__answer_four").classList.add("_loose");
                setTimeout((() => {
                    document.querySelector(".game__answer_two").classList.add("_win");
                }), 1e3);
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 3e3);
            }), 2e3);
        }
    }));
    function show_points() {
        setTimeout((() => {
            score_screen.classList.add("_visible");
            if (1 == sessionStorage.getItem("game")) document.querySelector(".score__target_one").classList.add("_active"); else if (2 == sessionStorage.getItem("game")) {
                document.querySelector(".score__target_one").classList.remove("_active");
                document.querySelector(".score__target_two").classList.add("_active");
                document.querySelector(".score__target_one").classList.add("_visible");
                setTimeout((() => {
                    document.querySelector(".score__target_one").classList.remove("_visible");
                }), 2e3);
            } else if (3 == sessionStorage.getItem("game")) {
                document.querySelector(".score__target_two").classList.remove("_active");
                document.querySelector(".score__target_three").classList.add("_active");
                document.querySelector(".score__target_two").classList.add("_visible");
                setTimeout((() => {
                    document.querySelector(".score__target_two").classList.remove("_visible");
                }), 2e3);
            } else if (4 == sessionStorage.getItem("game")) {
                document.querySelector(".score__target_three").classList.remove("_active");
                document.querySelector(".score__target_four").classList.add("_active");
                document.querySelector(".score__target_three").classList.add("_visible");
                setTimeout((() => {
                    document.querySelector(".score__target_three").classList.remove("_visible");
                }), 2e3);
            } else if (5 == sessionStorage.getItem("game")) {
                document.querySelector(".score__target_four").classList.remove("_active");
                document.querySelector(".score__target_five").classList.add("_active");
                document.querySelector(".score__target_four").classList.add("_visible");
                setTimeout((() => {
                    document.querySelector(".score__target_four").classList.remove("_visible");
                }), 2e3);
            }
        }), 1e3);
    }
    function start_game() {
        document.querySelector(".score").classList.remove("_visible");
        setTimeout((() => {
            write_question();
            write_answers();
            setTimeout((() => {
                start_timer();
                active_button_choice();
            }), 2e3);
        }), 500);
    }
    function clear_forms() {
        document.querySelector(".game__question").textContent = "";
        document.querySelector(".header-game__timer p").textContent = 30;
        document.querySelectorAll(".game__variant").forEach((el => {
            el.textContent = "";
            if (el.classList.contains("_choice")) el.classList.remove("_choice");
        }));
        document.querySelectorAll(".game__answer").forEach((el => {
            if (el.classList.contains("_choice")) el.classList.remove("_choice"); else if (el.classList.contains("_hide")) el.classList.remove("_hide");
        }));
    }
    function get_random_num() {
        let arr_bonus = [ 10, 100, 300, 1e3, 2e3 ];
        let random_number = Math.floor(Math.random() * (5 - 0) + 0);
        return arr_bonus[random_number];
    }
    function write_question() {
        let current_question = sessionStorage.getItem("game");
        if (1 == current_question) document.querySelector(".game__question").textContent = questions[0]; else if (2 == current_question) document.querySelector(".game__question").textContent = questions[1]; else if (3 == current_question) document.querySelector(".game__question").textContent = questions[2]; else if (4 == current_question) document.querySelector(".game__question").textContent = questions[3]; else if (5 == current_question) document.querySelector(".game__question").textContent = questions[4];
    }
    function write_answers() {
        let current_question = sessionStorage.getItem("game");
        if (1 == current_question) {
            setTimeout((() => {
                document.querySelector(".game__variant-a").textContent = answers_1[0];
            }), 600);
            setTimeout((() => {
                document.querySelector(".game__variant-b").textContent = answers_1[1];
            }), 1e3);
            setTimeout((() => {
                document.querySelector(".game__variant-c").textContent = answers_1[2];
            }), 1500);
            setTimeout((() => {
                document.querySelector(".game__variant-d").textContent = answers_1[3];
            }), 2e3);
        } else if (2 == current_question) {
            setTimeout((() => {
                document.querySelector(".game__variant-a").textContent = answers_2[0];
            }), 600);
            setTimeout((() => {
                document.querySelector(".game__variant-b").textContent = answers_2[1];
            }), 1e3);
            setTimeout((() => {
                document.querySelector(".game__variant-c").textContent = answers_2[2];
            }), 1500);
            setTimeout((() => {
                document.querySelector(".game__variant-d").textContent = answers_2[3];
            }), 2e3);
        } else if (3 == current_question) {
            setTimeout((() => {
                document.querySelector(".game__variant-a").textContent = answers_3[0];
            }), 600);
            setTimeout((() => {
                document.querySelector(".game__variant-b").textContent = answers_3[1];
            }), 1e3);
            setTimeout((() => {
                document.querySelector(".game__variant-c").textContent = answers_3[2];
            }), 1500);
            setTimeout((() => {
                document.querySelector(".game__variant-d").textContent = answers_3[3];
            }), 2e3);
        } else if (4 == current_question) {
            setTimeout((() => {
                document.querySelector(".game__variant-a").textContent = answers_4[0];
            }), 600);
            setTimeout((() => {
                document.querySelector(".game__variant-b").textContent = answers_4[1];
            }), 1e3);
            setTimeout((() => {
                document.querySelector(".game__variant-c").textContent = answers_4[2];
            }), 1500);
            setTimeout((() => {
                document.querySelector(".game__variant-d").textContent = answers_4[3];
            }), 2e3);
        } else if (5 == current_question) {
            setTimeout((() => {
                document.querySelector(".game__variant-a").textContent = answers_5[0];
            }), 600);
            setTimeout((() => {
                document.querySelector(".game__variant-b").classList.add("_text-small");
                document.querySelector(".game__variant-b").textContent = answers_5[1];
            }), 1e3);
            setTimeout((() => {
                document.querySelector(".game__variant-c").textContent = answers_5[2];
            }), 1500);
            setTimeout((() => {
                document.querySelector(".game__variant-d").textContent = answers_5[3];
            }), 2e3);
        }
    }
    function active_button_choice() {
        document.querySelectorAll(".game__answer").forEach((el => {
            el.classList.add("_active");
        }));
    }
    function disable_button_choice() {
        document.querySelectorAll(".game__answer").forEach((el => {
            el.classList.remove("_active");
        }));
    }
    function start_timer() {
        timer = setInterval((() => {
            let start_time = document.querySelector(".header-game__timer p");
            let current_seconds = +start_time.innerHTML;
            start_time.textContent = current_seconds - 1;
            if (current_seconds <= 10) document.querySelector(".header-game__timer").classList.add("_anim-time"); else if (current_seconds >= 10) document.querySelector(".header-game__timer").classList.remove("_anim-time");
            if (current_seconds <= 1) {
                clearInterval(timer);
                document.querySelector(".header-game__timer").classList.remove("_anim-time");
                start_time.style.color = "rgb(241, 11, 11)";
                start_time.style.transform = "scale(1.5)";
                setTimeout((() => {
                    document.querySelector(".loose").classList.add("_active");
                }), 1500);
            }
        }), 1e3);
    }
    function check_answer() {
        let current_question = sessionStorage.getItem("game");
        let arr_answers = document.querySelectorAll(".game__answer");
        if (1 == current_question) {
            let arr = get_random_numbers(1, 2, 3);
            setTimeout((() => {
                arr_answers[arr[0]].classList.add("_hide");
                arr_answers[arr[1]].classList.add("_hide");
            }), 500);
        } else if (2 == current_question) {
            let arr = get_random_numbers(1, 2, 3);
            setTimeout((() => {
                arr_answers[arr[0]].classList.add("_hide");
                arr_answers[arr[1]].classList.add("_hide");
            }), 500);
        } else if (3 == current_question) {
            let arr = get_random_numbers(0, 1, 3);
            setTimeout((() => {
                arr_answers[arr[0]].classList.add("_hide");
                arr_answers[arr[1]].classList.add("_hide");
            }), 500);
        } else if (4 == current_question) {
            let arr = get_random_numbers(0, 1, 2);
            setTimeout((() => {
                arr_answers[arr[0]].classList.add("_hide");
                arr_answers[arr[1]].classList.add("_hide");
            }), 500);
        } else if (5 == current_question) {
            let arr = get_random_numbers(0, 2, 3);
            setTimeout((() => {
                arr_answers[arr[0]].classList.add("_hide");
                arr_answers[arr[1]].classList.add("_hide");
            }), 500);
        }
    }
    function get_random_numbers(num1, num2, num3) {
        let arr = [ num1, num2, num3 ];
        let number1 = get_random();
        arr_complite_num.push(number1);
        let number2 = get_unic_num(num1, num2, num3);
        return [ arr[number1], arr[number2] ];
    }
    function get_unic_num(num1, num2, num3) {
        let number2 = get_random();
        if (true == arr_complite_num.includes(number2)) return get_unic_num(num1, num2, num3);
        return number2;
    }
    function get_random() {
        return Math.floor(Math.random() * (3 - 0) + 0);
    }
    window["FLS"] = true;
    isWebp();
})();