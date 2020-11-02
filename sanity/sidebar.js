import React from 'react';
import S from '@sanity/desk-tool/structure-builder';

// Build a custom sidebar

export default function Sidebar() {
  return S.list()
    .title(`Slicks Slices`)
    .items([
      // Create a new sub item
      S.listItem()
        .title('Home')
        .icon(() => <strong>🔥</strong>)
        .child(
          S.editor()
            .schemaType('storeSettings')
            // Make a new document ID so we don't have a random string of numbers
            .documentId('downtown')
        ),
      // Add the rest of our document items
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'storeSettings'
      ),
    ]);
}
