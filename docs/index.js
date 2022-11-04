const replyPlease=document.getElementById("replyPlease"),reply=document.getElementById("reply"),playPanel=document.getElementById("playPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=60;let answer="Talk Numbers",firstRun=!0,catCounter=0,solveCount=0,allVoices=[];const voiceInput=setVoiceInput();let endAudio,errorAudio,correctAudio;loadAudios();const AudioContext=window.AudioContext||window.webkitAudioContext,audioContext=new AudioContext;loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark"),localStorage.getItem("voice")==0&&(document.getElementById("voiceOn").classList.remove("d-none"),document.getElementById("voiceOff").classList.add("d-none"))}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function toggleVoice(){localStorage.getItem("voice")!=0?(localStorage.setItem("voice",0),document.getElementById("voiceOn").classList.add("d-none"),document.getElementById("voiceOff").classList.remove("d-none"),speechSynthesis.cancel()):(localStorage.setItem("voice",1),document.getElementById("voiceOn").classList.remove("d-none"),document.getElementById("voiceOff").classList.add("d-none"),voiceInput.stop(),speak(answer))}function playAudio(c,b){const a=audioContext.createBufferSource();if(a.buffer=c,b){const c=audioContext.createGain();c.gain.value=b,c.connect(audioContext.destination),a.connect(c),a.start()}else a.connect(audioContext.destination),a.start()}function unlockAudio(){audioContext.resume()}function loadAudio(a){return fetch(a).then(a=>a.arrayBuffer()).then(a=>new Promise((b,c)=>{audioContext.decodeAudioData(a,a=>{b(a)},a=>{c(a)})}))}function loadAudios(){promises=[loadAudio("mp3/end.mp3"),loadAudio("mp3/cat.mp3"),loadAudio("mp3/correct3.mp3")],Promise.all(promises).then(a=>{endAudio=a[0],errorAudio=a[1],correctAudio=a[2]})}function loadVoices(){const a=new Promise(b=>{let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{allVoices=a,addLangRadioBox()})}loadVoices();function speak(c){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(c),d=document.getElementById("langRadio").lang.value,b=allVoices.filter(a=>a.lang==d);a.onend=()=>{voiceInput.start()},a.voice=b[Math.floor(Math.random()*b.length)],a.lang=document.getElementById("langRadio").lang.value,voiceInput.stop(),speechSynthesis.speak(a)}function respeak(){speak(answer)}function addLangRadioBox(){const a=document.getElementById("langRadio");allVoices.forEach((c,f)=>{const d=document.createElement("div");d.className="form-check form-check-inline";const b=document.createElement("input");b.className="form-check-input",b.name="lang",b.type="radio",b.id="radio"+f,b.value=c.lang;const e=document.createElement("label");e.className="from-check-label",e.for="radio"+f,e.textContent=c.lang,d.appendChild(b),d.appendChild(e),a.appendChild(d),(c.lang=="en-US"||c.lang=="en_US")&&(b.checked=!0)})}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function nextProblem(){replyPlease.classList.remove("d-none"),reply.classList.add("d-none");const a=document.getElementById("grade").selectedIndex+1,b=Math.pow(10,a);answer=getRandomInt(0,b).toString(),document.getElementById("answer").textContent=answer,localStorage.getItem("voice")!=0&&speak(answer),firstRun&&(firstRun=!1)}function catNyan(){playAudio(errorAudio)}function loadImage(a){return new Promise((c,d)=>{const b=new Image;b.onload=()=>c(b),b.onerror=a=>d(a),b.src=a})}function loadCatImage(b){const a=128;return new Promise(c=>{loadImage(b).then(d=>{const b=document.createElement("canvas");b.setAttribute("role","button"),b.width=a,b.height=a,b.style.position="absolute",b.getContext("2d").drawImage(d,0,0),c(b)}).catch(a=>{console.log(a)})})}loadCatImage("kohacu.webp").then(a=>{catsWalk(a)});function catWalk(g,d){const c=document.getElementById("catsWalk"),e=c.offsetWidth,f=c.offsetHeight,a=d.cloneNode(!0);a.getContext("2d").drawImage(d,0,0);const b=128;a.style.top=getRandomInt(0,f-b)+"px",a.style.left=e-b+"px",a.addEventListener("click",()=>{catCounter+=1,speak(catCounter),a.remove()},{once:!0}),c.appendChild(a);const h=setInterval(()=>{const c=parseInt(a.style.left)-1;c>-b?a.style.left=c+"px":(clearInterval(h),a.remove())},g)}function catsWalk(a){setInterval(()=>{Math.random()>.995&&catWalk(getRandomInt(5,20),a)},10)}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio(endAudio),scoring())},1e3)}let countdownTimer;function countdown(){solveCount=0,clearTimeout(countdownTimer),countPanel.classList.remove("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3,countdownTimer=setInterval(()=>{const b=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const c=parseInt(a.textContent)-1;a.style.backgroundColor=b[c],a.textContent=c}else clearTimeout(countdownTimer),countPanel.classList.add("d-none"),playPanel.classList.remove("d-none"),solveCount=0,document.getElementById("score").textContent=0,nextProblem(),startGameTimer()},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=solveCount}function formatReply(a){return a.toLowerCase().split(" ").slice(0,-1).join(" ")}function setVoiceInput(){if("webkitSpeechRecognition"in window){const a=new webkitSpeechRecognition;return a.lang=document.getElementById("langRadio").lang.value,a.continuous=!0,a.onstart=()=>voiceInputOnStart,a.onend=()=>{speechSynthesis.speaking||a.start()},a.onresult=c=>{const b=c.results[0][0].transcript;document.getElementById("reply").textContent=b,b.toLowerCase()==answer.toLowerCase()?(solveCount+=1,playAudio(correctAudio),nextProblem()):(a.lang=="en_US"||a.lang=="en-US")&&formatReply(b)==answer.toLowerCase()&&(playAudio(correctAudio),nextProblem()),replyPlease.classList.add("d-none"),b.classList.remove("d-none"),a.stop()},a}else document.getElementById("noSTT").classList.remove("d-none")}function voiceInputOnStart(){document.getElementById("startVoiceInput").classList.add("d-none"),document.getElementById("stopVoiceInput").classList.remove("d-none")}function voiceInputOnStop(){document.getElementById("startVoiceInput").classList.remove("d-none"),document.getElementById("stopVoiceInput").classList.add("d-none")}function startVoiceInput(){try{voiceInput.start()}catch{}}function stopVoiceInput(){voiceInputOnStop(),voiceInput.stop()}document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("toggleVoice").onclick=toggleVoice,document.getElementById("startVoiceInput").onclick=startVoiceInput,document.getElementById("stopVoiceInput").onclick=stopVoiceInput,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("respeak").onclick=respeak,document.getElementById("kohacu").onclick=catNyan,document.getElementById("langRadio").onchange=()=>{voiceInput=setVoiceInput()},document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})