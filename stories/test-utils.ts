import type { JBInputWebComponent } from 'jb-input';
import { expect } from 'storybook/test';

export function getInput(canvasElement: HTMLElement, index = 0) {
  const input = canvasElement.querySelectorAll<JBInputWebComponent>('jb-input')[index];
  expect(input).toBeTruthy();
  expect(input!.shadowRoot).toBeTruthy();
  return input!;
}

export function getNativeInput(input: JBInputWebComponent) {
  const nativeInput = input.shadowRoot?.querySelector<HTMLInputElement>('input');
  expect(nativeInput).toBeTruthy();
  return nativeInput!;
}

export function getMessageText(input: JBInputWebComponent) {
  return input.shadowRoot?.querySelector<HTMLElement>('.message-box')?.textContent ?? '';
}

export function getInputBox(input: JBInputWebComponent) {
  const inputBox = input.shadowRoot?.querySelector<HTMLDivElement>('.input-box');
  expect(inputBox).toBeTruthy();
  return inputBox!;
}
