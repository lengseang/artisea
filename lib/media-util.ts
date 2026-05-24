/**
 * Recursively scans a Tiptap JSON document structure to find the first image node
 * and returns its source URL.
 */
export function extractFirstImageUrl(content: any): string | null {
  if (!content) return null;

  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      return null;
    }
  }

  // Helper search function
  const searchNode = (node: any): string | null => {
    if (!node) return null;
    
    // Check if current node is an image with a src attribute
    if (node.type === 'image' && node.attrs?.src) {
      return node.attrs.src;
    }

    // Recursively check children
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        const found = searchNode(child);
        if (found) return found;
      }
    }

    return null;
  };

  return searchNode(parsedContent);
}
