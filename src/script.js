class JustQuiz {
  constructor( selector, options ) {
    this.selector = selector;
    const defaultOptions = {
      fadeTime: 300,
      stepperBtnClass: null,
    };
    Object.defineProperties( defaultOptions, {
      _startPage: {
        get: function() {
          return 1;
        }
      },
    } );
    this.options = Object.assign( defaultOptions, options );
    this.quiz = document.querySelector( selector );
    if ( this.quiz ) {
      this.stepsNode = this.quiz.querySelector( '.just-quiz__steps' );
      this.controlsNode = this.quiz.querySelector( '.just-quiz__controls' );
      this.screenNodes = this.quiz.querySelectorAll( '[data-quiz-screen]' );
      this.quizScreenCount = this.screenNodes.length;
    }

    this.initQuiz();
  }

  initScreens() {
    if ( this.quizScreenCount > 1 ) {
      this.screenNodes.forEach( ( screen, i ) => {
        screen.dataset.quizScreen = i + 1;
        screen.style.setProperty( '--just-quiz-fade-time', `${this.options.fadeTime / 1000}s` );
      } );
      return true;
    }
    return false;
  }

  initSteps() {
    if ( this.stepsNode && ( this.quizScreenCount > 1 ) ) {
      const markup = `<span data-quiz-step="current">1</span> / <span data-quiz-step="all">${this.quizScreenCount}</span>`;
      this.stepsNode.insertAdjacentHTML( 'afterbegin', markup );
    }
  }

  initControls() {
    if ( this.controlsNode && ( this.quizScreenCount > 1 ) ) {
      const markup = `<button class="just-quiz__stepper just-quiz__stepper--prev" type="button" data-quiz-stepper="prev">Назад</button>
      <button class="just-quiz__stepper just-quiz__stepper--next" type="button" data-quiz-stepper="next">Далее</button>
      <button class="just-quiz__stepper just-quiz__stepper--submit" type="submit">Отправить</button>`;
      this.controlsNode.insertAdjacentHTML( 'afterbegin', markup );
      if ( this.options.stepperBtnClass ) {
        Array.from( this.controlsNode.children ).forEach( btn => btn.classList.add( this.options.stepperBtnClass ) );
      }
      const prevNode = this.controlsNode.querySelector( '[data-quiz-stepper="prev"]' );
      const nextNode = this.controlsNode.querySelector( '[data-quiz-stepper="next"]' );

      nextNode.addEventListener( 'click', () => this.incrementPage() );
      prevNode.addEventListener( 'click', () => this.decrementPage() );
    }
  }

  incrementPage() {
    let currentPageNumber = Number( this.quiz.dataset.quizPage ) + 1;
    this.quiz.dataset.quizPage = currentPageNumber;
    this.setScreen( currentPageNumber );
  }

  decrementPage() {
    let currentPageNumber = Number( this.quiz.dataset.quizPage ) - 1;
    this.quiz.dataset.quizPage = currentPageNumber;
    this.setScreen( currentPageNumber );
  }

  setScreen( currentPage ) {
    if ( currentPage < 1 || currentPage > this.quizScreenCount ) {
      return;
    }
    this.updateStepper( currentPage );
    this.updateQuizStateClasses( currentPage );
    this.showCurrentScreen();
  }

  updateStepper( pageNumber ) {
    this.quiz.dataset.quizPage = pageNumber;
    if ( this.stepsNode ) {
      this.stepsNode.querySelector( '[data-quiz-step="current"]' ).textContent = pageNumber;
    }
  }

  updateQuizStateClasses( pageNumber ) {
    if ( pageNumber === 1 ) {
      this.quiz.classList.remove( 'is-midterm-survey', 'is-last-quiz-step' );
      this.quiz.classList.add( 'is-first-quiz-step' );
    } else if ( pageNumber === this.quizScreenCount ) {
      this.quiz.classList.remove( 'is-first-quiz-step', 'is-midterm-survey' );
      this.quiz.classList.add( 'is-last-quiz-step' );
    } else {
      this.quiz.classList.remove( 'is-first-quiz-step', 'is-last-quiz-step' );
      this.quiz.classList.add( 'is-midterm-survey' );
    }
  }

  showCurrentScreen() {
    const currentStep = this.quiz.dataset.quizPage;
    const currentScreen = Array.from( this.screenNodes ).find( screen => screen.dataset.quizScreen === currentStep );
    this.screenNodes.forEach( screen => screen.classList.remove( 'just-quiz__screen--current' ) );
    currentScreen.classList.add( 'just-quiz__screen--current' );
  }

  initQuiz() {
    if ( !this.quiz ) {
      return;
    }

    if ( this.initScreens() ) {
      this.initSteps();
      this.initControls();
      this.setScreen( this.options._startPage );
    }
  }
}
