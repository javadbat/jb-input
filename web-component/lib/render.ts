export function renderHTML():string{
  return /* html */ `
    <div class="jb-input-web-component" part="root">
    <label for="input" part="label"></label>
    <div class="control" part="control">
        <div class="jb-input-inline-start-wrapper">
            <slot name="inline-start"></slot>
        </div>
        <input id="input" part="input" aria-describedby="message"/>
        <div class="jb-input-inline-end-wrapper">
            <slot name="inline-end"></slot>
        </div>
    </div>
    <div id="message" class="message-box" part="message" aria-live="polite" aria-atomic="true"></div>
</div>
  `;
}
