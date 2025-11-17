const screen = document.getElementById('screen');
const subscreen = document.getElementById('subscreen');
const keys = document.querySelector('.keys');
const modeBtn = document.getElementById('mode-toggle');
const memIndicator = document.getElementById('memory-indicator');

let expression = '';
let memory = 0;
let angleMode = 'DEG';

function updateScreen(){
  screen.value = expression || '0';
}

function setSub(text){
  subscreen.textContent = text || '';
}

function toRadians(x){ return x * Math.PI / 180; }
function fromRadians(x){ return x * 180 / Math.PI; }

function applyTrig(fn, arg){
  let a = Number(arg);
  if(angleMode === 'DEG') a = toRadians(a);
  const rads = {
    sin: Math.sin(a),
    cos: Math.cos(a),
    tan: Math.tan(a),
    asin: fromRadians(Math.asin(a)),
    acos: fromRadians(Math.acos(a)),
    atan: fromRadians(Math.atan(a))
  };
  return rads[fn];
}

function factorial(n){
  n = Math.floor(n);
  if(n < 0) return NaN;
  let r = 1;
  for(let i=1;i<=n;i++) r *= i;
  return r;
}

keys.addEventListener('click', e => {
  const b = e.target.closest('button');
  if(!b) return;

  const val = b.dataset.value;
  const action = b.dataset.action;

  if(val){
    expression += val;
    updateScreen();
    return;
  }

  switch(action){
    case 'ac': expression = ''; setSub(''); break;
    case 'back': expression = expression.slice(0,-1); break;

    case 'equals':
      try{
        if(expression.includes('!')){
          expression = expression.replace(/(\\d+)!/, (_,n)=> factorial(Number(n)));
        }

        let evalExpr = expression
          .replace(/sin\\(([^)]+)\\)/g, (_,a)=> applyTrig('sin', a))
          .replace(/cos\\(([^)]+)\\)/g, (_,a)=> applyTrig('cos', a))
          .replace(/tan\\(([^)]+)\\)/g, (_,a)=> applyTrig('tan', a))
          .replace(/asin\\(([^)]+)\\)/g, (_,a)=> applyTrig('asin', a))
          .replace(/acos\\(([^)]+)\\)/g, (_,a)=> applyTrig('acos', a))
          .replace(/atan\\(([^)]+)\\)/g, (_,a)=> applyTrig('atan', a))
          .replace(/sqrt\\(([^)]+)\\)/g, (_,a)=> Math.sqrt(Number(a)))
          .replace(/ln\\(([^)]+)\\)/g, (_,a)=> Math.log(Number(a)))
          .replace(/(\\d+)\\s*%/g, (_,n)=> Number(n)/100);

        evalExpr = evalExpr.replace(/(\\d+(?:\\.\\d+)?|\\([^\\)]+\\))\\s*\\^\\s*(\\d+(?:\\.\\d+)?|\\([^\\)]+\\))/g, 'Math.pow($1,$2)');

        const result = Function('return (' + evalExpr + ')')();
        setSub(expression + ' =');
        expression = String(result);

      }catch{
        expression = '';
        setSub('Error');
      }
      break;

    case 'sin': case 'cos': case 'tan':
    case 'asin': case 'acos': case 'atan':
      expression += `${action}(`;
      break;

    case 'ln': expression += 'ln('; break;
    case 'log10': expression += 'log10('; break;
    case 'sqrt': expression += 'sqrt('; break;
    case 'pow2': expression += '^2'; break;
    case 'pow3': expression += '^3'; break;
    case 'pow': expression += '^'; break;
    case 'percent': expression += '%'; break;
    case 'fact': expression += '!'; break;

    case 'neg':
      expression = expression.startsWith('-') ? expression.slice(1) : '-' + expression;
      break;

    case 'mc': memory = 0; memIndicator.textContent = ''; break;
    case 'mr': expression += String(memory); break;
    case 'mplus': memory += Number(expression || 0); memIndicator.textContent = 'M'; break;
    case 'mminus': memory -= Number(expression || 0); memIndicator.textContent = 'M'; break;
  }

  updateScreen();
});

modeBtn.addEventListener('click',()=>{
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  modeBtn.textContent = angleMode;
});

updateScreen();
