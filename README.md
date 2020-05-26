# Quiz Component ![npm](https://img.shields.io/npm/v/@portto/quiz/latest)
Quiz component for blockchain guide

## Setup

Add `@portto/quiz` to your react project through `yarn` or `npm`

```sh
# Install through yarn, recommended
yarn add @portto/quiz

# or install through npm
npm install @portto/quiz --save
```

Then in your project you can use it like

```javascript
import React from 'react';
import Quiz from '@portto/quiz';
import { fromJS } from 'immutable';

const SampleReward = () => {
  const [isQuizActive, setQuizActive] = useState(false)

  const stopQuiz = () => {
    setQuizActive(false);
  };
  const completeQuiz = () => {
    // Send reward
    setQuizActive(false);
  };

  return (
    <div>
      <Quiz
        isActive={isQuizActive} // Boolean, should the component be shown or not
        questions={fromJS([ // Immutable List, questions and answers
          {
            fields: {
              question: 'Which stable coin has the largest market share?',
              correctAnswer: 'USDT',
              otherAnswers: [
                'DAI',
                'USDC',
                'TUSD'
              ]
            }
          },
          ...
        ])}
        onClose={stopQuiz} // Function to be executed when user fails or closes the test
        onSuccess={completeQuiz} // Function to be executed when user completes the test (e.g. Send reward)
        messages={{ // Strings, translations for messages shown in the component
          confirmQuitQuiz: 'Are you sure you want to quit?',
          claimReward: 'Claim Reward',
          congrats: 'Congratulations',
          congratsDescription: 'This puny quiz is no match for you.<br />Claim your rewards now.',
          submit: 'Submit',
        }}
      />
    </div>
  );
}

export default SampleReward;
```
