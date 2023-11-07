function validateCode() {
    const code = document.getElementById('codeInput').value.split('\n');

    const tokens = {
        'variableDeclaration': /(\b[^\d\s]+\b)->\s*("[^"]+"|\d+)/,
        'functionDeclaration': /act\s+(\w+)\s*\(\s*([a-zA-Z]+\s*(,\s*[a-zA-Z]+)*)?\s*\)\s*\{/,
        'forLoop': /vos\s+\w+\s+en\s+\(\d+,\s*\d+\)\s*\{/,
        'conditional': /ira\s+.+\s*\{\s*.*\s*\}|\s*ira\s+.+\s*\{/,
        'conditional': /ira\s+\w+\s*(>=|<=|==|!= |<|>|)\s*\d+\s*\{/,
        'elseStatement': /tons\s*\{/,
        'returnStatement': /devuelto\s+.+/,
        'printStatement': /mostralo\(("(?:[^"\\]|\\.)*")\)/,
        'closeBlock': /\}/,
        'assignment': /\w+\s*=\s*.+/
    };

    let openBlocks = 0;
    let wasIra = false;
    const declaredFunctions = new Set();

    for (let i = 0; i < code.length; i++) {
        let line = code[i].trim();

        if (!line) continue;

        let validLine = false;
        for (let key in tokens) {
            const match = line.match(tokens[key]);
            if (match) {
                validLine = true;

                if (key === 'functionDeclaration') {
                    const functionName = match[1];
                    if (declaredFunctions.has(functionName)) {
                        alert(`ey vos hija  tenes un Error en línea ${i + 1}: La función "${functionName}" ya ha sido declarada hija `);
                        return;
                    }
                    declaredFunctions.add(functionName);

                    openBlocks++;
                } else if (key === 'forLoop' || key === 'conditional') {
                    openBlocks++;
                    if (key === 'conditional') wasIra = true;
                } else if (key === 'elseStatement') {
                    if (wasIra) {
                        wasIra = false;
                    } else {
                        openBlocks++;
                    }
                } else if (key === 'closeBlock') {
                    openBlocks--;
                    if (openBlocks < 0) {
                        alert(`ey vos hija  tenes un Error en línea${i + 1}: Bloque de cierre innecesario.`);
                        return;
                    }
                }

                break;
            }
        }

        if (!validLine) {
            alert(`ey vos hija  tenes un Error en línea ${i + 1}: "${line}"`);
            return;
        }
    }

    if (openBlocks !== 0) {
        alert("ey vos hija  tenes un error: Falta cerrar uno o más bloques.");
        return;
    }

    if (wasIra) {
        alert("ey vos hija  tenes un error: Falta el bloque 'tons' después de un bloque 'ira'.");
        return;
    }

    alert('simon hija Código válido');
}
document.getElementById('codeInput').oninput = function() {
    rows();
}

// Contador de líneas en el HTML
const rows = () => {
    const code = document.getElementById('codeInput').value.split('\n');
    const rowContainer = document.getElementById('rowCode');
    rowContainer.innerHTML = '';

    code.forEach((line, index) => {
        const p = document.createElement('p');
        p.textContent = index + 1;
        rowContainer.appendChild(p);
    });
}
