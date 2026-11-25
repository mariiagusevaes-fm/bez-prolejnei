// Без пролежней — общий скрипт сайта (анимации, навигация, форма)
(function(){
  'use strict';

  // scroll-reveal
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.18});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // count-up stats
  document.querySelectorAll('.stat-card .n[data-count]').forEach(function(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var cur = 0;
          var step = Math.max(1, Math.round(target/36));
          var t = setInterval(function(){
            cur += step;
            if(cur >= target){ cur = target; clearInterval(t); }
            el.textContent = cur + suffix;
          }, 28);
          obs.unobserve(e.target);
        }
      });
    }, {threshold:0.5});
    obs.observe(el);
  });

  // mobile menu
  var burger = document.querySelector('.burger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if(burger && mobileMenu){
    burger.addEventListener('click', function(){
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(!q || !a) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(other){
        if(other !== item){
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // form submit -> Formspree
  var ENDPOINT = 'https://formspree.io/f/xkjjkvpe';
  document.querySelectorAll('form.contact-form').forEach(function(form){
    form.addEventListener('submit', function(evt){
      evt.preventDefault();
      var errBox = form.querySelector('.form-error');
      var okBox = form.querySelector('.form-success');
      var honeypot = form.querySelector('[name="company"]');
      if(errBox) errBox.style.display = 'none';
      if(honeypot && honeypot.value){
        if(okBox) okBox.style.display = 'block';
        form.querySelectorAll('.formrow, button[type="submit"]').forEach(function(x){ x.style.display='none'; });
        return;
      }
      var data = new FormData(form);
      data.append('page_url', window.location.href);
      data.append('_subject', 'Заявка с сайта bez-prolejnei.ru');
      var btn = form.querySelector('button[type="submit"]');
      if(btn) btn.disabled = true;
      fetch(ENDPOINT, { method:'POST', body:data, headers:{'Accept':'application/json'} })
        .then(function(res){ return res.ok; })
        .then(function(ok){
          if(btn) btn.disabled = false;
          if(ok){
            form.querySelectorAll('.formrow, button[type="submit"]').forEach(function(x){ x.style.display='none'; });
            if(okBox) okBox.style.display = 'block';
          } else if(errBox){
            errBox.textContent = 'Не удалось отправить. Позвоните нам или попробуйте ещё раз.';
            errBox.style.display = 'block';
          }
        })
        .catch(function(){
          if(btn) btn.disabled = false;
          if(errBox){
            errBox.textContent = 'Не удалось отправить. Проверьте соединение и попробуйте ещё раз.';
            errBox.style.display = 'block';
          }
        });
    });
  });
})();
