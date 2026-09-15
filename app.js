(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const toast = (msg) => { let t = $('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);} t.textContent=msg; t.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove('show'),1800); };
  const sound = (ok) => { try { const C=window.AudioContext||window.webkitAudioContext; if(!C)return; const c=new C(); const o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.value=ok?660:220;g.gain.setValueAtTime(.001,c.currentTime);g.gain.exponentialRampToValueAtTime(.12,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.18);o.start();o.stop(c.currentTime+.19); } catch(e){} };

  $$('.menu-toggle').forEach(btn => btn.addEventListener('click', () => { const n=$('.nav-links'); if(n)n.classList.toggle('open'); }));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => $('.nav-links')?.classList.remove('open')));

  const questions = $$('.quiz-card[data-answer]');
  if (questions.length) {
    let score=0, answered=0;
    questions.forEach(card => {
      const answer = card.dataset.answer;
      $$('.choice', card).forEach(btn => btn.addEventListener('click', () => {
        if(card.dataset.done==='1') return;
        card.dataset.done='1'; answered++;
        const ok = btn.dataset.value===answer;
        if(ok){score++;btn.classList.add('correct');sound(true);toast('Correct! Great job 🌟');}
        else {btn.classList.add('wrong'); $(`.choice[data-value="${CSS.escape(answer)}"]`,card)?.classList.add('correct'); sound(false); toast('Not quite — check the green answer.');}
        const note=$('.answer-note',card); if(note){note.classList.remove('hide');note.textContent=ok?'✅ Correct!':'💡 The correct answer is highlighted.';}
        const scoreEl=$('#score'); if(scoreEl) scoreEl.textContent=`${score}/${questions.length}`;
        const p=$('#progress'); if(p)p.style.width=`${Math.round(answered/questions.length*100)}%`;
        if(answered===questions.length){const result=$('#quiz-result');if(result)result.textContent=`Final score: ${score}/${questions.length} — ${score===questions.length?'Perfect! 🏆':score>=8?'Excellent work! 🌍':score>=5?'Nice effort! Keep exploring.':'Keep practicing — every explorer starts somewhere!'}`;}
      }));
    });
  }

  const search = $('#country-search'), region = $('#country-region');
  const countries = $$('.country');
  const filterCountries = () => { if(!countries.length)return; const q=(search?.value||'').trim().toLowerCase(), r=region?.value||'all'; let shown=0; countries.forEach(c=>{const text=c.textContent.toLowerCase();const cr=c.dataset.region||'';const ok=text.includes(q)&&(r==='all'||cr===r);c.classList.toggle('hide',!ok);if(ok)shown++;}); const count=$('#country-count');if(count)count.textContent=`Showing ${shown} of ${countries.length} countries`; };
  search?.addEventListener('input',filterCountries); region?.addEventListener('change',filterCountries); filterCountries();

  const flags = $('#flag-game');
  if(flags){
    const pool = JSON.parse(flags.dataset.flags || '[]'); let idx=0, score=0, locked=false;
    const flag=$('#flag-emoji'), prompt=$('#flag-prompt'), choices=$('#flag-options'), scoreEl=$('#flag-score'), countEl=$('#flag-count');
    const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
    const render=()=>{locked=false; if(!pool.length)return; const item=pool[idx%pool.length]; flag.textContent=item.flag;prompt.textContent='Which country does this flag belong to?';countEl.textContent=`Challenge ${idx+1}`; const opts=shuffle([item.name,...shuffle(pool.filter(x=>x.name!==item.name)).slice(0,3).map(x=>x.name)]); choices.innerHTML=opts.map(n=>`<button class="choice" data-value="${n.replaceAll('"','&quot;')}">${n}</button>`).join(''); $$('.choice',choices).forEach(b=>b.addEventListener('click',()=>{if(locked)return;locked=true;const ok=b.dataset.value===item.name;if(ok){score++;b.classList.add('correct');toast('You got it! 🚩');sound(true)}else{b.classList.add('wrong');$$('.choice',choices).find(x=>x.dataset.value===item.name)?.classList.add('correct');toast(`It was ${item.name}.`);sound(false)}scoreEl.textContent=`Score ${score}`;}));};
    $('#flag-next')?.addEventListener('click',()=>{idx=(idx+1)%pool.length;render();}); $('#flag-reset')?.addEventListener('click',()=>{idx=0;score=0;scoreEl.textContent='Score 0';render();}); render();
  }

  const randomFact=$('#random-fact'), factText=$('#fact-text'); if(randomFact&&factText){randomFact.addEventListener('click',()=>{const facts=JSON.parse(randomFact.dataset.facts||'[]');factText.textContent=facts[Math.floor(Math.random()*facts.length)];});}
})();