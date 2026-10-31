# CulturInd.ai illustration system

The definitive reference is `public/art/kila-original.png`, copied byte-for-byte from the supplied original. The canonical React component is `src/components/KilaMascot.tsx`. Every mascot placement uses this component. The original artwork takes precedence when written specifications differ from what is visibly drawn; no arms, legs or extra outlines were added.

The direction is soft hand-drawn storybook illustration with a whimsical pastel 2D aesthetic. Keep buttery yellow, cream, muted sage, lavender, powder blue and peach, with warm brown text and linework. Match the original character's organic silhouette, expressive face, simple highlights and pencil-like grain. Avoid glossy surfaces, neon, plastic rendering, photorealism and stock-vector mixtures.

`src/index.css` owns the palette, spacing, surfaces, focus treatment and responsive layout. `tailwind.config.js` maps the existing app's utility names to the new palette. The old `neon-*` names remain compatibility aliases; their rendered colors are restrained brown-based accent colors and their glow effects are removed.

The artwork library is centralized in `StoryArt.tsx`:

- `story-atlas.webp`: batik, wayang, angklung, a generic food bowl, a storybook and conversation bubbles.
- `culture-atlas.webp`: songket, gamelan saron, rendang, nasi goreng, Saman, ikat, keris, Borobudur and pisang goreng.
- `culture-landscape.webp`: a coherent hero vignette with rumah gadang and joglo forms, wayang, angklung and batik.
- The corresponding PNG files in `art-source/` retain the generated source artwork. WebP versions are used for delivery.

The cultural artwork was generated against the supplied Kila and matching artwork references, then reviewed visually. It is stylized educational illustration, not documentation of a particular historical garment, choreography, artifact or household recipe. Regional and ceremonial details still require review by the relevant community before use as authoritative teaching material. Gallery detail views state this distinction.

New illustrations must use the same pencil texture, soft palette, outline treatment and level of finish. Make the actual cultural object recognizable; do not substitute another instrument or dish. Reactions appearing in fictional community posts are textual emoji, not the platform's cultural illustration assets.

Use dark text on pastel surfaces, clear focus indicators, readable labels and simple compositions. Respect reduced motion. Keep content usable independently of illustrations, audio or camera access.
