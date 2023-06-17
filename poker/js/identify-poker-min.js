var scriptTag=document.getElementById("identify-poker"),gameType=scriptTag.getAttribute("data-game-type");if(null==gameType)throw Error("data-game-type attribute must be set");function createConfetti(){confetti({particleCount:100,spread:70,origin:{y:.6}})}
function createPerformanceChart(a){const b=document.getElementById("performanceChart").getContext("2d"),c=Object.keys(a),f=c.map(g=>a[g].correct),d=c.map(g=>a[g].incorrect);return new Chart(b,{type:"bar",data:{labels:c,datasets:[{label:"Correct",data:f,backgroundColor:"rgba(75, 192, 192, 0.5)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1},{label:"Incorrect",data:d,backgroundColor:"rgba(255, 99, 132, 0.5)",borderColor:"rgba(255, 99, 132, 1)",borderWidth:1}]},options:{scales:{y:{beginAtZero:!0}},
plugins:{legend:{position:"top"}}}})}
let Board,Hole,BestHand,handCategoryTable={"high card":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},pair:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"two pair":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"three of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},straight:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},flush:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"full house":{correct:0,incorrect:0,secondsCorrect:0,
secondsIncorrect:0},"four of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"straight flush":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0}},performanceChart;
function updateTable(a,b,c){b=scoreHand(b);b=categories[b.category];localStorage.getItem("holdem_handCategoryTable")&&(localStorage.setItem("texas_handCategoryTable",localStorage.getItem("holdem_handCategoryTable")),localStorage.removeItem("holdem_handCategoryTable"));if("texas"==gameType)var f=localStorage.getItem("texas_handCategoryTable");else if("omaha"==gameType)f=localStorage.getItem("omaha_handCategoryTable");else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");f&&
(handCategoryTable=JSON.parse(f));a?(handCategoryTable[b].correct++,handCategoryTable[b].secondsCorrect+=c):(handCategoryTable[b].incorrect++,handCategoryTable[b].secondsIncorrect+=c);"texas"==gameType?localStorage.setItem("texas_handCategoryTable",JSON.stringify(handCategoryTable)):"omaha"==gameType&&localStorage.setItem("omaha_handCategoryTable",JSON.stringify(handCategoryTable));updateGraphAndTable(handCategoryTable)}
function updateGraphAndTable(a){var b=Object.keys(a).reduce((e,h)=>e+a[h].correct,0),c=Object.keys(a).reduce((e,h)=>e+a[h].incorrect,0),f=0<b||0<c?b/(b+c)*100:0,d=Object.keys(a).reduce((e,h)=>e+a[h].secondsCorrect,0),g=Object.keys(a).reduce((e,h)=>e+a[h].secondsIncorrect,0);b=0<b?d/b:0;c=0<c?g/c:0;document.getElementById("hand_category_table").innerHTML=`
<tr>
<th>Hand Category</th>
<th>Correct</th>
<th>Incorrect</th>
<th>Percent Correct</th>
<th>Total Time Correct</th>
<th>Average Time Correct (s)</th>
<th>Total Time Incorrect</th>
<th>Average Time Incorrect (s)</th>
</tr>
${Object.keys(a).map(e=>{const h=a[e].correct,n=a[e].incorrect;var k=h+n;k=0<k?(h/k*100).toFixed(0):"-";const l=a[e].secondsCorrect%60,q=Math.floor(a[e].secondsIncorrect/60),p=a[e].secondsIncorrect%60,m=a[e].secondsCorrect/h,r=a[e].secondsIncorrect/n;return`
<tr>
  <td>${e}</td>
  <td>${h}</td>
  <td>${n}</td>
  <td>${k}%</td>
    <td>${Math.floor(a[e].secondsCorrect/60)}:${10>l?"0":""}${l}</td>
    <td>${isNaN(m)?"-":m.toFixed(1)}</td>
    <td>${q}:${10>p?"0":""}${p}</td>
    <td>${isNaN(r)?"-":r.toFixed(1)}</td>

</tr>
`}).join("")}
<tr>
<td>Total</td>
<td>${Object.keys(a).reduce((e,h)=>e+a[h].correct,0)}</td>
<td>${Object.keys(a).reduce((e,h)=>e+a[h].incorrect,0)}</td>
    <td>${f.toFixed(0)}%</td>
    <td>${Math.floor(d/60)}m:${10>d%60?"0":""}${d%60}s</td>
    <td>${b.toFixed(1)}</td>
    <td>${Math.floor(g/60)}m:${10>g%60?"0":""}${g%60}s</td>
    <td>${c.toFixed(1)}</td>
</tr>
`;performanceChart?(f=Object.keys(a),performanceChart.data.labels=f,performanceChart.data.datasets[0].data=f.map(e=>a[e].correct),performanceChart.data.datasets[1].data=f.map(e=>a[e].incorrect),performanceChart.update()):performanceChart=createPerformanceChart(a)}function renderCards(a,b){const c=document.getElementById(b);c.innerHTML="";a.forEach(f=>{const d=document.createElement("div");d.classList.add("card");d.dataset.rank=f.rank;d.dataset.suit=f.suit;d.innerHTML=`
            <div class="card-rank">${"T"===f.rank?"10":f.rank}</div>
            <div class="card-suit">${getSuitCharColor(f.suit)}</div>
        `;c.appendChild(d)})}function renderHandScore(a,b,c){c=document.getElementById(c);a=getHandDescription(a);c.innerHTML=`
        <div>${b} ${a}</div>
    `}
function drawHand(){var a=shuffleDeck(createDeck());if(document.getElementById("setting_more_straights").checked)if("texas"==gameType){var b=pickStraight(a);if(null===b)Board=a.slice(0,5),Hole=a.slice(5,7);else{a=removeCards(a,b);a=a.slice(0,2);var c=b.concat(a);c=shuffleDeck(c);Board=c.slice(0,5);Hole=c.slice(5,7)}}else if("omaha"==gameType)b=pickStraight(a),null===b?(Board=a.slice(0,5),Hole=a.slice(5,9)):(a=removeCards(a,b),a=a.slice(0,4),b=shuffleDeck(b),c=b.slice(0,3).concat(a.slice(0,2)),Board=
c=shuffleDeck(c),Hole=shuffleDeck(a.slice(2,4).concat(b.slice(3,5))));else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");else if(Board=a.slice(0,5),"texas"==gameType)Hole=a.slice(5,7);else if("omaha"==gameType)Hole=a.slice(5,9);else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");renderCards(Board,"board");renderCards(Hole,"hole");document.getElementById("score_true").innerHTML="2. Click Confirm";document.getElementById("score_user").innerHTML=
"1. Pick your cards"}
function renderAlternateCards(a){var b=document.getElementById("hole"),c=document.getElementById("board");b=b.getElementsByClassName("card");const f=c.getElementsByClassName("card");c=g=>a.some(e=>e.rank===g.rank&&e.suit===g.suit);for(var d of b)b={rank:d.dataset.rank,suit:d.dataset.suit},d.classList.contains("selected")?(d.classList.remove("selected"),c(b)?d.classList.add("selected-right"):d.classList.add("selected-wrong")):c(b)?d.classList.add("should-have-selected"):d.classList.add("unselected-right");for(const g of f)d=
{rank:g.dataset.rank,suit:g.dataset.suit},g.classList.contains("selected")?(g.classList.remove("selected"),c(d)?g.classList.add("selected-right"):g.classList.add("selected-wrong")):c(d)?g.classList.add("should-have-selected"):g.classList.add("unselected-right")}
function allSelectedCardsAreCorrect(a){var b=document.getElementById("hole"),c=document.getElementById("board");b=b.getElementsByClassName("card selected");c=c.getElementsByClassName("card selected");return 2!==b.length||3!==c.length?!1:[...b,...c].every(f=>{var d=f.dataset.rank,g=f.dataset.suit;return a.some(e=>e.rank===d&&e.suit===g)})}
document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("hole"),b=document.getElementById("board"),c=document.getElementById("ConfirmBtn"),f=document.getElementById("DrawBtn");var d=document.getElementById("ResetStats");let g=!0;totalSeconds=0;const e=()=>{const k=a.getElementsByClassName("selected").length,l=b.getElementsByClassName("selected").length;c.disabled=5!==k+l};d.addEventListener("click",()=>{"texas"==gameType?localStorage.removeItem("texas_handCategoryTable"):
"omaha"==gameType&&localStorage.removeItem("omaha_handCategoryTable");handCategoryTable={"high card":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},pair:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"two pair":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"three of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},straight:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},flush:{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},
"full house":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"four of a kind":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0},"straight flush":{correct:0,incorrect:0,secondsCorrect:0,secondsIncorrect:0}};updateGraphAndTable(handCategoryTable)});d=k=>{if(g&&k.target.classList.contains("card")){var l="omaha"==gameType?"hole"==k.target.parentElement.id?2==a.getElementsByClassName("selected").length?!0:!1:3==b.getElementsByClassName("selected").length?!0:!1:5==document.getElementsByClassName("selected").length?
!0:!1;(k.target.classList.contains("selected")||0==l)&&k.target.classList.toggle("selected");e()}};a.addEventListener("click",d);b.addEventListener("click",d);c.addEventListener("click",()=>{g=!1;c.disabled=!0;f.disabled=!1;clearInterval(timerVar);const k=totalSeconds;var l=a.getElementsByClassName("selected"),q=b.getElementsByClassName("selected");if("texas"==gameType)var p=bestHoldemHand(Board,Hole);else if("omaha"==gameType)p=bestOmahaHand(Board,Hole);else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");
l=[...l,...q].map(t=>({rank:t.dataset.rank,suit:t.dataset.suit}));var m=scoreHand(l);q=scoreHand(p);let r;m.score===q.score?(createConfetti(),m=!0,p=l,r="Correct!:"):(m=!1,r="Wrong!:");updateTable(m,p,k);renderAlternateCards(p);renderHandScore(l,r,"score_user");m?document.getElementById("score_true").innerHTML="":renderHandScore(p,"Best Hand:","score_true");handCategory=categories[q.category];"texas"==gameType?(handCategory="holdem_"+handCategory+"_"+(m?"correct":"incorrect"),eventCategory="texas_hand"):
"omaha"==gameType&&(handCategory="omaha_"+handCategory+"_"+(m?"correct":"incorrect"),eventCategory="omaha_hand");gtag("event","identify_hand",{event_category:eventCategory,event_label:handCategory,value:k})});f.addEventListener("click",()=>{g=!0;f.disabled=!0;drawHand();e();clearInterval(timerVar);totalSeconds=0;document.getElementById("timer").innerHTML="00:00";timerVar=setInterval(countTimer,1E3)});d=Array.prototype.filter.call(document.getElementsByClassName("collapsible"),function(k){return"A"!==
k.tagName});var h=document.getElementsByClassName("content"),n;for(n=0;n<d.length;n++)d[n].addEventListener("click",function(k){return function(){this.classList.toggle("active");h[k].style.maxHeight?(h[k].style.maxHeight=null,h[k].style.overflow="hidden"):(h[k].style.maxHeight=h[k].scrollHeight+"px",h[k].style.overflow="auto")}}(n));document.getElementById("setting_use_timer").addEventListener("change",function(){localStorage.setItem("setting_use_timer",this.checked)});document.getElementById("setting_more_straights").addEventListener("change",
function(){localStorage.setItem("setting_more_straights",this.checked)});document.getElementById("setting_use_timer").checked="true"==localStorage.getItem("setting_use_timer");document.getElementById("setting_more_straights").checked="true"==localStorage.getItem("setting_more_straights");document.addEventListener("visibilitychange",function(){"hidden"===document.visibilityState?clearInterval(timerVar):timerVar=setInterval(countTimer,1E3)});drawHand();e();f.disabled=!0;if("texas"==gameType)d=localStorage.getItem("texas_handCategoryTable");
else if("omaha"==gameType){if(d=localStorage.getItem("omaha_handCategoryTable"),old_table=localStorage.getItem("handCategoryTable"))d?localStorage.removeItem("handCategoryTable"):(localStorage.setItem("omaha_handCategoryTable",d),localStorage.removeItem("handCategoryTable"),d=localStorage.getItem("omaha_handCategoryTable"))}else throw Error("data-game-type attribute must be set to 'texas' or 'omaha'");d&&(handCategoryTable=JSON.parse(d));updateGraphAndTable(handCategoryTable)});
