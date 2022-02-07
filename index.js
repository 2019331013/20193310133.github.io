class Calculator {
    constructor(pretext, currtext) {
        this.pretext = pretext;
        this.currtext = currtext;
        this.clear();
    }

    clear() {
        this.curroprnd = this.preoprnd = '';
        this.opp = undefined;
    }

    delete() {
        if (this.opp != null && this.curroprnd === '') {
            this.opp = undefined;
            this.curroprnd = this.preoprnd;
            this.preoprnd = '';
            
        } else this.curroprnd = this.curroprnd.toString().slice(0, -1);
        
    }

    pass(string) {
        if (string === '-' || string === '-.') return true;
        return false;
    }

    refresh() {
        if (this.curroprnd !== null && this.opp === undefined && this.should === undefined) {
            this.should = this.curroprnd;
            if (this.pass(this.curroprnd)) return;
            this.curroprnd = '';
        }
    }

    appendNum(number) {
        if (number === '.' && this.curroprnd.includes('.')) return;
        this.curroprnd = this.curroprnd.toString() + number.toString();
    }

    chooseopp(opp) {
        if (this.curroprnd === '') {
            if (opp === '-') this.appendNum(opp);
            return;
        }

        if (this.pass(this.curroprnd) || this.curroprnd === '.') return;
        
        if (this.preoprnd !== '') {
            this.compute();
            this.updateDisplay();
        }

        this.opp = opp;
        this.preoprnd = parseFloat(this.curroprnd);
        this.curroprnd = '';
    }

    veryEasy(prev, curr, opp) {
        if ((prev.toString().includes('.')) || (curr.toString().includes('.'))) return false;
        if ((prev.toString().includes('-')) || (curr.toString().includes('-'))) return false;

        switch (opp) {
            case '+':
                if (prev < 11 || curr < 11) return true;
                return false;
            case '-':
                if (prev > 999 || curr > 999) return false;
                if (Math.abs(prev-curr) < 6) return true;
                return false;
            case '*':
                if (easyNumbers.indexOf(prev) !== -1) {
                    if (easyNumbers.indexOf(curr) !== -1) {
                        if (curr > prev) this.curroprnd = this.preoprnd;
                        return true;
                    }
                    this.curroprnd = this.preoprnd;
                    return true;
                }
                if (easyNumbers.indexOf(curr) !== -1) return true;
                return false;
            case '/':
                if (prev === 0) return false;
                if (prev === curr) return true;
                let result = prev / curr;
                if (prev.toString().includes(result.toString())) return true;
                return false;
        }
        
    }

    compute() {
        let result, dot = 0;
        const prev = parseFloat(this.preoprnd);
        const curr = parseFloat(this.curroprnd);

        if (isNaN(prev) || isNaN(curr)) return;
        if (prev.toString().includes('.')) dot = prev.toString().split('.')[1].length;
        if (curr.toString().includes('.')) dot += curr.toString().split('.')[1].length;

        switch (this.opp) {
            case '+':
                if (this.veryEasy(prev, curr, this.opp)) {
                    this.easy = true;
                    this.sign = 'jog';
                    return;
                }

                result = prev + curr;
                break;
            case '-':
                if (this.veryEasy(prev, curr, this.opp)) {
                    this.easy = true;
                    this.sign = 'biyog';
                    return;
                }

                result = prev - curr;
                break;
            case '*':
                if (this.veryEasy(prev, curr, this.opp)) {
                    this.easy = true;
                    this.sign = 'gun';
                    return;
                }

                result = prev * curr;
                break;
            case '/':
                if (this.veryEasy(prev, curr, this.opp)) {
                    this.easy = true;
                    this.sign = 'vag';
                    return;
                }

                result = prev / curr;
                break;
            default: return;
        }

        if (this.opp !== '/') result = parseFloat(result.toFixed(dot));
        else result = parseFloat(result.toFixed(3));

        this.curroprnd = result;
        this.opp = this.should = undefined;
        this.preoprnd = '';
    }

    getnum(number) {
        const stringNumber = number.toString();

        const int = parseFloat(stringNumber.split('.')[0]);
        const deci = stringNumber.split('.')[1];

        let display;
        if (isNaN(int)) {
            if (stringNumber.includes('-')) display = '-';
            else display = '';
        } else display = int.toLocaleString('en', { maximumFractionDigits: 0 });

        if (deci != null) return `${display}.${deci}`;
        else return display;
    }

    updateDisplay() {
        if (this.pass(this.curroprnd)) {
            this.currtext.innerText = this.curroprnd;
            return;
        }

        this.currtext.innerText = this.getnum(this.curroprnd);

        if (this.opp != null) {
            if (this.easy) {
                this.easy = undefined;
                if (this.opp === '+' || this.opp === '-') this.pretext.innerText =
                    `${this.preoprnd} ar ${this.curroprnd} abar ${this.sign} kora lage ekhane?`;
                else this.pretext.innerText =
                    `${this.curroprnd} diye ${this.sign} o kora lage ekhane?`;
                
                this.currtext.innerText = 'Try something hard';
                this.clear();
                return;
            }

            this.pretext.innerText =
                `${this.getnum(this.preoprnd)} ${this.opp}`;
            
        } else this.pretext.innerText = '';
    }
}

numbut = document.getElementsByClassName("data-number");
oppbut = document.getElementsByClassName("data-operation");
equal = document.getElementById("data-equals");
del = document.getElementById("data-delete");
allclr = document.getElementById("data-all-clear");
pretext = document.getElementById("data-previous-operand");
currtext = document.getElementById("data-current-operand");

easyNumbers = [0, 1, 10, 100, 1000, 10000, 100000, 1000000];

const calculator = new Calculator(pretext, currtext);

let yes = false;

for (item of numbut) {
    item.addEventListener('click', (e) => {
        text = e.target.innerText;
        calculator.refresh(text);
        calculator.appendNum(text);
        calculator.updateDisplay();
    })
}

for (item of oppbut) {
    item.addEventListener('click', (e) => {
        text = e.target.innerText;
        calculator.chooseopp(text);
        calculator.updateDisplay();
    })
}

equal.addEventListener("click", (e) => {
    text = e.target.innerText;
    calculator.compute();
    calculator.updateDisplay();
    yes = false;
})

allclr.addEventListener('click', btn => {
    calculator.clear();
    calculator.updateDisplay();
})

del.addEventListener('click', btn => {
    calculator.refresh();
    calculator.delete();
    calculator.updateDisplay();
})


