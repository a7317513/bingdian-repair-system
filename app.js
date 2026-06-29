let score=100, selected=new Set(), known=[];
let state={powerOn:true,powerOff:false,ticketViews:0,cover:false,extinguisher:false,oilFound:false,frostFound:false,filter:false,board:false,cap:false,voltage:false,pressure:false,capReplaced:false,boardReplaced:false,fuseReplaced:false};
const tools=[
{id:'clamp',n:'勾表',f:'ACV/ACA/Ω'},
{id:'meter',n:'三用電表',f:'ACV/DCV/Ω/通斷'},
{id:'capmeter',n:'電容測試器',f:'μF測試'},
{id:'gauge',n:'壓力錶',f:'高低壓'},
{id:'magnifier',n:'放大鏡',f:'搜尋油漬/焦痕'},
{id:'driver',n:'起子工具組',f:'拆外殼/外蓋'},
{id:'boardPart',n:'備用主機板',f:'更換機板'},
{id:'capPart',n:'備用電容',f:'更換電容'},
{id:'fusePart',n:'保險絲15A',f:'更換保險絲'},
{id:'blanket',n:'防火毯',f:'焊接防火'},
{id:'extinguisher',n:'滅火器',f:'初期滅火'},
{id:'torch',n:'乙炔焊具',f:'焊接'},
{id:'rod',n:'焊條',f:'焊接耗材'}
];
const screen=document.getElementById('screen'), actions=document.getElementById('actions'), scoreEl=document.getElementById('score');
function setScore(v){score=Math.max(0,v);scoreEl.textContent=score}
function has(t){return selected.has(t)}
function add(title,lines){if(!known.find(k=>k.title===title)){known.push({title,lines});drawKnown()}}
function msg(t){let e=document.getElementById('status'); if(e)e.textContent=t}
function drawKnown(){let e=document.getElementById('known'); if(!e)return; e.innerHTML=known.map(k=>`<div class="data"><b>${k.title}</b>${k.lines.map(x=>`<div>${x}</div>`).join('')}</div>`).join('')}
function meter(label,val,unit){let e=document.getElementById('meters'); if(e)e.innerHTML+=`<div class="meter"><div>${label}</div><div class="v">${val}<small>${unit}</small></div></div>`}
function ticketHtml(){return `<div class="card ticket"><h2>維修單 DEMO-003</h2>
<p><b>品牌：</b>冰點　<b>冷媒：</b>R32　<b>機型：</b>FU-52HSG</p>
<p><b>故障碼：</b>D6</p>
<p><b>客戶描述：</b>昨天晚上還會冷，今天早上完全不冷。昨天有聞到一點燒焦味。</p>
<p><b>現象：</b>室內有風、室外偶爾嗡嗡聲後停止。沒有提到長期慢慢不冷，因此本關不設冷媒洩漏主因。</p></div>`}
function start(){screen.innerHTML=ticketHtml();actions.innerHTML=`<button class="btn" onclick="selectTools()">選擇攜帶物品</button>`}
function selectTools(){
screen.innerHTML=ticketHtml()+`<div class="card"><h2>選擇攜帶物品</h2><div class="grid">${tools.map(t=>`<button class="selectTool ${selected.has(t.id)?'selected':''}" onclick="toggle('${t.id}')">${t.n}<small>${t.f}</small></button>`).join('')}</div></div>`;
actions.innerHTML=`<button class="btn" onclick="site()">到客戶家</button>`;
}
function toggle(id){selected.has(id)?selected.delete(id):selected.add(id);selectTools()}
function sidePanel(){
return `<aside class="panel"><h2>工具/零件</h2><div class="toolbar">${[...selected].map(id=>{let t=tools.find(x=>x.id===id);return `<button class="tool" draggable="true" data-tool="${id}">${t.n}<small>${t.f}</small></button>`}).join('')||'<div class="data">沒有選工具</div>'}</div><h2>已知數據</h2><div class="known" id="known"></div><div id="meters"></div><div class="status" id="status">電源狀態：${state.powerOn?'ON':'OFF'}</div></aside>`;
}
function commonActions(extra=''){
actions.innerHTML=`<button class="btn" onclick="ticketModal()">維修單</button><button class="btn btn2" onclick="site()">大場景</button><button class="btn btn2" onclick="diagnosis()">結案</button>${extra}`;
}
function ticketModal(){state.ticketViews++;add('維修單複閱',[`審閱 ${state.ticketViews} 次`]);document.body.insertAdjacentHTML('beforeend',`<div class="modal" id="ticketModal"><div class="box">${ticketHtml()}<button class="btn" onclick="document.getElementById('ticketModal').remove()">關閉</button></div></div>`)}
function dragSetup(){document.querySelectorAll('.tool').forEach(t=>t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',t.dataset.tool)));document.querySelectorAll('.drop').forEach(z=>{z.addEventListener('dragover',e=>e.preventDefault());z.addEventListener('drop',e=>{e.preventDefault();handleDrop(z.id,e.dataTransfer.getData('text/plain'))})})}
function handleDrop(zone,tool){if(zone==='firezone'&&tool==='blanket'){state.cover=true;msg('防火毯已放置。')}if(zone==='firezone'&&tool==='extinguisher'){state.extinguisher=true;msg('滅火器已放置。')}if(zone==='pipezone'&&tool==='magnifier'){add('銅管目視',['未見明顯油漬；本關冷媒洩漏不是主線']);msg('未見明顯油漬。')}if(zone==='coilzone'&&tool==='magnifier'){state.frostFound=true;add('蒸發器觀察',['取下濾網後，可見輕微局部結霜','濾網髒造成風量不足可能加重保護']);msg('看見輕微局部結霜。')}}
function site(){
screen.innerHTML=`<div class="layout"><div class="scene"><svg viewBox="0 0 500 430"><rect width="500" height="430" fill="#dcecf5"/><rect x="0" y="305" width="500" height="125" fill="#c8d7df"/><rect x="42" y="55" width="185" height="58" rx="14" fill="#fff" stroke="#789"/><rect x="64" y="101" width="137" height="9" rx="4" fill="#8aa"/><rect x="300" y="295" width="140" height="92" rx="12" fill="#f7f7f7" stroke="#678"/><circle cx="370" cy="342" r="33" fill="none" stroke="#789" stroke-width="8"/><rect x="38" y="245" width="70" height="110" rx="8" fill="#eef5f8" stroke="#789"/></svg>
<button class="spot" style="left:8%;top:57%" onclick="powerBox()">配電箱</button><button class="spot" style="left:20%;top:22%" onclick="enterIndoor()">內機</button><button class="spot" style="left:70%;top:77%" onclick="enterOutdoor()">外機</button><button class="spot" style="left:58%;top:18%" onclick="listen()">聽聲音</button></div>${sidePanel()}</div>`;
commonActions();drawKnown();dragSetup();
}
function powerBox(){
screen.innerHTML=`<div class="layout"><div class="scene"><svg viewBox="0 0 500 430"><rect width="500" height="430" fill="#eef6fa"/><rect x="130" y="50" width="240" height="310" rx="16" fill="#fff" stroke="#789" stroke-width="3"/><text x="195" y="90" font-size="22">配電箱</text><rect x="185" y="125" width="130" height="65" rx="8" fill="${state.powerOn?'#d9ffe4':'#eee'}" stroke="#789"/><text x="210" y="165" font-size="22">${state.powerOn?'ON':'OFF'}</text><rect x="185" y="230" width="130" height="65" rx="8" fill="#f6fbff" stroke="#789"/><text x="203" y="270" font-size="20">冷氣迴路</text></svg>
<button class="spot" style="left:24%;top:36%" onclick="powerOn()">ON</button><button class="spot" style="left:56%;top:36%" onclick="powerOff()">OFF</button><button class="spot" style="left:40%;top:62%" onclick="measureBoxVoltage()">量電壓</button></div>${sidePanel()}</div>`;
commonActions();drawKnown();
}
function powerOn(){state.powerOn=true;state.powerOff=false;add('配電箱',['冷氣專用迴路：ON']);powerBox()}
function powerOff(){state.powerOn=false;state.powerOff=true;add('配電箱',['冷氣專用迴路：OFF']);powerBox()}
function measureBoxVoltage(){if(!has('meter')&&!has('clamp')){msg('沒有可量電壓工具。');setScore(score-10);return}state.voltage=true;add('配電箱電壓',[state.powerOn?'L-N：220V':'迴路OFF：0V']);meter('配電箱電壓',state.powerOn?'220':'0','V');msg('電壓數據已加入。')}
function listen(){add('聲音',['外機：嗡～～約3秒後停止','像啟動失敗，不像冷媒慢漏主訴']);msg('聲音線索已加入。')}
function enterOutdoor(){if(!has('driver')){msg('沒有起子工具組，外殼無法拆開。');setScore(score-10);return}outdoorView()}
function outdoorView(){
screen.innerHTML=`<div class="layout"><div class="scene"><svg viewBox="0 0 620 460"><rect width="620" height="460" fill="#edf6fb"/><rect x="24" y="22" width="572" height="408" rx="20" fill="#f8fafb" stroke="#789" stroke-width="3"/><rect x="55" y="50" width="280" height="210" rx="14" class="pcb"/><text x="145" y="78" class="label" fill="#fff">室外機控制基板</text><path d="M85 105 H210 V145 H305" class="pcbTrace"/><path d="M85 130 H180 V190 H300" class="pcbTrace"/><rect x="78" y="92" width="55" height="38" class="terminal"/><text x="86" y="116" class="label">ACL/ACN</text><rect x="152" y="92" width="45" height="38" class="relay"/><text x="158" y="116" font-size="11" fill="#fff">RELAY</text><circle cx="245" cy="112" r="22" class="cap"/><text x="230" y="117" font-size="11" fill="#fff">680µF</text><rect x="276" y="145" width="38" height="45" class="component"/><text x="281" y="171" class="label">BR</text><rect x="276" y="198" width="36" height="24" class="burn"/><rect x="382" y="58" width="165" height="155" rx="12" fill="#dff1f8" stroke="#789"/><text x="430" y="85" class="label">銅管區</text><path d="M410 130 C455 95 500 160 530 120" stroke="#26384a" stroke-width="6" fill="none"/><rect x="372" y="260" width="150" height="80" rx="10" fill="#fff2cc" stroke="#9b7"/><text x="400" y="305" class="label">運轉電容區</text></svg>
<button class="spot" style="left:19%;top:28%" onclick="board()">控制基板</button><button class="spot" style="left:20%;top:39%" onclick="terminalVoltage()">端子量電壓</button><button class="spot" style="left:71%;top:28%" onclick="pipeObserve()">銅管觀察</button><button class="spot" style="left:67%;top:68%" onclick="cap()">電容區</button><button class="spot" style="left:74%;top:49%" onclick="pressure()">低壓錶</button><button class="drop" id="pipezone" style="left:74%;top:37%">放大鏡</button><button class="drop" id="firezone" style="left:61%;top:72%">防火區</button></div>${sidePanel()}</div>`;
commonActions(`<button class="btn btn2" onclick="replaceCap()">更換電容</button><button class="btn btn2" onclick="replaceBoard()">更換機板</button><button class="btn btn2" onclick="replaceFuse()">更換保險絲</button><button class="btn btnDanger" onclick="weld()">焊接</button>`);drawKnown();dragSetup();
}
function terminalVoltage(){if(!has('meter')&&!has('clamp')){msg('沒有可量電壓工具。');setScore(score-10);return}state.voltage=true;add('外機端子電壓',[state.powerOn?'ACL/ACN：220V':'迴路OFF：0V']);meter('外機端子',state.powerOn?'220':'0','V');msg('外機端子電壓已加入。')}
function board(){if(state.powerOn){add('控制基板目視',['目前送電中，只能目視，不可拆拔端子','可見橋式整流器附近焦黑痕跡']);msg('送電中只能目視。')}else{state.board=true;add('控制基板檢查',['保險絲15A：燒毀','橋式整流器附近焦黑','基板銅箔有腐蝕綠鏽']);meter('殘壓','0','V');msg('斷電後完成基板檢查。')}}
function cap(){if(state.powerOn){gameOver('電容放電/觸電事故','送電狀態拆測電容區。');return}if(!has('capmeter')){msg('沒有電容測試器，無法取得μF。');setScore(score-10);return}state.cap=true;add('電容測試',['標示：35µF','實測：5.1µF','容量嚴重不足']);meter('電容','5.1','µF');msg('電容數據已加入。')}
function pipeObserve(){add('銅管目視',['沒有明顯大量油漬','本關冷媒系統不是主要矛盾']);msg('銅管目視資訊已加入。')}
function pressure(){if(!has('gauge')){msg('沒有壓力錶。');setScore(score-10);return}state.pressure=true;add('壓力錶',['外機未穩定運轉，壓力只當參考','低壓靜態參考值，不能直接判冷媒不足']);meter('低壓','--','psi');msg('壓力資料已加入。')}
function replaceCap(){if(state.powerOn){gameOver('觸電事故','送電狀態更換電容。');return}if(!has('capPart')){msg('沒有備用電容，無法更換。');setScore(score-10);return}state.capReplaced=true;add('維修動作',['已更換運轉/啟動電容']);msg('已更換電容。')}
function replaceBoard(){if(state.powerOn){gameOver('觸電事故','送電狀態更換主機板。');return}if(!has('boardPart')){msg('沒有備用主機板，無法更換。');setScore(score-10);return}state.boardReplaced=true;add('維修動作',['已更換室外控制基板']);msg('已更換機板。')}
function replaceFuse(){if(state.powerOn){gameOver('觸電事故','送電狀態更換保險絲。');return}if(!has('fusePart')){msg('沒有15A保險絲，無法更換。');setScore(score-10);return}state.fuseReplaced=true;add('維修動作',['已更換15A保險絲']);msg('已更換保險絲。')}
function weld(){if(!has('torch')&&!has('rod')){msg('沒有焊接工具，無法焊接；不會起火。');return}if(state.powerOn){gameOver('觸電事故','送電狀態焊接施工。');return}if(!state.cover||!state.extinguisher){gameOver('起火事故','焊接前未完成防火毯與滅火器配置。');return}add('焊接施工',['防火配置完成，焊接未起火']);msg('焊接完成。')}
function enterIndoor(){if(!has('driver')){msg('沒有起子工具組，內機外蓋無法拆開。');setScore(score-10);return}indoorView()}
function indoorView(){screen.innerHTML=`<div class="layout"><div class="scene"><svg viewBox="0 0 560 430"><rect width="560" height="430" fill="#edf6fb"/><rect x="35" y="55" width="490" height="310" rx="24" fill="#fff" stroke="#789" stroke-width="3"/><rect x="75" y="95" width="410" height="70" rx="12" fill="#dce7ed" stroke="#789"/><rect x="92" y="108" width="380" height="45" class="filterDirt"/><text x="215" y="136" font-size="18" fill="#fff">濾網</text><rect x="85" y="205" width="395" height="105" rx="12" fill="#e8f7ff" stroke="#789"/><rect x="105" y="255" width="85" height="28" class="frost"/><rect x="200" y="255" width="85" height="28" class="frost"/><circle cx="470" cy="330" r="36" fill="none" stroke="#789" stroke-width="8"/></svg><button class="spot" style="left:40%;top:31%" onclick="filter()">濾網</button><button class="drop" id="coilzone" style="left:38%;top:62%">歧片區</button><button class="spot" style="left:80%;top:77%" onclick="fanTouch()">風扇區</button></div>${sidePanel()}</div>`;commonActions();drawKnown();dragSetup()}
function filter(){state.filter=true;add('濾網',['濾網過髒','取下後可見蒸發器輕微局部結霜']);msg('濾網資料已加入。')}
function fanTouch(){if(state.powerOn){gameOver('內機風扇捲入事故','送電狀態伸手進入風扇區。');return}add('風扇區',['風扇已停止，可安全檢視','葉輪灰塵偏多']);msg('風扇區資訊已加入。')}
function gameOver(title,reason){screen.innerHTML=`<div class="card gameover"><h2>GAME OVER｜${title}</h2><p>${reason}</p></div>`;setScore(0);actions.innerHTML=`<button class="btn" onclick="location.reload()">重新挑戰</button>`}
function diagnosis(){screen.innerHTML=`<div class="card"><h2>結案判斷</h2><div class="grid"><button class="choice" onclick="answer(0)">A. 只有冷媒不足</button><button class="choice" onclick="answer(1)">B. 電容失效 + 保險絲/基板焦黑風險 + 室內側風量問題</button><button class="choice" onclick="answer(2)">C. 只有感溫器故障</button><button class="choice" onclick="answer(3)">D. 只要補冷媒</button></div></div>`;actions.innerHTML=`<button class="btn btn2" onclick="site()">回現場</button>`}
function answer(i){let ok=i===1;if(!ok)setScore(score-40);let ev=[];if(!state.voltage)ev.push('未量電壓');if(!state.board)ev.push('未斷電檢查基板/保險絲');if(!state.cap)ev.push('未量電容');if(!state.filter)ev.push('未檢查內機濾網');if(!state.capReplaced)ev.push('未更換電容');screen.innerHTML=`<div class="card"><h2>${ok?'✅ 結案方向正確':'❌ 結案方向不完整'}</h2><p><b>評分：</b>${score}</p><h3>漏項</h3>${ev.length?ev.map(e=>`<p class="danger">• ${e}</p>`).join(''):'<p class="ok">主要流程完整。</p>'}<h3>已知數據</h3>${known.map(k=>`<p><b>${k.title}</b><br>${k.lines.join('<br>')}</p>`).join('')}</div>`;actions.innerHTML=`<button class="btn" onclick="location.reload()">重新挑戰</button>`}
start();