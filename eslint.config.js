import { reactConfig } from '@crithits/eslint-config-react';

// Shared rules live in @crithits/eslint-config-react (agent-standards repo).
// Don't override them here to get past an error; propose a change upstream.
export default reactConfig({
  tsconfigRootDir: import.meta.dirname,
});
