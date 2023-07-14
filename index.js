const homePage = document.querySelector('.app-home');
const addNewWordPage = document.querySelector('.app-add-new-word');
const addNewWordLevelPage = document.querySelector('.app-add-new-word-level')
const learnPage = document.querySelector('.app-learn')

const formatDate = (date) => {
    return date.toLocaleDateString('en-GB')
}

var word_levels = [];   //[word_level]
if(localStorage.getItem("word_levels")) {
  word_levels = JSON.parse(localStorage.getItem("word_levels"));
} 

var word_learn = []
var numberCurrent = 0;
var valueRepeat = -1
var word_repeat = []
var feature = ''


window.onload = () => {
    console.log('hello')

    // render list word_levels
    renderListWordLevel()

    //------------- Handle Homepage ------------
    document.querySelector('.app-feature-learn-now').addEventListener('click', () => {
        homePage.classList.add('hide')
        learnPage.classList.remove('hide')
        feature  = 'learn-now'
        document.querySelector(".app-learn-title").innerHTML = 'Learn Now'

        numberCurrent = 0
        valueRepeat = -1
        word_repeat = []
        word_learn = [] // {word, pronunciation, word_level, example, explain}[]
        if(localStorage.getItem(formatDate(new Date()))) {
            let words = JSON.parse(localStorage.getItem(formatDate(new Date())))
            //shuffled
            word_learn = words?.sort(() => Math.random() - 0.5)
        } 
        console.log('word_learn', word_learn)
        renderTagWord()
        renderTimeRepeat()
    })
    document.querySelector('.app-feature-learn-word-level').addEventListener('click', () => {
        homePage.classList.add('hide')
        learnPage.classList.remove('hide')
        feature = 'learn-word-level'
        document.querySelector(".app-learn-title").innerHTML = 'Learn Word-level'

        document.querySelector(".app-choose-word-level").classList.remove('hide')
    })
    document.querySelector('.app-feature-learn-all').addEventListener('click', () => {
        homePage.classList.add('hide')
        learnPage.classList.remove('hide')
        feature = 'learn-all'
        document.querySelector(".app-learn-title").innerHTML = 'Learn All'

        numberCurrent = 0
        valueRepeat = -1
        word_learn = [] // {word, pronunciation, word_level, example, explain}[]
        let a = []
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i)
            if(key != 'word_levels') {
                if(localStorage.getItem(key)) {
                    let words = JSON.parse(localStorage.getItem(key))
                    a = a.concat(words)
                }
            }
        }
        a = getUniqueWords(a)
        //shuffled
        word_learn = a?.sort(() => Math.random() - 0.5)
        console.log('learn all shuffled', word_learn)

        renderTagWord()
        renderTimeRepeat()
    })
    document.querySelector('.app-feature-add-new-word').addEventListener('click', () => {
        homePage.classList.add('hide')
        addNewWordPage.classList.remove('hide')
        feature = 'add-new-word'
    })
    document.querySelector('.app-feature-add-word-level').addEventListener('click', () => {
        homePage.classList.add('hide')
        addNewWordLevelPage.classList.remove('hide')
        feature = 'add-word-level'
    })
    document.querySelector('.app-feature-practice-memory').addEventListener('click', () => {
        homePage.classList.add('hide')
        learnPage.classList.remove('hide')
        feature = 'practice-memory'
        document.querySelector(".app-learn-title").innerHTML = 'Practice Memory'

        document.querySelector('.tag-learn').classList.add('hide')
        document.querySelector('.tag-practice-memory').classList.remove('hide')

        numberCurrent = 0
        valueRepeat = -1
        word_learn = [] // {word, pronunciation, word_level, example, explain}[]
        let a = []
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i)
            if(key != 'word_levels') {
                if(localStorage.getItem(key)) {
                    let words = JSON.parse(localStorage.getItem(key))
                    a = a.concat(words)
                }
            }
        }
        a = getUniqueWords(a)
        //shuffled
        word_learn = a?.sort(() => Math.random() - 0.5)

        renderTagWord()
        renderTimeRepeat()
    })

    //-------------- Handle Add new word-level page ------------
    document.querySelector('.app-add-new-word-level button').addEventListener('click', () => {
        let value = document.querySelector('#add-word-level-name').value
        if(value) {
            word_levels.push(value)
            localStorage.setItem('word_levels', JSON.stringify(word_levels))
            openNotification('Done')

            // render list word_levels
            renderListWordLevel()
        } else {
            openNotification('Fault', 'error')
        }
    })

    //------------- Handle Add new word page ------------
    document.querySelector('.app-add-new-word button').addEventListener('click', () => {
        let word_name = document.querySelector('#add-word-name')
        let word_pronunciation = document.querySelector('#add-word-pronunciation')
        let word_level = document.querySelector('#add-word-word-level')
        let word_example = document.querySelector('#add-word-example')
        let word_explain = document.querySelector('#add-word-explain')
        if(word_name.value && word_pronunciation.value && word_level.value && word_example.value && word_explain.value) {
            let obj = {
                word : word_name.value, 
                pronunciation : word_pronunciation.value, 
                word_level : word_level.value, 
                example: word_example.value,
                explain: word_explain.value
            }


            let word_todays = [] // {word, pronunciation, word_level, example, explain}[]
            if(localStorage.getItem(formatDate(new Date()))) {
                word_todays = JSON.parse(localStorage.getItem(formatDate(new Date())));
            } 

            word_todays.push(obj)
            word_todays = getUniqueWords(word_todays)
            localStorage.setItem(formatDate(new Date()), JSON.stringify(word_todays))
            openNotification('Done')
            word_name.value = ''
            word_pronunciation.value = ''
            word_level.value = ''
            word_example.value = ''
            word_explain.value = ''
        } else {
            openNotification('Fault', 'error')
        }
    })

    //------------- Handle Learn page ------------
    // handle click see detail tag
    document.querySelector('.app-learn-see-detail').addEventListener('click', () => {
        // animation
        document.querySelector('.tag-front').style.display = 'none'
        document.querySelector('.tag-front').classList.remove('active')
        document.querySelector('.tag-front').classList.remove('active-next')
        document.querySelector('.tag-front').classList.remove('active-back')
        document.querySelector('.tag-back').classList.add('active')
        document.querySelector('.app-learn-see-detail').style.display = 'none'
        document.querySelector('.app-learn-back').style.display = 'flex'
    })
    // handle click back to see new word
    document.querySelector('.app-learn-back').addEventListener('click', () => {
        // animation
        document.querySelector('.tag-front').classList.add('active')
        document.querySelector('.tag-front').classList.remove('active-next')
        document.querySelector('.tag-front').classList.remove('active-back')
        document.querySelector('.tag-back').classList.remove('active')
        document.querySelector('.app-learn-see-detail').style.display = 'flex'
        document.querySelector('.app-learn-back').style.display = 'none'
    })
    // handle change time repeat
    document.querySelectorAll('.option-time-repeat').forEach((option, index) => {
        option.addEventListener('click', () => {
            valueRepeat = option.getAttribute('value')

            renderTimeRepeat()
        })
    })
    // handle see next word
    document.querySelector('.next-tag').addEventListener('click', () => {
        if(valueRepeat == -1) {
            openNotification("You don't choose time to repeat", 'error')
            return
        } {
            // handle animation
            document.querySelector('.tag-back').classList.remove('active')
            document.querySelector('.tag-front').style.display = 'flex'
            document.querySelector('.tag-front').classList.remove('active-back')
            document.querySelector('.tag-front').classList.add('active-next')
            document.querySelector('.tag-front').style.webkitAnimation = 'none'
            setTimeout(function() {
                document.querySelector('.tag-front').style.webkitAnimation = '';
            }, 10);
            document.querySelector('.app-learn-see-detail').style.display = 'flex'
            document.querySelector('.app-learn-back').style.display = 'none'
    
            // handle action
            
            let obj = word_learn[numberCurrent]
            // re-learn
            if(valueRepeat == 0 && feature == 'learn-now') {
                word_repeat.push(obj)
            } else {
                // save local storage
                let newDate = new Date(new Date().getTime() + (valueRepeat * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB');
                console.log(newDate)
                let word_days = [] // {word, pronunciation, word_level, example, explain}[]
                if(localStorage.getItem(newDate)) {
                    word_days = JSON.parse(localStorage.getItem(newDate));
                } 
                
                word_days.push(obj)
                word_days = getUniqueWords(word_days)
                localStorage.setItem(newDate, JSON.stringify(word_days))
            }
            
            if(numberCurrent + 1 < word_learn.length) {
                numberCurrent = numberCurrent + 1
                valueRepeat = -1
                
                renderTagWord()
                renderTimeRepeat()
                
            } else { // done
                document.querySelector('.app-learn-content').classList.add('hide')
                document.querySelector('.time-repeat').classList.add('hide')
                document.querySelector('.app-learn-content-not-word').classList.add('hide')
                document.querySelector('.app-learn-content-done').classList.remove('hide')

                if(feature == 'learn-now') {
                    word_repeat = getUniqueWords(word_repeat)
                    localStorage.setItem(formatDate(new Date()), JSON.stringify(word_repeat))
                }
            }
        }
    })
    // handle see back word
    document.querySelector('.back-tag').addEventListener('click', () => {
        if(numberCurrent != 0) { // back
            // handle animation
            document.querySelector('.tag-back').classList.remove('active')
            document.querySelector('.tag-front').style.display = 'flex'
            document.querySelector('.tag-front').classList.remove('active-next')
            document.querySelector('.tag-front').classList.add('active-back')
            document.querySelector('.tag-front').style.webkitAnimation = 'none'
            setTimeout(function() {
                document.querySelector('.tag-front').style.webkitAnimation = '';
            }, 10);
            document.querySelector('.app-learn-see-detail').style.display = 'flex'
            document.querySelector('.app-learn-back').style.display = 'none'
    
            // handle action
            numberCurrent = numberCurrent - 1
            valueRepeat = -1
            
            renderTagWord()
            renderTimeRepeat()

        } else {
            openNotification("Can't go back", 'error')
        }
        
    })


    // --------------- Handle Choose Word-level --------------------
    document.querySelectorAll(".choose-word-level-item").forEach(word_level_element => {
        word_level_element.addEventListener('click', () => {
            document.querySelector(".app-choose-word-level").classList.add('hide')

            let word_level = word_level_element.getAttribute('value')
            console.log("word_level", word_level)

            numberCurrent = 0
            valueRepeat = -1
            word_learn = [] // {word, pronunciation, word_level, example, explain}[]
            let a = [] // all-word
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i)
                if(key != 'word_levels') {
                    if(localStorage.getItem(key)) {
                        let words = JSON.parse(localStorage.getItem(key))
                        a = a.concat(words)
                    }
                }
            }

            // filter word_level
            a = a.filter(word => {
                return word.word_level == word_level
            })

            a = getUniqueWords(a)
            console.log('word-level', word_level, a)
            //shuffled
            word_learn = a?.sort(() => Math.random() - 0.5)
            console.log('learn word-level shuffled', word_learn)

            renderTagWord()
            renderTimeRepeat()
        }) 
    })



    // --------------- Handle Practice memory --------------------
    document.querySelector('.tag-check').addEventListener('click', () => {
        let word = document.querySelector('.tag-input-word').value
        if( word_learn[numberCurrent].word.toLowerCase()  == word.toLowerCase() ) {
            openNotification('Exactly', 'success')
        } else {
            openNotification('Wrong', 'error')
        }
    })





    // -------------------handle back to home page ------------------
    document.querySelectorAll(".back-home").forEach((item) => {
        item.addEventListener('click', () => {
            feature = 'home'
            homePage.classList.remove('hide')
            addNewWordPage.classList.add('hide')
            addNewWordLevelPage.classList.add('hide')
            learnPage.classList.add('hide')
            document.querySelector(".app-choose-word-level").classList.add('hide')

            document.querySelector('.tag-back').classList.remove('active')
            document.querySelector('.tag-front').classList.remove('active')
            document.querySelector('.tag-front').classList.remove('active-next')
            document.querySelector('.tag-front').classList.remove('active-back')
            document.querySelector('.tag-front').style.display = 'flex'

            document.querySelector('.tag-learn').classList.remove('hide')
            document.querySelector('.tag-practice-memory').classList.add('hide')
        })
    })
}

const openNotification = (message="Done", status='success') => {
    document.querySelector('.notification').innerHTML = message;
    if(status === 'success') {
        document.querySelector('.notification').style.background = 'var(--color-green)'
    } else if(status === 'error') {
        document.querySelector('.notification').style.background = 'var(--color-red)'
    } else {
        document.querySelector('.notification').style.background = 'var(--color-border)'
    }
    document.querySelector('.notification').classList.add('active')
    document.querySelector('.notification').style.webkitAnimation = 'none'
    setTimeout(function() {
        document.querySelector('.notification').style.webkitAnimation = '';
    }, 10);
}

const renderListWordLevel = () => {
    let groupWordLevel = document.querySelector('#add-word-word-level')

    let options = word_levels.map(word_level => {
        return `
            <option value="${word_level}">${word_level}</option>
        `
    }).join('\n')
    groupWordLevel.innerHTML = options

    if(word_levels.length > 0) {
        let chooses = word_levels.map(word_level => {
            return `
                <div
                    style="width: 30%; float: left; padding: 0px calc(10% / 6) 20px ;text-align: center"
                >
                    <div style="background: var(--color-blue); padding: 20px 7px; border-radius: 6px; cursor: pointer"
                        class="choose-word-level-item"
                        value="${word_level}"
                    >
                        ${word_level}
                    </div>
                </div>
            `
        }).join('\n')
        document.querySelector('.choose-word-level').innerHTML = chooses
    } else {
        document.querySelector('.choose-word-level').innerHTML = '<div class="text-center">No word-level yet</div>'
    }
}

const renderTagWord = (number=numberCurrent, words=word_learn) => {
    if(words.length == 0) {
        document.querySelector('.app-learn-content').classList.add('hide')
        document.querySelector('.time-repeat').classList.add('hide')
        document.querySelector('.app-learn-content-done').classList.add('hide')
        document.querySelector('.app-learn-content-not-word').classList.remove('hide')
    } else {
        document.querySelector('.app-learn-content').classList.remove('hide')
        document.querySelector('.time-repeat').classList.remove('hide')
        document.querySelector('.app-learn-content-not-word').classList.add('hide')
        document.querySelector('.app-learn-content-done').classList.add('hide')

        if(words[number]) {
            document.querySelector('.app-learn-number').innerHTML = `Total Words: ${number + 1}/${words.length}`

            document.querySelector('.tag-word').innerHTML = words[number].word
            document.querySelector('.tag-pronunciation').innerHTML = words[number].pronunciation

            document.querySelector('.tag-detail-word').innerHTML = words[number].word
            document.querySelector('.tag-detail-pronunciation').innerHTML = words[number].pronunciation
            document.querySelector('.tag-detail-word-level').innerHTML = words[number].word_level
            document.querySelector('.tag-detail-example').innerHTML = words[number].example
            document.querySelector('.tag-detail-explain').innerHTML = words[number].explain || ''


            // feature practice memory 
            if(feature == 'practice-memory') {
                document.querySelector('.tag-explain').innerHTML = words[number].explain
                document.querySelector('.tag-word-level').innerHTML = words[number].word_level
                document.querySelector('.tag-input-word').value = ''
            }
        } 
    }
}

const renderTimeRepeat = () => {
    document.querySelectorAll('.option-time-repeat').forEach((option, index) => {
        if(option.getAttribute('value') == valueRepeat) {
            option.classList.add('active')
        } else {
            option.classList.remove('active')
        }
    })
}

function getUniqueWords(arr) {
    const uniqueWords = [];
    const wordSet = new Set();
  
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      const word = obj.word;
      if (!wordSet.has(word)) {
        wordSet.add(word);
        uniqueWords.push(obj);
      }
    }
  
    return uniqueWords;
}