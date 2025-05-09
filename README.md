# pack-packages

**Effortlessly manage and install local packages, bypassing npm's single-scope registry limitations.**  
Brought to you by Zero Open Source™ (aka ZeroOpenSource™; Zero)

---

## 🧩 What is `pack-packages`?

`pack-packages` is a utility designed to overcome a common challenge with npm: installing packages from different sources (like a private registry and the public npm registry) when they share the same scope (e.g., `@mycompany/`).

npm typically forces you to choose one registry per scope. `pack-packages` provides a workaround by:

1.  📦 **Packing** your specified local or private packages into `.tgz` archives.
2.  🔧 Allowing you to **install** these packed archives directly as file dependencies, effectively bypassing the single-registry-per-scope restriction.

This is particularly useful when you have a mix of private packages (e.g., from a Verdaccio server or GitHub Packages) and public packages under the same scope, or when you want to test local monorepo packages as if they were installed from a registry.

---

## ✨ Features

- 🎯 **Bypass Scope Conflicts**: Install packages from multiple sources under the same scope.
- 📦 **Local Packing**: Converts local package folders into installable `.tgz` files using `npm pack` (or yarn/pnpm equivalent).
- ⚙️ **Simple Configuration**: Define packages to pack via `package.json` or a dedicated config file.
- 🚀 **Streamlined Workflow**: Easy-to-use CLI for packing your specified packages.
- 🤝 **Monorepo Friendly**: Ideal for testing and integrating local monorepo packages into other projects.
- 📂 **Customizable Output**: Specify where your packed `.tgz` files are stored.

---

## 🛠️ How it Works

`pack-packages` simplifies the process of using local packages as if they were from different registries:

1.  **Configure**: Specify which local packages you want to "pack" in your project's `package.json` or a `pack-packages.config.js` file.
2.  **Pack**: Run the `pack-packages` command. It will:
    *   Navigate to each specified local package directory.
    *   Execute `npm pack` (or a custom pack script like `yarn pack` / `pnpm pack`) to create a `.tgz` archive.
    *   Copy these archives to a designated output directory (default: `./.packed-packages`) in your project root.
3.  **Install**: Modify your project's `package.json` to point to these local `.tgz` files using the `file:` protocol.
    ```json
    // package.json
    "dependencies": {
      "@my-scope/private-package": "file:.packed-packages/my-scope-private-package-1.0.0.tgz",
      "@my-scope/another-local-pkg": "file:.packed-packages/my-scope-another-local-pkg-0.5.0.tgz"
      // ... other dependencies from public npm under @my-scope can now be fetched normally
    }
    ```
4.  **Run Install Command**: Execute `npm install`, `yarn install`, or `pnpm install`. The package manager will install the local `.tgz` files for the specified packages and fetch others (even under the same scope) from the configured registry (e.g., public npm).

---

## 🚀 Getting Started

### 📦 Installation

Install `pack-packages` as a dev dependency in your project:

```bash
npm install --save-dev @zeroopensource/pack-packages
yarn add --dev @zeroopensource/pack-packages
pnpm add --save-dev @zeroopensource/pack-packages
```

### ⚙️ Configuration

You can configure `pack-packages` in two ways:

**1. Using `package.json` (for simple configurations):**

Add a `packPackages` section to your project's `package.json`:

```json
// package.json
{
  "name": "my-consuming-project",
  "version": "1.0.0",
  // ...
  "packPackages": {
    "outputDir": "./.packed-dependencies", // Optional: default is './.packed-packages'
    "packages": [
      { "name": "@my-scope/private-ui-kit", "path": "../private-ui-kit" },
      { "name": "@my-scope/internal-utils", "path": "/path/to/another/local/package/internal-utils" }
      // Add more local packages here
    ]
  }
  // ...
}
```

**2. Using `pack-packages.config.js` (Recommended for more complex setups):**

Create a `pack-packages.config.js` file in your project root:

javascript
// pack-packages.config.js
module.exports = {
  outputDir: './.packed-dependencies', // Optional: default is './.packed-packages'
  packages: [
    { name: '@my-scope/private-ui-kit', path: '../private-ui-kit' },
    { name: '@my-scope/internal-utils', path: '../internal-utils', script: 'pnpm pack' }, // Optional: specify pack script
    // Add more local packages here
  ],
};


**Package Configuration Options:**

   `name` (String, Optional): The expected name of the package (e.g., `@my-scope/private-ui-kit`). If not provided, `pack-packages` will attempt to read it from the target package's `package.json`. Used for logging.
   `path` (String, Required): Relative path from your project root to the local package directory you want to pack.
   `script` (String, Optional): Custom pack command to run in the package directory (e.g., `yarn pack`, `pnpm pack`). Defaults to `npm pack`.

### 🏃‍♀️ Running `pack-packages`

Once configured, run the pack command from your project root:

bash
npx pack-packages


Or add it to your `scripts` in `package.json`:

+json
+// package.json
+"scripts": {
+  "preinstall": "npx pack-packages", // Example: run before every install
+  "pack-local": "npx pack-packages"
+}


+This will generate `.tgz` files for your specified packages in the `outputDir` (e.g., `./.packed-dependencies` if configured, otherwise `./.packed-packages`). The generated filenames will typically be in the format `package-name-version.tgz` (e.g., `my-scope-private-ui-kit-1.2.3.tgz`).

### 📦 Using the Packed Packages

After running `pack-packages`, update your project's `package.json` to use the `file:` protocol for these dependencies. You'll need to know the version of the packed package to construct the correct filename.

json
// package.json (assuming outputDir was set to './.packed-dependencies')
"dependencies": {
  "@my-scope/private-ui-kit": "file:.packed-dependencies/my-scope-private-ui-kit-1.0.0.tgz",
  "@my-scope/internal-utils": "file:.packed-dependencies/my-scope-internal-utils-0.5.0.tgz",
  "@my-scope/public-package": "^1.2.3" // This will be fetched from the configured registry
+}
+
Note: The version in the `.tgz` filename (e.g., `1.0.0`) is derived from the `version` field in the `package.json` of the package being packed.*


## 🤔 Why `pack-packages`?

NPM's architecture ties a scope (e.g., `@mycompany`) to a single registry defined in your `.npmrc`. If you need to consume packages under the same scope from both a private registry (like GitHub Packages, Verdaccio, or Artifactory) and the public npm registry, you'll face a conflict. `npm` will attempt to fetch all packages under that scope from the single configured registry.

`pack-packages` circumvents this by:
1.  Taking your "private" or "alternative-source" packages (which are available locally).
2.  Running `npm pack` (or equivalent) on them to create standard `.tgz` package archives.
3.  Allowing you to reference these `.tgz` files directly in your `package.json` using the `file:` protocol.

This way, `npm`/`yarn`/`pnpm` resolve these specific dependencies locally from the packed files, while other dependencies (even those under the same scope but not packed locally) are fetched from the primary registry configured for that scope (or the default public registry).

It's a practical solution for:
   Integrating private and public packages under a unified scope without complex `.npmrc` gymnastics for each developer or CI environment.
   Testing local monorepo packages in a dependent project as if they were installed from a registry, ensuring a more realistic integration test.
   Working in environments where modifying global or per-user `.npmrc` files to switch registries for a scope is cumbersome or not feasible.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have ideas for improvements or find any bugs.

