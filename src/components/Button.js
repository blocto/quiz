import React from 'react';
import styled, { css } from 'styled-components';
import { clickableStyle, unclickableStyle } from '../styles';
import Spinner from './Spinner';
import {
  BLOCTO_BLACK,
  BLOCTO_GRAY,
  BLOCTO_BLUE,
  COLOR_WHITE,
} from '../colors';

const StyledButton = styled.button`
  position: relative;
  padding: 6px 20px;
  border-radius: 3px;
  user-select: none;
  font-size: 12px;
  outline: 0;
  color: ${COLOR_WHITE};
  background-color: ${BLOCTO_BLUE};

  &:after {
    background-color: ${BLOCTO_BLACK};
  }

  ${props => ((props.isDisabled || props.isProcessing) ? unclickableStyle : clickableStyle)}
`;

const ButtonText = styled.div`
  transition: .2s opacity;
  opacity: ${props => (props.isProcessing ? 0 : 1)};
`;

const StyledSpinner = styled(Spinner)`
  transition: .2s opacity;
  opacity: ${props => (props.isProcessing ? 1 : 0)};
`;

type ButtonProps = {
  className: String,
  onClick: Function,
  children: any,
  isDisabled: Boolean,
  isProcessing: Boolean,
};

const Button = ({ className, onClick, children, isDisabled, isProcessing }: ButtonProps) => (
  <StyledButton
    isDisabled={isDisabled}
    isProcessing={isProcessing}
    className={className}
    onClick={onClick}
  >
    <ButtonText isProcessing={isProcessing} >
      {children}
    </ButtonText>

    <StyledSpinner isProcessing={isProcessing} />
  </StyledButton>
);

export default Button;
