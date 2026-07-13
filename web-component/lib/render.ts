export function renderHTML():string{
  return /* html */ `
    <div class="jb-input-web-component">
    <label for="input" part="label"></label>
    <div class="input-box" part="input-box">
        <div class="jb-input-start-section-wrapper">
            <slot name="start-section"></slot>
        </div>
        <input id="input" part="input" aria-describedby="message"/>
        <div class="jb-input-end-section-wrapper">
            <slot name="end-section"></slot>
        </div>
    </div>
    <div id="message" class="message-box" part="message" aria-live="polite" aria-atomic="true"></div>
</div>
  `;
}
