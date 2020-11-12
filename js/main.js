
//  C   O   N   D   I   T   I   O   N   S

const text = `Товарищи! сложившаяся структура
 организации способствует подготовки
  и реализации систем массового участия. Равным образом сложившаяся структура организации требуют от нас анализа модели развития. Задача организации, в особенности же рамки и место обучения кадров представляет собой интересный эксперимент проверки модели развития. Равным образом постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки систем массового участия. Идейные соображения высшего порядка, а также начало повседневной работы по формированию позиции позволяет оценить значение форм развития. Задача организации, в особенности же дальнейшее развитие различных форм деятельности позволяет оценить значение новых предложений.
Таким образом начало повседневной работы по формированию позиции позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям. Повседневная практика показывает, что новая модель организационной деятельности играет важную роль в формировании систем массового участия. Идейные соображения высшего порядка, а также рамки и место обучения кадров позволяет выполнять важные задания по разработке позиций, занимаемых участниками в отношении поставленных задач. Идейные соображения высшего порядка, а также рамки и место обучения кадров позволяет выполнять важные задания по разработке форм развития. Равным образом постоянный количественный рост и сфера нашей активности способствует подготовки и реализации существенных финансовых и административных условий.`;

const inputElement = document.querySelector('#input')
const textExampleElement = document.querySelector('#textExample')


//  V   A   R   I   A   B   L   E   S

const lines = getLines(text)

let letterId = 1

let startMoment = null
let started = false

let letterCounter = 0 //total number of keystrokes = initial counter value
let letterCounter_error = 0 //how many incorrect keystrokes were there in total

init();

autoFocus();



//  F   U   N   C   T   I   O   N   S

// autofocus function
function autoFocus() {
    let bodyElement = document.querySelector('body');
    
    bodyElement.addEventListener('keydown', function (event){
        inputElement.focus()
    })
}

//event handler function
function init() {

    update()

    inputElement.focus()
    
    inputElement.addEventListener('keydown', function (event) {
        const currentLineNumber = getCurrentLineNumber()
        const element = document.querySelector(`[data-key="${event.key.toLowerCase()}"]`)        
        const code = document.querySelector(`[data-code="${event.code}"] `)

        // pressing "shift" does not count as entering a character and increases the counter
        if (event.key !== 'Shift' && event.key !== 'CapsLock') {
            letterCounter++
        }
        
        if (!started) {
            started = true
            startMoment = Date.now()
            //Date is an object class in JS that is responsible for all work with data since January 1, 1970.
            //fixing the start time of typing
        }
        console.log(startMoment);
        console.log(Date.now());

        const currentLetter = getCurrentLetter()


        if (event.key.startsWith('F') && event.key.length > 1) {
            return
        }

        //highlight the key corresponding to the one you pressed on the keyboard
        // we process Caps Lock separately
        if (element && !element.classList.contains('hint')) {
            element.classList.add('hint')
        } else {
            if (element) {
                element.classList.remove('hint')
            }
        }

        if (code && !code.classList.contains('hint')) {
            code.classList.add('hint')
        } else {
            if (code) {
                code.classList.remove('hint')
            }
        }
        

        const isKey = event.key === currentLetter.original
        //if the pressed character matches the expected one
        const isEnter = event.key === 'Enter' && currentLetter.original === '\n'
        //if the pressed 'Enter' character matches the expected carriage shift to a new line

        if (isKey || isEnter) {
            letterId++
            update()
        }
        else {
            event.preventDefault()// to cancel the default handling of the event
            
            if (event.key !== 'Shift' && event.key !== 'CapsLock') {
                letterCounter_error++
                
                for (const line of lines) {
                    for (const letter of line) {
                        if (letter.id === currentLetter.id) {
                            letter.success = false
                        }
                    }
                }
            }
            update()
        }
        
        if (currentLineNumber !== getCurrentLineNumber()) {
            inputElement.value = ' '
            event.preventDefault()

            const time = Date.now() - startMoment
            
            // output how many characters per minute are printed
            document.querySelector('#wordSpeed').textContent = Math.round(60000 * letterCounter / time)
            //output the percentage of character errors
            document.querySelector('#errorPercent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%'
            
            started = false
            letterCounter = 0
            letterCounter_error = 0
        }
    })

    
    inputElement.addEventListener('keyup', function (event) {
        const element = document.querySelector(`[data-key="${event.key.toLowerCase()}"]`)
        const code = document.querySelector(`[data-code="${event.code}"] `)

        if (event.key.toLowerCase() !== 'capslock') {
            if (element) {
                element.classList.remove('hint')
            }
            if(code) {
                code.classList.remove('hint')
            }
        }
    })
}

//creates a data structure from arrays
function getLines(text) {
    const lines = []
    let line = []
    let idCounter = 0

    for (const originalLetter of text) {
        idCounter++
        let letter = originalLetter

        if (letter ===' ') {
            letter = '_'
        }
        if (letter === '\n') {
            letter = '¶\n'
        }

        line.push ({
            id: idCounter,
            label: letter,
            original: originalLetter,
            success: true
        })

        if (line.length >= 70 || letter === '¶\n') {
            lines.push(line)
            line = []
        }
     
    }
    if (line.length > 0) {
        lines.push(line)
    }
    
    return lines
}

//creates the div-element structure of the virtual Dom
function lineToHtml(line) {

    const divElement = document.createElement('div')
    divElement.classList.add('line')

    for (const letter of line) {
        const spanElement = document.createElement('span')
        spanElement.textContent = letter.label
        divElement.append(spanElement)
       
        if (letterId > letter.id) {
            spanElement.classList.add('done')
            
        }
        else if (!letter.success) {
            spanElement.classList.add('hint')
        }
    }
   return divElement
}

// create a loop to determine the string where the selected character is located
function getCurrentLineNumber() {
    for (var i = 0; i < lines.length; i++) {
        for (letter of lines[i]) {
            if (letterId === letter.id) {
                return i
            }
        }
    }
}

// updating the three displayed actual lines of a text element
function update() {
    const currentLineNumber = getCurrentLineNumber()
    textExampleElement.innerHTML = ''

    for (var i = 0; i < lines.length; i++) {
        const html = lineToHtml(lines[i]);
        textExampleElement.append(html)

        if (i < currentLineNumber || i > currentLineNumber + 2) {
            html.classList.add('hidden')
        }
    }
}

// returns the value of the selected character
function getCurrentLetter() {
    for (const line of lines) {
        for (const letter of line) {
            if (letterId === letter.id) {
                return letter
            }
        }
    }
}
