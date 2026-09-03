# Changelog

## [4.0.0] - 2026-09-03

### Changed

- Standardized private DOM event handlers on the `#on<Target><Event>()` naming convention.
- Standardized private empty-value and form synchronization helpers as `#clearValue()` and `#updateFormValue()`.
- Added the standard public `reset()` method; native form reset delegates to the same behavior.
- Breaking: renamed the public input container part to `control` and directional slots to `inline-start`/`inline-end`.
- Breaking: renamed React keyboard event props to the React convention: `onBeforeInput`, `onKeyDown`, and `onKeyUp`; old prop names are removed.
- Breaking: standardized the message error color token on `--jb-input-message-color-error`; the old variable name is removed.

## [3.19.0] - 2026-08-22

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.
- Updated component color defaults to use the shared semantic content and surface tokens.

## [3.18.0] - 2026-07-30

### Added

- Added the standard `formDisabledCallback()` to synchronize the component disabled state with disabled forms and fieldsets.
- Added Storybook interaction coverage for initial-value initialization, live-value precedence, explicit `null`, and native form reset.

### Changed

- Updated `initialValue` to seed `value` only until the live value is explicitly set; native form reset restores the latest initial value and re-enables initialization.
- Updated the React wrapper so an omitted `value` does not overwrite `initialValue`, while explicit `null` still clears the live value.

## [3.17.0] 2026-07-18

### Added

- Added the standard `formResetCallback()` to restore `initialValue` and clear validation state.
- Added a Storybook styling guide with reusable style recipes for Carbon, Aurora, Forest, Sunset, Porcelain, Candy, Terminal, Material, Fluent, Bootstrap, Cupertino, and Ant Design examples.
- Added `disabled` and `invalid` custom states plus the full public CSS variable list to the custom elements manifest.

### Changed

- Input heights now inherit the shared `--jb-control-height-*` theme tokens for each size while preserving `--jb-input-height*` as the component-level override.
- Added the React `initialValue` prop and forwarded `value` and `initialValue` directly as React 19 custom-element properties.
- Breaking: renamed `--jb-input-bgcolor` to `--jb-input-bg-color`.
- Breaking: renamed `--jb-input-message-error-color` to `--jb-input-message-color-error`.
- Added public inline spacing and inline slot padding variables for each size.
- Standardized theme recipes on tag-qualified host selectors and exported parts for composed date and time inputs.
- Increased Carbon label and message spacing for clearer separation from the input box.

### Fixed

- Preserved property-assigned values during connection when no `value` attribute is present.
