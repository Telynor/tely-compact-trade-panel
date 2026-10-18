# Tely's Compact Trade Panel

Version 1.0.0 · Foundry VTT v14 · Any game system

Hides all player and GM names, color dots, role labels, and user-row controls
in the bottom-left Players panel for everyone. One invisible active-user row
retains its native dimensions, so the panel stays the same size as a panel
with one connected user, even when more people join. Offline entries remain
hidden when the panel is expanded.

The existing **Request Trade** button, latency, FPS, panel styling, and panel
width remain in place. Item Piles continues to handle trade requests normally.

## Install with a manifest URL

In Foundry's **Add-on Modules → Install Module**, paste this manifest URL:

```text
https://github.com/Telynor/tely-compact-trade-panel/releases/latest/download/module.json
```

Install it, open the world, and enable **Tely's Compact Trade Panel** under
**Manage Modules**. Keep Item Piles' trading and player-list trade button
settings enabled.

## Manual install

1. Extract `tely-compact-trade-panel-v1.0.0.zip` into your Foundry user-data
   `Data/modules` directory. The result must be
   `Data/modules/tely-compact-trade-panel/module.json`.
2. Restart Foundry, open the world, and enable **Tely's Compact Trade Panel**
   under **Manage Modules**.
3. Keep Item Piles enabled with its trading and player-list trade button
   settings enabled. This module preserves that button; Item Piles supplies it.

No build step, configuration, JavaScript, or additional dependency is needed.
The styling applies immediately whenever Foundry renders the panel, including
after users join or leave. Disable this module and reload to restore the list.

## Validation and scope

The manifest and stylesheet were validated against the v14 Players selectors
and Item Piles' current button insertion point. Not tested in a live Foundry
world. Other modules that replace or hide the entire Players panel may need
their own visibility settings adjusted.

This is a visual customization of this panel only. It does not change user
accounts, permissions, connections, or user selection inside trade dialogs.

## References

- [Foundry v14 Players API](https://foundryvtt.com/api/v14/classes/foundry.applications.ui.Players.html)
- [Foundry module development](https://foundryvtt.com/article/module-development/)
- [Item Piles player-list trade button](https://github.com/fantasycalendar/FoundryVTT-ItemPiles/blob/master/src/foundry-ui-overrides.js)
