import { visit } from 'unist-util-visit';

/**
 * Rehype plugin: converts ==text== in text nodes to <mark>text</mark>
 */
export default function rehypeMark() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value || !node.value.includes('==')) return;

      const parts = node.value.split(/(==.+?==)/g);
      if (parts.length === 1) return;

      const newChildren = parts.map((part) => {
        if (part.startsWith('==') && part.endsWith('==')) {
          return {
            type: 'element',
            tagName: 'mark',
            properties: {},
            children: [{ type: 'text', value: part.slice(2, -2) }],
          };
        }
        return { type: 'text', value: part };
      }).filter(n => n.type !== 'text' || n.value);

      parent.children.splice(index, 1, ...newChildren);
    });
  };
}
