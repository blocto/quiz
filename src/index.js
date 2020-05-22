import React, { PureComponent } from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import shuffle from 'lodash/shuffle';
import bowser from 'bowser';

import SVG from './components/SVG';
import Button from './components/Button';
import close from '../assets/ic-browser-close.svg';
import wrong from '../assets/ic-wrong-answer.svg';
import mission from '../assets/ic-mission-large.svg';
import { clickableStyle } from './styles';
import messages from './messages';
import {
  BLOCTO_BLACK,
  BLOCTO_GRAY,
  BLOCTO_BLUE,
} from './colors';

const isAndroid = Boolean(bowser.android);
const heightBreak = 600;

const Wrapper = styled.div`
  opacity: ${props => (props.isActive ? 1 : 0)};
  transform: scale(${props => (props.isActive ? 1 : 0.8)});
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #fdfdfd;
  color: #333333;
  pointer-events: ${props => (props.isActive ? 'inherit' : 'none')};
  transition: .3s opacity, .3s transform;
`;

const Close = styled.div`
  ${clickableStyle};

  position: absolute;
  width: 32px;
  height: 32px;
  top: 15px;
  right: 15px;
  border-radius: 16px;
  backdrop-filter: blur(1px);
  background-color: rgba(51, 51, 51, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  opacity: ${props => (props.isActive ? 1 : 0)};
  pointer-events: ${props => (props.isActive ? 'inherit' : 'none')};
  transition: .3s opacity;
`;

/* eslint-disable */
const QuestionWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: ${props => (props.isCurrent ? 0 : (props.isPast ? -100 : 100))}%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.centered ? 'center' : 'inherit'};
  transition: .3s left ease-in-out;
`;
/* eslint-enable */

const Title = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.6;
  color: #141414;
  margin-top: 20px;
  margin-bottom: 32px;
  text-align: ${props => (props.centered ? 'center' : 'inherit')};

  @media (max-height: ${heightBreak}px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  margin-top: 4px;
  color: #333333;
`;

const Option = styled.div`
  padding: 16px 20px;
  height: 60px;
  border-radius: 8px;
  border:
    solid
    ${props => (props.isActive ? 2 : 1)}px
    ${props => (props.isActive ? BLOCTO_BLUE : '#efefef')};
  background-color: ${props => (props.isActive ? '#e8edf9' : '#f5f5f5')};
  margin-bottom: 16px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: .15s border-color, .15s background-color;

  @media (max-height: ${heightBreak}px) {
    padding: 14px 16px;
    height: 50px;
    font-size: 14px;
  }
`;

const Answer = styled.div`
  flex: 1;
`;

const MarkerSVG = styled(SVG)`
  margin-right: -4px;
`;

const QuestButton = styled(Button)`
  position: absolute;
  width: calc(100% - 32px);
  height: 50px;
  border: none;
  border-radius: 8px;
  background-color: ${BLOCTO_BLACK};
  color: white;
  left: 16px;
  bottom: ${isAndroid ? 136 : 82}px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: ${props => (props.isActive ? 1 : 0)};
  transition: .3s opacity;
  pointer-events: ${props => (props.isActive ? 'inherit' : 'none')};
  text-transform: uppercase;

  @media (max-height: ${heightBreak}px) {
    bottom: ${isAndroid ? 116 : 62}px;
    height: 46px;
  }
`;

const Bar = styled.div`
  position: absolute;
  margin: 12px auto;
  width: 76px;
  height: 4px;
  bottom: ${isAndroid ? 74 : 20}px;
  left: 50%;
  transform: translate(-50%);
  border-radius: 2px;
  backdrop-filter: blur(3px);
  background-color: rgba(239, 239, 239, 0.8);
  opacity: ${props => (props.isActive ? 1 : 0)};
  transition: .3s opacity;

  @media (max-height: ${heightBreak}px) {
    bottom: ${isAndroid ? 66 : 12}px;
  }
`;

const Indicator = styled.div`
  position: absolute;
  width: ${props => 76.0 / (props.pages)}px;
  left: ${props => (100.0 * props.page) / props.pages}%;
  height: 4px;
  border-radius: 2px;
  backdrop-filter: blur(1px);
  background-color: ${BLOCTO_GRAY};
  transition: .2s left ease-in-out;
`;

const MissionSVG = styled(SVG)`
  path {
    fill: url(#lock-gradient);
  }
`;

class ArticleQuiz extends PureComponent {
  props: {
    intl: any,
    questions: any,
    isActive: Boolean,
    onClose: Function,
    onSuccess: Function,
  }

  constructor(props) {
    super(props);

    const { questions } = props;
    const shuffledAnswers = this.handleShuffle(questions);

    this.state = {
      index: 0,
      shuffledAnswers,
      selected: new Array(questions.size),
      hasMarker: new Array(questions.size).map(() => false),
    };
  }

  handleShuffle = (questions) => {
    const shuffledAnswers = questions.map(question => shuffle(
      [
        question.getIn(['fields', 'correctAnswer']),
        ...question.getIn(['fields', 'otherAnswers']).toJS(),
      ]
    )).toJS();

    return shuffledAnswers;
  }

  handleReset = () => {
    const { questions } = this.props;
    const shuffledAnswers = this.handleShuffle(questions);

    this.setState({
      index: 0,
      shuffledAnswers,
      selected: new Array(questions.size),
      hasMarker: new Array(questions.size).map(() => false),
    });
  }

  handleClose = () => {
    this.handleReset();
    this.props.onClose();
  }

  handleAnswerClick = (answer) => {
    const { index, selected, hasMarker } = this.state;
    const newSelected = [...selected];
    newSelected[index] = answer;
    const newHasMarker = [...hasMarker];
    newHasMarker[index] = false;

    // should go to next unanswered or hasMarker
    const newIndex = Math.max(index, newSelected.findIndex((item, i) => !item || newHasMarker[i]));

    this.setState({
      index: newIndex,
      selected: newSelected,
      hasMarker: newHasMarker,
    });
  }

  handleSubmit = () => {
    const { questions } = this.props;
    const { selected } = this.state;

    const hasMarker = selected.map((item, index) => item !== questions.getIn([index, 'fields', 'correctAnswer']));
    const newIndex = hasMarker.findIndex(item => item);

    if (newIndex === -1) {
      // all correct
      this.setState({
        index: questions.size,
      });
    } else {
      this.setState({
        index: newIndex,
        hasMarker,
      });
    }
  }

  handleFailure = () => {
    this.handleClose();
  }

  handleConfirmQuit = () => {
    const { intl } = this.props;

    if (confirm(intl.formatMessage(messages.confirmQuitQuiz))) {
      this.handleClose();
    }
  }

  render() {
    const { questions, isActive, onSuccess } = this.props;
    const { index, shuffledAnswers, selected, hasMarker } = this.state;

    return (
      <Wrapper isActive={isActive}>
        {questions.map((question, questionIndex) => (
          <QuestionWrapper
            isCurrent={questionIndex === index}
            isPast={questionIndex < index}
          >
            <Title>
              {question.getIn(['fields', 'question'])}

              {question.getIn(['fields', 'description'], null) && <Subtitle>
                {question.getIn(['fields', 'description'], null)}
              </Subtitle>}
            </Title>

            {shuffledAnswers[questionIndex].map(answer => (
              <Option
                isActive={answer === selected[questionIndex]}
                key={answer}
                onClick={() => this.handleAnswerClick(answer)}
              >
                <Answer>{answer}</Answer>
                {answer === selected[questionIndex] && hasMarker[questionIndex] && <MarkerSVG src={wrong} />}
              </Option>
            ))}
          </QuestionWrapper>
        ))}

        <QuestionWrapper
          centered
          isCurrent={index === questions.size}
        >
          <MissionSVG src={mission} />

          <Title centered>
            <FormattedMessage {...messages.congrats} />

            <Subtitle>
              <FormattedHTMLMessage {...messages.congratsDescription} />
            </Subtitle>
          </Title>
        </QuestionWrapper>

        <QuestButton
          isActive={selected.findIndex((item, i) => !item || hasMarker[i]) === -1}
          onClick={index === questions.size ? onSuccess : this.handleSubmit}
        >
          <FormattedMessage {...(index === questions.size ? messages.claimReward : messages.submit)} />
        </QuestButton>

        <Bar
          isActive={questions.size !== index}
        >
          <Indicator
            page={Math.min(index, questions.size - 1)}
            pages={questions.size}
          />
        </Bar>

        <Close
          onClick={this.handleConfirmQuit}
          isActive={questions.size !== index}
        >
          <SVG src={close} />
        </Close>
      </Wrapper>
    );
  }
}

export default injectIntl(ArticleQuiz);
