import styled, { css, keyframes } from "styled-components/macro";
import colors from "../../utils/colors";

const spin = keyframes`
 from{ 
     transform: rotate(0deg); }
 to { 
 transform: rotate(360deg); }
`;

const fadeIn = keyframes`
from {
    opacity: 0;

} to {
    opacity: 1;
}
`;

const Button = styled.button`
  appearance: none;
  background-color: ${colors.blue};
  border: none;
  border-radius: 4px;
  color: ${colors.white};
  font-size: 14px;
  min-height: 40px;
  line-height: 20px;
  padding: 8px 24px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  white-space: nowrap;

  &:hover {
    background-color: ${colors.blueHover};
  }

  ${(props) =>
    props.square &&
    css`
      height: 40px;
      width: 40px;
      min-width: 40px;
      padding: 8px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      outline: none;
      margin: 0;
      background-color: ${colors.lightGray};
      background-size: ${(props) => props.backgroundSize || "20px"};
      background-repeat: no-repeat;
      background-position: ${(props) => props.backgroundPosition || "center"};
      background-image: ${(props) =>
        props.icon ? `url(${props.icon})` : "url(/img/kebab-menu-icon.svg)"};
      transition: background-color 0.2s;

      &:hover {
        background-color: ${colors.grayVariant};
      }
    `};

  ${(props) =>
    (props.disabled || props.status === "disabled") &&
    css`
      background-color: ${colors.lightGray};
      color: ${colors.darkGray};
      cursor: not-allowed;

      &:hover {
        background-color: ${colors.lightGray};
      }
    `}

  ${(props) =>
    (props.status === "loading" ||
      props.status === "success" ||
      props.status === "error" ||
      props.loading ||
      props.success ||
      props.error) &&
    css`
      pointer-events: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0px;
      overflow: hidden;
      max-height: 40px;
      max-width: 128px;
      color: transparent;
    `}

        ${(props) =>
    (props.status === "loading" || props.loading) &&
    css`
      &::before {
        content: "";
        display: block;
        border: 2px solid ${colors.white};
        border-top: 2px solid ${colors.gray};
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: ${spin} 2s linear infinite, ${fadeIn} 1s;
      }
    `}

        ${(props) =>
    (props.status === "success" || props.success) &&
    css`
      background-color: ${colors.green};
      &:hover {
        background-color: ${colors.greenVariant};
      }

      &::before {
        display: block;
        content: "Success!";
        font-size: 14px;
        color: ${colors.white};
        width: 100%;
      }
    `}

        ${(props) =>
    (props.status === "error" || props.error) &&
    css`
      background-color: ${colors.red};
      &:hover {
        background-color: ${colors.redVariant};
      }

      &::before {
        display: block;
        content: "Error";
        font-size: 14px;
        color: ${colors.white};
        width: 100%;
      }
    `}

    &:focus {
    outline: none;
  }
`;

export default Button;
