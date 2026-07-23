export const profiles = {
  architect: {
    name: "🏛️ Arquiteto",
    prompt: "architect.md",
    docs: [
      "_docs/00_context.md",
      "_docs/01_system_overview.md",
    ],
  },

  developer: {
    name: "💻 Desenvolvedor",
    prompt: "developer.md",
    docs: [
      "_docs/00_context.md",
      "_docs/01_system_overview.md",
    ],
  },

  product: {
    name: "📋 Gerente do Produto",
    prompt: "product.md",
    docs: [
      "_docs/00_context.md",
    ],
  },

  ux: {
    name: "🎨 UX",
    prompt: "ux.md",
    docs: [
      "_docs/00_context.md",
    ],
  },
} as const;