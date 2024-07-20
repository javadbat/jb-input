export function renderHTML():string{
  return /* html */ `
    <div class="jb-input-web-component">
    <label class="--hide"><span class="label-value" part="label"></span></label>
    <div class="input-box">
        <div class="jb-input-start-section-wrapper">
            <slot name="start-section"></slot>
        </div>
        <input part="input"/>
        <div class="jb-input-end-section-wrapper">
            <slot name="end-section"></slot>
        </div>
    </div>
    <div class="message-box" part="message"></div>
</div>
  `;
}