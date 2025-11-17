// Simple scientific calculator logic
keys.addEventListener('click', e => {
const b = e.target.closest('button');
if(!b) return;
const val = b.dataset.value;
const action = b.dataset.action;


if(val) {
expression += val;
updateScreen();
return;
}


switch(action){
case 'ac': expression = ''; setSub(''); break;
case 'back': expression = expression.slice(0,-1); break;
case 'equals':
try{
// handle factorial
if(expression.includes('!')){
const m = expression.match(/(\d+)\!/);
if(m) expression = expression.replace(m[0], factorial(Number(m[1])));
}
// evaluate trig & other functions manually
let evalExpr = expression
.replace(/sin\(([^)]+)\)/g, (_,a)=> applyTrig('sin', a))
.replace(/cos\(([^)]+)\)/g, (_,a)=> applyTrig('cos', a))
.replace(/tan\(([^)]+)\)/g, (_,a)=> applyTrig('tan', a))
.replace(/asin\(([^)]+)\)/g, (_,a)=> applyTrig('asin', a))
.replace(/acos\(([^)]+)\)/g, (_,a)=> applyTrig('acos', a))
.replace(/atan\(([^)]+)\)/g, (_,a)=> applyTrig('atan', a))
.replace(/sqrt\(([^)]+)\)/g, (_,a)=> Math.sqrt(Number(a)))
.replace(/cbrt\(([^)]+)\)/g, (_,a)=> Math.cbrt(Number(a)))
.replace(/ln\(([^)]+)\)/g, (_,a)=> Math.log(Number(a)))
.replace(/log10\(([^)]+)\)/g, (_,a)=> Math.log10 ? Math.log10(Number(a)) : Math.log(Number(a))/Math.LN10)
.replace(/(\d+)\s*%/g, (_,n)=> (Number(n)/100));


// simple pow x^y handled by caret -> Math.pow replacement
evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?|\([^\)]+\))\s*\^\s*(\d+(?:\.\d+)?|\([^\)]+\))/g, 'Math.pow($1,$2)');


const result = Function('return (' + evalExpr + ')')();
setSub(expression + ' =');
expression = String(result);
}catch(err){
expression = '';
setSub('Error');
}
break;
case 'sin': case 'cos': case 'tan': case 'asin': case 'acos': case 'atan':
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
if(expression.startsWith('-')) expression = expression.slice(1);
else expression = '-' + expression;
break;
case 'mc': memory = 0; memIndicator.textContent = ''; break;
case 'mr': expression +=
