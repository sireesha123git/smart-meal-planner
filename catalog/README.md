# Modular recipe catalogue

The planner reads its dishes from JSON rather than hard-coded UI code:

- `recipes.json`: breakfast, lunch, snack and dinner choices.
- `dry-sides.json`: vegetable preparations served with lunch. This file can grow into both dry and gravy vegetable libraries without changing the planner.
- `catalog-policy.json`: catalogue version, six-month review interval and expansion targets.

Every item needs a stable unique `id`, Telugu/English/Hindi `name` and `prep`, per-person `ingredients`, and at least two HTTPS video sources. Main dishes also need a valid `slot`. Vegetable recipes should add `vegetable`, `form` (`dry` or `gravy`), `style`, `kidFriendly`, `elderFriendly`, and `sourceCheckedAt` as the library expands.

Run `npm run recipes:validate` after every edit. A release build runs the same check automatically and stops if required data is missing. Existing IDs must never be reused for a different dish because plans and service history store these IDs.

For a six-month refresh, update the JSON files, increment `catalogVersion`, set `reviewedAt`, validate, test, and publish. Research Bengaluru seasonal vegetables, add up to six dry and six gravy preparations for each, preserve a South/North Indian mix, and refresh the kid-friendly world snack set. Keep only sources that are clear, reputable, and still available.
