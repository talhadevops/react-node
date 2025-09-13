---
title: "RichTextEditor"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RichTextEditor

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/RichTextEditor.tsx" sourceLine="60" packageName="@vendure/admin-ui" />

A rich text editor component which uses ProseMirror (rich text editor) under the hood.

*Example*

```ts
import { RichTextEditor } from '@vendure/admin-ui/react';
import React from 'react';

export function MyComponent() {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const content = form.get("content");
    console.log(content);
  };

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <RichTextEditor
        name="content"
        readOnly={false}
        onMount={(e) => console.log("Mounted", e)}
      />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
```

