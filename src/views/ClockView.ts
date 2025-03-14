import { ClockController } from '../controllers/ClockController';

export class ClockView {
  constructor(
    private controller: ClockController,
    private clockElement: HTMLElement,
    private editModeButton: HTMLElement,
    private increaseButton: HTMLElement
  ) {}
}
