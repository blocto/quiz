// @flow
import React from 'react';
import styled from 'styled-components';
import InlineSVG from 'react-inlinesvg';

type SVGProps = {
  src?: string,
  onClick: () => void,
  className?: string,
};

export const StyledSVG = styled(InlineSVG)`
  display: flex;
  align-items: center;
`;

const SVG = ({ src, ...props }: SVGProps) => (src ? (
  <StyledSVG cacheGetRequests src={src} {...props} />
) : null);

export default SVG;
