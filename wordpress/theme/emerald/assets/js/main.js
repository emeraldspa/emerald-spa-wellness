/**
 * Emerald: front-end behaviour. Vanilla JS only, no jQuery, no frameworks.
 *
 * Modules: mobile nav, specials dropdown, hero reel deferral,
 * reveal-on-scroll, ambience player (YouTube facade, muted start, 48px
 * mute target). The promo popup was removed on client order and its code
 * must not come back.
 */
(function () {
        "use strict";

        var doc = document;
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var dataSaver = Boolean(navigator.connection && navigator.connection.saveData);

        /* ----------------------------------------------------------------
         * 1. Mobile navigation
         * ------------------------------------------------------------- */
        var navToggle = doc.querySelector("[data-nav-toggle]");
        var navList = doc.getElementById("em-primary-menu");
        if (navToggle && navList) {
                navToggle.addEventListener("click", function () {
                        var open = navList.classList.toggle("is-open");
                        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
                });
                doc.addEventListener("keydown", function (event) {
                        if ("Escape" === event.key && navList.classList.contains("is-open")) {
                                navList.classList.remove("is-open");
                                navToggle.setAttribute("aria-expanded", "false");
                                navToggle.focus();
                        }
                });
        }

        /* ----------------------------------------------------------------
         * 2. Specials dropdown (click + keyboard; hover handled in CSS)
         * ------------------------------------------------------------- */
        doc.querySelectorAll("[data-dropdown]").forEach(function (dropdown) {
                var toggle = dropdown.querySelector(".em-dropdown__toggle");
                var panel = dropdown.querySelector(".em-dropdown__panel");
                if (!toggle || !panel) {
                        return;
                }
                function setOpen(open) {
                        dropdown.classList.toggle("is-open", open);
                        toggle.setAttribute("aria-expanded", open ? "true" : "false");
                        panel.hidden = !open;
                }
                setOpen(false);
                toggle.addEventListener("click", function () {
                        setOpen(!dropdown.classList.contains("is-open"));
                });
                dropdown.addEventListener("keydown", function (event) {
                        if ("Escape" === event.key && dropdown.classList.contains("is-open")) {
                                setOpen(false);
                                toggle.focus();
                        }
                });
                doc.addEventListener("click", function (event) {
                        if (!dropdown.contains(event.target)) {
                                setOpen(false);
                        }
                });
        });

        /* ----------------------------------------------------------------
         * 3. Hero reel: attach after window load; skip under reduced
         *    motion or Data Saver so the poster stays the LCP element.
         * ------------------------------------------------------------- */
        var hero = doc.querySelector("[data-hero]");
        if (hero && !reduceMotion && !dataSaver) {
                var desktop = hero.getAttribute("data-video-desktop");
                var mobile = hero.getAttribute("data-video-mobile");
                var poster = hero.querySelector(".em-hero__poster");
                window.addEventListener("load", function () {
                        var source = window.innerWidth < 768 ? mobile : desktop;
                        if (!source) {
                                return;
                        }
                        var video = doc.createElement("video");
                        video.className = "em-hero__video";
                        video.muted = true;
                        video.loop = true;
                        video.playsInline = true;
                        video.setAttribute("aria-hidden", "true");
                        video.setAttribute("disablepictureinpicture", "");
                        video.preload = "none";
                        var src = doc.createElement("source");
                        src.src = source;
                        src.type = 'video/webm; codecs="vp9"';
                        video.appendChild(src);
                        video.addEventListener("canplay", function () {
                                if (poster) {
                                        poster.style.opacity = "0";
                                }
                                video.play().catch(function () {
                                        /* Autoplay refusal keeps the poster; nothing breaks. */
                                });
                        });
                        hero.appendChild(video);
                });
        }

        /* ----------------------------------------------------------------
         * 5. Reveal on scroll: once only, never replays.
         * ------------------------------------------------------------- */
        var revealables = Array.prototype.slice.call(doc.querySelectorAll(".em-reveal"));
        if (revealables.length) {
                if (reduceMotion || !("IntersectionObserver" in window)) {
                        revealables.forEach(function (el) {
                                el.classList.add("is-visible");
                        });
                } else {
                        var io = new IntersectionObserver(
                                function (entries) {
                                        entries.forEach(function (entry) {
                                                if (entry.isIntersecting) {
                                                        entry.target.classList.add("is-visible");
                                                        io.unobserve(entry.target);
                                                }
                                        });
                                },
                                { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
                        );
                        revealables.forEach(function (el) {
                                io.observe(el);
                        });
                }
        }

        /* ----------------------------------------------------------------
         * 6. Ambience: YouTube facade. Nothing loads until the visitor
         *    opts in; the track then starts muted with the mute control
         *    always visible (48px minimum target on mobile).
         * ------------------------------------------------------------- */
        var ambience = doc.querySelector("[data-ambience]");
        if (ambience) {
                var state = ambience.querySelector("[data-ambience-state]");
                var panel = ambience.querySelector(".em-ambience__panel");
                var frame = ambience.querySelector("[data-ambience-frame]");
                var toggle = ambience.querySelector("[data-ambience-toggle]");
                var videoId = ambience.getAttribute("data-video-id") || "Q5u2Ddbvocc";
                var playing = false;
                var player = null;

                function mountPlayer() {
                        if (player) {
                                return;
                        }
                        var iframe = doc.createElement("iframe");
                        iframe.src =
                                "https://www.youtube-nocookie.com/embed/" +
                                videoId +
                                "?autoplay=1&mute=1&loop=1&playlist=" +
                                videoId +
                                "&controls=0&rel=0&modestbranding=1&playsinline=1";
                        iframe.title = "Ambient music";
                        iframe.allow = "autoplay; encrypted-media";
                        iframe.setAttribute("aria-hidden", "true");
                        frame.appendChild(iframe);
                        player = iframe;
                }

                function setPlaying(on) {
                        playing = on;
                        toggle.setAttribute("aria-pressed", on ? "true" : "false");
                        if (state) {
                                state.textContent = on ? "On" : "Music";
                        }
                        if (panel) {
                                panel.hidden = !on;
                        }
                }

                toggle.addEventListener("click", function () {
                        if (!playing) {
                                if (player && player.contentWindow) {
                                        player.contentWindow.postMessage(
                                                '{"event":"command","func":"playVideo","args":""}',
                                                "*"
                                        );
                                } else {
                                        mountPlayer();
                                }
                                setPlaying(true);
                        } else {
                                if (player && player.contentWindow) {
                                        player.contentWindow.postMessage(
                                                '{"event":"command","func":"pauseVideo","args":""}',
                                                "*"
                                        );
                                }
                                setPlaying(false);
                        }
                });
        }
})();
